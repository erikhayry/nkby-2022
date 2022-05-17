import { ILocale } from '../db/db'
import { geoCodeLocation } from '../geocoder/geocoder'

async function getLocation(zipCode: string, name: string): Promise<ILocale> {
    const location = await geoCodeLocation(zipCode, name)

    return {
        zipCode,
        location,
        name,
    }
}

async function localesToLocation({ name, zipCode }: ILocale): Promise<ILocale> {
    return getLocation(zipCode, name)
}

export async function getLocations(locales: ILocale[]): Promise<ILocale[]> {
    return await Promise.all(locales.map(localesToLocation))
}
