import * as fs from 'fs'
import * as path from 'path'
import { LatLng, Location } from '../types/db'
import { LocationType } from '../types/enums'

const DATA_ROOT_FOLDER = 'data'

enum DBKEY {
    LOCALES = 'locales',
}

type DBData = any

type DBENTRY = {
    date: Date,
    data: any
}

type DBLocations = Record<string, Location>;

type DBSaveData = {
  key: DBKEY.LOCALES,
  data: DBLocations
}

function buildData (data: DBData): DBENTRY {
  return {
    date: new Date(),
    data
  }
}

function getPath (key: DBKEY) {
  return path.resolve(__dirname, `${DATA_ROOT_FOLDER}/${key}.json`)
}

function read (key: DBKEY): DBData {
  const json = fs.readFileSync(getPath(key), 'utf8')
  const dbEntry = JSON.parse(json) as DBENTRY

  return dbEntry.data
}

function save ({ key, data }: DBSaveData): DBData {
  const json = JSON.stringify(buildData(data), null, '\t')

  fs.writeFileSync(getPath(key), json)

  return read(key)
}

export function readLocales (): Location[] {
  const locales = read(DBKEY.LOCALES) as DBLocations

  return Object.values(locales).map(locale => locale)
}

export function saveStreets (streets: {name: string, latLng: LatLng, zipCode: string}[]): Location[] {
  const locations = streets.reduce((acc, { name, latLng, zipCode }) => {
    const id = `${zipCode}-${name}`
    acc[id] = {
      id,
      name,
      type: LocationType.STREET,
      latLng,
      zipCode
    }

    return acc
  }, {} as DBLocations)

  return save({ key: DBKEY.LOCALES, data: locations })
}
