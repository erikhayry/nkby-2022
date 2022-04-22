import { crawl } from "../../../api/crawler/utils/crawler";

function toUrlString(element: Element) {
    return element.getAttribute('href')
}

function awayEmptyLinks(href: string | null): href is string{
    return Boolean(href)
}

function toAbsolutePath(href: string, url: string): string{
    return new URL(href,url).href;
}

async function crawlUrlForLinks(url: string): Promise<string[]>{
    console.log("crawlUrlForLinks", url);
    const links = await crawl(url, 'a');
    
    return links.map(toUrlString).filter(awayEmptyLinks).map((href) => toAbsolutePath(href, url));
}

function outAllreadyVisited(url: string, visitedLinks: string[]){
    return !visitedLinks.includes(url);
}

async function recursive(acc: Promise<string[]>, urlToCrawl: string): Promise<string[]>{
        const visitedLinks = await acc;
        const unvisitedLinks = await crawlUrlForLinks(urlToCrawl);
        console.log("unvisitedLinks", unvisitedLinks);
    
        //const visited = await unvisitedLinks.filter((url) => outAllreadyVisited(url, visitedLinks)).reduce(recursive, acc)
        //visitedLinks.concat(...visited)
        

        
        return visitedLinks.concat(...unvisitedLinks)

}

export async function buildSitemap(url: string){
    console.log(url);
    
    const allLinks = await [url].reduce(recursive, Promise.resolve([] as string[]))

    console.log(allLinks);
    
}

buildSitemap("https://www.nykarlebyvyer.nu/sidor/menyer/map/sitemap.htm")