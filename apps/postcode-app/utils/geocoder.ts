import * as maps from '@google/maps'
import { GeocodingResponse, GeocodingResponseStatus, GeocodingResult, LatLngLiteral } from '@google/maps'
import 'dotenv/config'

const CITY = 'Nykarleby'
const COUNTRY = 'Finland'

const mapClient = maps.createClient({
  key: process.env.GEOCODE_API,
  Promise: Promise
})

function geoCodeAddress (address:string): Promise<GeocodingResponse<GeocodingResponseStatus>> {
  return new Promise((resolve, reject) =>
    mapClient.geocode({ address })
      .asPromise()
      .then(({ json }) => resolve(json))
      .catch(reject)
  )
}

function getLatLng (geoCodingResult: GeocodingResult[]): LatLngLiteral | undefined {
  return geoCodingResult?.[0]?.geometry.location
}

export async function geoCodeLocation (locationName: string, zipcode: string): Promise<LatLngLiteral | undefined> {
  const address = `${locationName}, ${zipcode}, ${CITY} ${COUNTRY}`
  const response = await geoCodeAddress(address)

  return getLatLng(response.results)
}
