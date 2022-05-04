import mongoose, { model, Schema } from 'mongoose'
import { backup } from '../backup/backup'

export enum ACTION_NAME {
    CRAWL = 'crawl',
}

interface IAction {
    name: ACTION_NAME
    date: number
}

const actionSchema = new Schema<IAction>({
    name: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    date: { type: Number, required: true },
})

const Action = model<IAction>('Action', actionSchema)

async function connect() {
    await mongoose.connect('mongodb://localhost:27017/nkby')
    console.log('connected')
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
