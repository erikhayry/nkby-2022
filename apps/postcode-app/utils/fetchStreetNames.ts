import { crawl } from '../../../utils/crawler'
import { POSTI_URL } from '../../config'
import { PCZipcode, PCZipcodeWithStreetNames } from '../types'
import { removeEmptySpace } from './regex'

function elementToStreetName (textContent: string): string {
  return removeEmptySpace(textContent)
}

function isEmptyElement (textContent: string | null): textContent is string {
  return Boolean(textContent)
}

function elementToTextContent ({ textContent }: Element): string | null {
  return textContent
}

async function fetchStreetNamesForZipcode (path: string): Promise<string[]> {
  const elements = await crawl(`${POSTI_URL}${path}`, '.data table table td div:not(.ipono_tooltip)')

  return elements.map(elementToTextContent).filter(isEmptyElement).map(elementToStreetName)
}

async function zipCodeToStreetNames (streetNames: Promise<PCZipcodeWithStreetNames>, { href, zipcode }: PCZipcode): Promise<PCZipcodeWithStreetNames> {
  const partial = await streetNames

  if (href) {
    partial[zipcode] = await fetchStreetNamesForZipcode(href)
  }

  return partial
}

export async function fetchStreetNames (zipCodes: PCZipcode[]): Promise<PCZipcodeWithStreetNames> {
  return await zipCodes.reduce(zipCodeToStreetNames, {} as Promise<PCZipcodeWithStreetNames>)
}
