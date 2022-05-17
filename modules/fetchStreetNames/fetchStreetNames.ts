import crawl from '../crawler/crawler'
import { POSTI_URL } from '../../config'
import { PCZipcode, PCZipcodeWithStreetNames } from '../../types'
import { removeEmptySpace } from '../regex/regex'
import { ILocale } from '../db/db'

function toStreetName(textContent: string): string {
    return removeEmptySpace(textContent)
}

function outEmptyElement(textContent: string | null): textContent is string {
    return Boolean(textContent)
}

function toTextContent({ textContent }: Element): string | null {
    return textContent
}

function toLocale(name: string, zipCode: string): ILocale {
    return {
        zipCode,
        name,
    }
}

async function fetchStreetNamesForZipcode(
    path: string,
    zipCode: string
): Promise<ILocale[]> {
    const elements = await crawl(
        `${POSTI_URL}${path}`,
        '.data table table td div:not(.ipono_tooltip)'
    )

    return elements
        .map(toTextContent)
        .filter(outEmptyElement)
        .map(toStreetName)
        .filter(outEmptyElement)
        .map((streetName) => toLocale(streetName, zipCode))
}

async function toLocales(
    locales: Promise<ILocale[]>,
    { href, zipcode }: PCZipcode
): Promise<ILocale[]> {
    const partial = await locales

    if (href) {
        const newLocales = await fetchStreetNamesForZipcode(href, zipcode)
        return partial.concat(newLocales)
    }

    return partial
}

export async function fetchStreetNames(
    zipCodes: PCZipcode[]
): Promise<ILocale[]> {
    return await zipCodes.reduce(
        toLocales,
        Promise.resolve([]) as Promise<ILocale[]>
    )
}
