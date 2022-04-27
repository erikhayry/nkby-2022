// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { fetchStreetNames } from '../../modules/fetchStreetNames/fetchStreetNames';
import { fetchZipcodeLinks } from '../../modules/fetchZipcodeLinks/fetchZipcodeLinks';
import { getLocations } from '../../modules/getLocations/getLocations';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {


    const zipCodeLinks = await fetchZipcodeLinks();
    const streetNames = await fetchStreetNames(zipCodeLinks)
    const locations = await getLocations(streetNames)



  if(locations.length > 0){
    res.status(200).json(JSON.stringify(locations))
  } else {
    res.status(500).send('failed to send email')
  }
}
