import * as fs from 'fs'
import { ILatLng } from 'nkby'
import * as path from 'path'

const ROOT = 'data'

enum KEY {
    LOCALES = 'locales',
}

type Data = any

type DB_ENTRY = {
    date: Date,
    data: any
}

type DBLocation = {
   id: string;
   zipCode: string;
   name: string;
   latLng: ILatLng;
}

type DBLocations = Record<string, DBLocation>;

function buildData (data: Data): DB_ENTRY {
  return {
    date: new Date(),
    data
  }
}

function getPath (key: KEY) {
  return path.resolve(__dirname, `${ROOT}/${key}.json`)
}

function read (key: KEY): Data {
  const json = fs.readFileSync(getPath(key), 'utf8')
  const dbEntry = JSON.parse(json) as DB_ENTRY

  return dbEntry.data
}

type ISaveData = {
  key: KEY.LOCALES,
  data: DBLocations
}

function save ({ key, data }: ISaveData): Data {
  const json = JSON.stringify(buildData(data), null, '\t')

  fs.writeFileSync(getPath(key), json)

  return read(key)
}

export function readLocales (): DBLocation[] {
  const locales =  read(KEY.LOCALES) as DBLocations;

  return Object.values(locales).map(locale => locale)
}

export function saveLocales (locales: {name: string, latLng: ILatLng, zipCode: string}[]): DBLocation[] {
  const data = locales.reduce((acc, { name, latLng, zipCode }) => {
    const id = `${zipCode}-${name}`;
    acc[id] = {
      id ,
      name,
      latLng,
      zipCode
    }

    return acc;
  }, {} as DBLocations)


  return save({ key: KEY.LOCALES, data })
}
