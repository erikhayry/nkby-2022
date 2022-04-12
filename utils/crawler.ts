import { JSDOM } from 'jsdom'
import got from 'got'

export async function crawl (url: string, selector: string): Promise<Element[]> {
  const response = await got(url)
  const dom = new JSDOM(response.body)

  return Array.from(dom.window.document.querySelectorAll(selector))
}
