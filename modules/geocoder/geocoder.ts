import { GeocodingResult, LatLngLiteral } from '@google/maps'
import { geoCodeAddress } from '../googleMaps/googleMaps'

const CITY = 'Nykarleby'
const COUNTRY = 'Finland'

function getLatLng (geoCodingResult: GeocodingResult[]): LatLngLiteral | undefined {
  return geoCodingResult?.[0]?.geometry.location
}

export async function geoCodeLocation (locationName: string, zipcode: string): Promise<LatLngLiteral | undefined> {
  const address = `${locationName}, ${zipcode}, ${CITY} ${COUNTRY}`
  const response = await geoCodeAddress(address)

  return getLatLng(response.results)
}