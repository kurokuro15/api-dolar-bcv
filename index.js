const express = require('express')
const app = express()
const port = 3000
const { execute, get } = require('./scraping.js')

app.get('/', async (req, res) => {
  const { results: [result] } = await get()
  res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  execute().then(res => console.log(res || 'Scraping executed.'))
})
