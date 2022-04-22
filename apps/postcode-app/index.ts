import { saveStreets } from '../../db'
import Listr from 'listr'
import { fetchZipcodeLinks } from './utils/fetchZipcodeLinks'
import { fetchStreetNames } from './utils/fetchStreetNames'
import { getLocations } from './utils/getLocations'

type Context = {
  data: any
}

async function run () {
  const tasks = new Listr([
    {
      title: 'Fetch zipcode links',
      task: async (context: Context) => {
        context.data = await fetchZipcodeLinks()
      }
    },
    {
      title: 'Fetch street names',
      task: async (context: Context) => {
        context.data = await fetchStreetNames(context.data)
      }
    },
    {
      title: 'Get locations',
      task: async (context: Context) => {
        context.data = await getLocations(context.data)
      }
    },
    {
      title: 'Save',
      task: async (context: Context) => {
        saveStreets(context.data)
      }
    }
  ])

  tasks.run()
}

run()
