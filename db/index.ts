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
   latLang: ILatLng;
}

export type Locations = Record<string, string[]>;

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
  data: {
    id: string,
    name: string,
    latLng: ILatLng,
    zipCode: string
  }[]
}

function save ({ key, data }: ISaveData): Data {
  const json = JSON.stringify(buildData(data), null, '\t')

  fs.writeFileSync(getPath(key), json)

  return read(key)
}

export function readLocales (): Locations {
  return read(KEY.LOCALES)
}

export function saveLocales (locales: {name: string, latLng: ILatLng, zipCode: string}[]): DBLocation[] {
  const data = locales.map(({ name, latLng, zipCode }) => ({
    id: `${zipCode}-${name}`,
    name,
    latLng,
    zipCode
  }))

  return save({ key: KEY.LOCALES, data })
}
