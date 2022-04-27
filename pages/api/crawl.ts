// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import crawl from '../../modules/crawler/crawler';
import mail from '../../modules/mailer/mailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const elements = await crawl("https://www.nykarlebyvyer.nu/sidor/paraden.htm", 'p')
  const text = elements.map(({ textContent }) => textContent).join(', ');

  const mailSent = await mail(text)

  if(mailSent){
    res.status(200).send('ok')
  } else {
      res.status(500).send('failed to send email')
  }
}

