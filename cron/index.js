const cron = require('node-cron')
const axios = require('axios')

const LOCAL_URL = 'http://localhost:3000'
const EVERY_MINUTE = '* * * * *'

cron.schedule(EVERY_MINUTE, () => {
    console.log('cron job')
    axios
        .get(`${LOCAL_URL}/api/crawl`)
        .then((res) => {
            console.log(`statusCode: ${res.data}`)
        })
        .catch((error) => {
            console.error(error)
        })
})
