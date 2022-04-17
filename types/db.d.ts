declare module 'nkby' {
  interface ILocationType {
    STREET: 'street'
  }

  interface ILatLng {
      lat: number;
      lng: number;
  }

  interface ILocation {
    name: string;
    type: ILocationType;
    latLng: ILatLng | undefined;
  }

  type ILocations = Record<string, Location[]>;
}
