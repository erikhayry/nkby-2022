import { PCLocation } from '../types'
import { geoCodeLocation } from './geocoder'

async function getLocation (zipCode: string, name: string): Promise<PCLocation> {
  const latLng = await geoCodeLocation(zipCode, name)

  return {
    zipCode,
    latLng,
    name
  }
}

async function streetNamesPerZipCodesToLocation (locations: Promise<PCLocation[]>, [zipCode, streetNames]: [string, string[]]): Promise<PCLocation[]> {
  const partial = await locations
  const locationWithLatLng = await Promise.all(streetNames.map((name) => getLocation(zipCode, name)))

  partial.push(...locationWithLatLng)

  return partial
}

export async function getLocations (streetNamesPerZipCodes: Record<string, string[]>): Promise<PCLocation[]> {
  return Object.entries(streetNamesPerZipCodes).reduce(streetNamesPerZipCodesToLocation, Promise.resolve([]) as Promise<PCLocation[]>)
}
