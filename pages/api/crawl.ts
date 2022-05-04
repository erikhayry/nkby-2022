// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { NKBY_LOCAL_URL } from '../../config'
import crawl from '../../modules/crawler/crawler'
import { ACTION_NAME, saveAction } from '../../modules/db/db'
import mail from '../../modules/mailer/mailer'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    const elements = await crawl(`${NKBY_LOCAL_URL}/sidor/paraden.htm`, 'p')
    const text = elements.map(({ textContent }) => textContent).join(', ')
    const mailSent = await mail(text)

    if (mailSent) {
        res.status(200).send('ok')
        saveAction(ACTION_NAME.CRAWL)
    } else {
        res.status(500).send('failed to send email')
    }
}
