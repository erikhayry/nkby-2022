import { JSDOM } from 'jsdom'
import * as Crawler from 'crawler'

const CRAWLER_CONF = {
  maxConnections: 10,
  jQuery: JSDOM
}



export async function crawl (url: string | string[], selector: string): Promise<Element[]> {
  const elements: Element[] = []
  return new Promise((resolve, reject) => {
    const crawler = new Crawler({
      ...CRAWLER_CONF,
      callback: (error, response, done) => {
        if (error) {
          console.log(error)
          return []
        } else {
          const document = new JSDOM(response.body).window.document
          const newElements = Array.from(document.querySelectorAll(selector))
          elements.push(...newElements)
        }
        done()
      }
    })

    crawler.queue(url)
    crawler.on('drain', () => {
      resolve(elements)
    })
  })
}
