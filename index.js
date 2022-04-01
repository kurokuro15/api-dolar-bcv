const express = require('express')
const app = express()
const port = 3000
const { execute, get } = require('./scraping.js')

app.get('/', async (req, res) => {
  const body = { dolar: await get('dolar'), euro: await get('euro') }
  res.send(body)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  execute().then(res => console.log(res || 'Scraping executed.'))
})
