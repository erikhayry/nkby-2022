import { crawl } from '../../utils/crawler'

const POST_URL = process.env.POST_URL || 'https://www.verkkoposti.com/e3/svenska/postnummercatalog'
const LOCALES_FILE_NAME = process.env.LOCALES_FILE_NAME || 'locales.json'
const ZIP_CODE_URL = process.env.ZIP_CODE_URL || 'https://www.verkkoposti.com'
const COMMUNE = process.env.COMMUNE || 'Nykarleby'

type Zipcode = {
    href: string | null,
    zipcode: string
}

function getZipCode (zipCodeUrl: string): string | undefined {
  const regex = new RegExp('[?&]zipcode(=([^&#]*)|&|#|$)')
  const results = regex.exec(zipCodeUrl)

  if (!results || !results[2]) {
    return undefined
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

function sortUrlsByZipcode (zipCodeUrls: string[]): Record<string, string[]> {
  return zipCodeUrls.reduce((acc, zipCodeUrl) => {
    const zipCode = getZipCode(zipCodeUrl)

    if (zipCode) {
      if (acc[zipCode]) {
        acc[zipCode].push(zipCodeUrl)
      } else {
        acc[zipCode] = [zipCodeUrl]
      }
    }

    return acc
  }, {} as Record<string, string[]>)
}

async function getZipcodeLinks (commune: string): Promise<Zipcode[]> {
  const result = await crawl(`${POST_URL}?streetname=&postcodeorcommune=${commune}`, '.data td a')

  return result.map(element => ({ href: element.getAttribute('href'), zipcode: element.innerHTML }))
}

async function run () {
  const zipCodeUrls = await getZipcodeLinks(COMMUNE)

  console.log(zipCodeUrls)

  // getStreetNames(zipCodeUrls)
  // console.log(zipCodeUrls);
}

run()
