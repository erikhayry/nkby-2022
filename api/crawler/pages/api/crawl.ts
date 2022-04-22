// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { crawl } from '../../utils/crawler'
import { mail } from '../../utils/mailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const elements = await crawl("https://www.nykarlebyvyer.nu/sidor/paraden.htm", 'p')
  const text = elements.map(({ textContent }) => textContent).join(', ');

  mail(text)

  res.status(200).send(text)
}
