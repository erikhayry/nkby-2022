import { LatLng } from '../../../types/db'

export type PCZipcode = {
      href: string | null,
      zipcode: string
  }

export type PCLocation = {
    zipCode: string,
    latLng: LatLng | undefined,
    name: string;
  }

export type PCZipcodeWithStreetNames = Record<string, string[]>;
