import { geoCodeLocation } from './geocoder'

const MISSING_NAME = 'missing'

jest.mock('./googleMaps', () => ({
  geoCodeAddress: jest.fn((address: string) => {
    if (address.startsWith(MISSING_NAME)) {
      return {
        results: undefined
      }
    }

    return {
      results: [
        {
          geometry: {
            location: {
              lat: '20',
              lng: '40'
            }
          }
        }
      ]
    }
  })
}))

describe('Geo coder', () => {
  test('do not return lat lng if missing', async () => {
    const location = await geoCodeLocation(MISSING_NAME, 'zipCode')

    expect(location).toBeUndefined()
  })

  test('return lat lng if exists', async () => {
    const { lat, lng } = await geoCodeLocation('name', 'zipCode') || {}

    expect(lat).toEqual('20')
    expect(lng).toEqual('40')
  })
})
