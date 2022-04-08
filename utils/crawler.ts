import Crawler, { CrawlerRequestResponse } from "crawler";

const CRAWLER_CONF = {
    maxConnections : 10
};


export async function crawl(url: string){
    const handleCallbck = (err: Error, res: CrawlerRequestResponse, done: () => void) => void {

    }


    const crawler = new Crawler({
        ...CRAWLER_CONF,
        callback: handleCallbck
    });
}