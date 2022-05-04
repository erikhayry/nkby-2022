// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { backup } from '../../modules/backup/backup'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<string>
) {
    await backup(JSON.stringify({ date: new Date().getTime() }))
    res.status(200).send('ok')
}
