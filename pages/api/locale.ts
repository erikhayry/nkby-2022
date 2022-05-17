// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    addLocales,
    getLocales,
    getLocalesNoInDB,
    getLocalesWithoutLocation,
} from '../../modules/db/db'
import { fetchStreetNames } from '../../modules/fetchStreetNames/fetchStreetNames'
import { fetchZipcodeLinks } from '../../modules/fetchZipcodeLinks/fetchZipcodeLinks'
import { getLocations } from '../../modules/getLocations/getLocations'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const zipCodeLinks = await fetchZipcodeLinks()
    const fetchedLocales = await fetchStreetNames(zipCodeLinks)
    const newLocales = await getLocalesNoInDB(fetchedLocales)
    const localesWithoutLocation = await getLocalesWithoutLocation()
    const recheckLocales = newLocales.concat(localesWithoutLocation)

    if (recheckLocales.length) {
        const localesWithLocation = await getLocations(recheckLocales)
        await addLocales(localesWithLocation)
    }

    const savedLocales = await getLocales()

    res.status(200).json(JSON.stringify(savedLocales))
}
