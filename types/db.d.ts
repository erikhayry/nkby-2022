import { LocationType } from './enums'

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
