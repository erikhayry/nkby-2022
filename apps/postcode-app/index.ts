import { LatLngLiteral } from '@google/maps'
import { ILatLng } from 'nkby'
import { Locations, saveLocales } from '../../db'
import { crawl } from '../../utils/crawler'
import { geoCodeLocation } from './utils/geocoder'
import { removeEmptySpace } from './utils/regex'

const POSTI_URL = 'https://www.verkkoposti.com'
const ZIPCODE_CATALOGUE_URL = `${POSTI_URL}/e3/svenska/postnummercatalog`
const COMMUNE = 'Nykarleby'

type IZipcode = {
    href: string | null,
    zipcode: string
}

function elementToStreetName ({ textContent }: Element): string {
  return removeEmptySpace(textContent)
}

async function fetchStreetNamesForZipcode (path: string): Promise<string[]> {
  const elements = await crawl(`${POSTI_URL}${path}`, '.data table table td div:not(.ipono_tooltip)')

  return elements.map(elementToStreetName)
}

type IZipcodeWithStreetNames = Record<string, string[]>;

async function zipCodeToStreetNames (streetNames: Promise<IZipcodeWithStreetNames>, { href, zipcode }: IZipcode): Promise<IZipcodeWithStreetNames> {
  const partial = await streetNames

  partial[zipcode] = await fetchStreetNamesForZipcode(href)

  return partial
}

async function fetchStreetNames (zipCodes: IZipcode[]): Promise<IZipcodeWithStreetNames> {
  return await zipCodes.reduce(zipCodeToStreetNames, {} as Promise<IZipcodeWithStreetNames>)
}

function elementToZipcode (zipcodes: IZipcode[], element: Element): IZipcode[] {
  const href = element.getAttribute('href')

  if (href && element.textContent) {
    zipcodes.push({
      href,
      zipcode: removeEmptySpace(element.textContent)
    })
  }

  return zipcodes
}

async function fetchZipcodeLinks (): Promise<IZipcode[]> {
  const elements = await crawl(`${ZIPCODE_CATALOGUE_URL}?postcodeorcommune=${COMMUNE}`, '.data td a')

  return elements.reduce(elementToZipcode, [])
}

async function getLocations (streetNames: Record<string, string[]>): Promise<ILatLng[]> {
  return await Promise.all(Object.entries(streetNames).map(async ([zipCode, streetNames]) => {
    const latLng = await geoCodeLocation(zipCode, streetNames[0])

    return latLng
  }))
}

async function run () {
  const zipCodeUrls = await fetchZipcodeLinks()
  console.log(zipCodeUrls)

  const streetNames = await fetchStreetNames(zipCodeUrls)
  console.log(streetNames)

  const locations = await getLocations(streetNames)

  console.log(locations)

  // saveLocales(locations)
}

run()
