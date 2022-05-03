const cron = require('node-cron')
const axios = require('axios')

console.log('init cron jobs')

cron.schedule('* * * * *', () => {
    console.log('running a task every minute')
    axios
        .get('http://localhost:3000/api/crawl')
        .then((res) => {
            console.log(`statusCode: ${res.data}`)
        })
        .catch((error) => {
            console.error(error)
        })
})
