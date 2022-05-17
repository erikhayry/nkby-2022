export enum LocationType {
    STREET = 'street',
}

export interface ILatLng {
    lat: number
    lng: number
}

export type PCZipcode = {
    href: string | null
    zipcode: string
}

export type PCLocation = {
    zipCode: string
    latLng: ILatLng | undefined
    name: string
}

export type PCZipcodeWithStreetNames = Record<string, string[]>
