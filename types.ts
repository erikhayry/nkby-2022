export enum LocationType {
  STREET = "street",
}

interface LatLng {
  lat: number;
  lng: number;
}

interface Location {
  id: string;
  name: string;
  zipCode: string;
  type: LocationType;
  latLng: LatLng | undefined;
}

export type PCZipcode = {
  href: string | null;
  zipcode: string;
};

export type PCLocation = {
  zipCode: string;
  latLng: LatLng | undefined;
  name: string;
};

export type PCZipcodeWithStreetNames = Record<string, string[]>;
