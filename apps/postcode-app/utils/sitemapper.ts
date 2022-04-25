import { crawl } from "../../../api/crawler/utils/crawler";

function toUrlString(element: Element) {
    return element.getAttribute('href')
}

function outEmptyLinks(href: string | null): href is string{
    return Boolean(href)
}

function toAbsolutePath(href: string, url: string): string{
    return new URL(href,url).href;
}

function toUrlWithoutParams(url: string): string{
    const { origin, pathname } =  new URL(url);    

    return `${origin}${pathname}`
}

function outThirdPartyUrls(href: string): boolean {    
    return href.startsWith("https://www.nykarlebyvyer.nu/")
}

async function crawlUrlForLinks(url: string): Promise<string[]>{
    console.log('crawl: ', url);
    
    const links = await crawl(url, 'a');
    
    return links
    .map(toUrlString)
    .filter(outEmptyLinks)
    .map((href) => toAbsolutePath(href, url))
    .map(toUrlWithoutParams)
    .filter(outThirdPartyUrls);
}

async function visit(visitedPages: Promise<string[]>, link: string){
    const partial = await visitedPages;

    if(!partial.includes(link)){
        const links = await crawlUrlForLinks(link);        
        partial.push(link)

        return recursive(links, partial)
    }

    return partial
}

function recursive(linksToVisit: string[], visitedPages: string[]): Promise<string[]>{
    return linksToVisit.reduce(visit, Promise.resolve(visitedPages))
}


export async function buildSitemap(url: string){
    console.log(url);
    
    const allLinks = await recursive([url], [])
    console.log(allLinks);
    
}

buildSitemap("https://www.nykarlebyvyer.nu/sidor/menyer/map/sitemap.htm")