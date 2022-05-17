import mongoose, { Collection, model, Schema } from 'mongoose'
import { DB_URL } from '../../config'
import { ILatLng } from '../../types'
import { backup } from '../backup/backup'
import { ACTION_NAME, MODEL } from './types'

interface IAction {
    name: ACTION_NAME
    date: number
}

const ActionSchema = new Schema<IAction>({
    name: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    date: { type: Number, required: true },
})

const Action = model<IAction>(MODEL.ACTION, ActionSchema)

export interface ILocale {
    name: string
    zipCode: string
    location?: ILatLng
}

class LatLng extends mongoose.SchemaType {
    cast(latLng: ILatLng) {
        if (typeof latLng.lat !== 'number' || typeof latLng.lat !== 'number') {
            throw new Error('Invalid LatLng')
        }
        return latLng
    }
}

mongoose.Schema.Types.LatLng = LatLng

const LocaleSchema = new Schema<ILocale>(
    {
        name: { type: String, required: true },
        zipCode: { type: String, required: true },
        location: { type: LatLng, required: false },
    },
    { _id: false }
)
LocaleSchema.index({ name: 1, zipCode: 1 }, { unique: true })

const Locale = model<ILocale>(MODEL.LOCALE, LocaleSchema)

async function connect() {
    await mongoose.connect(DB_URL)
}

export async function saveAction(name: ACTION_NAME) {
    await connect()
    await Action.updateOne(
        { name },
        { $set: { date: new Date().getTime() } },
        { upsert: true }
    )

    const filter = {}
    const all = await Action.find(filter)

    backup(JSON.stringify(all.map((data) => data.toJSON())))
}

export async function getLocales() {
    await connect()
    const filter = {}
    const locales = await Locale.find(filter)

    return locales
}

async function toOnlyNewLocales(
    locales: Promise<ILocale[]>,
    locale: ILocale
): Promise<ILocale[]> {
    const partial = await locales
    const exists = await Locale.exists({
        name: locale.name,
        zipCode: locale.zipCode,
    })

    if (!Boolean(exists)) {
        partial.push(locale)
    }

    return partial
}

export async function getLocalesWithoutLocation() {
    await connect()

    return await Locale.find({
        location: {
            $exists: false,
        },
    })
}

export async function getLocalesNoInDB(locales: ILocale[]) {
    await connect()

    const newLocales = await locales.reduce(
        toOnlyNewLocales,
        Promise.resolve([]) as Promise<ILocale[]>
    )

    return newLocales
}

export async function getLocale(zipCode: string, name: string) {
    const locale = await Locale.find({})

    return locale
}

export async function addLocale(locale: ILocale) {
    await connect()
    const newLocale = new Locale(locale)
    await newLocale.save()

    return getLocales()
}

export async function addLocales(locales: ILocale[]) {
    await connect()

    return Locale.insertMany(locales)
}
