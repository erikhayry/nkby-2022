const cron = require('node-cron')
const axios = require('axios')

cron.schedule('* * * * *', () => {
    axios
        .get('http://localhost:3000/api/crawl')
        .then((res) => {
            console.log(`statusCode: ${res.data}`)
        })
        .catch((error) => {
            console.error(error)
        })
})
