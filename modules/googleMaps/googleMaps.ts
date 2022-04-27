import * as maps from '@google/maps'
import { GeocodingResponse, GeocodingResponseStatus } from '@google/maps'

const mapClient = maps.createClient({
  key: process.env.GEOCODE_API || '',
  Promise: Promise
})

export async function geoCodeAddress (address:string): Promise<GeocodingResponse<GeocodingResponseStatus>> {
  return new Promise((resolve, reject) =>
    mapClient.geocode({ address })
      .asPromise()
      .then(({ json }) => resolve(json))
      .catch(reject)
  )
}