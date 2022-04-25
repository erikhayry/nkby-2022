import { crawl } from '../../../modules/crawl'
import { POSTI_URL } from '../../config'
import { PCZipcode } from '../types'
import { removeEmptySpace } from './regex'

const ZIPCODE_CATALOGUE_URL = `${POSTI_URL}/e3/svenska/postnummercatalog`
const COMMUNE = 'Nykarleby'

function toZipcode (zipcodes: PCZipcode[], element: Element): PCZipcode[] {
  const href = element.getAttribute('href')

  if (href && element.textContent) {
    zipcodes.push({
      href,
      zipcode: removeEmptySpace(element.textContent)
    })
  }

  return zipcodes
}

export async function fetchZipcodeLinks (): Promise<PCZipcode[]> {
  const elements = await crawl(`${ZIPCODE_CATALOGUE_URL}?postcodeorcommune=${COMMUNE}`, '.data td a')

  return elements.reduce(toZipcode, [])
}
