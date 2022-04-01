const express = require('express')
const app = express()
const port = 3000
const { execute, get } = require('./scraping.js')

const updateString = '15:01:00 PM'

app.get('/', async (req, res) => {
  const { results: [result] } = await get()
  res.send(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

setInterval(() => {
  const currentDate = new Date()
  const hours = currentDate.getHours()
  const minutes = currentDate.getMinutes()
  const seconds = currentDate.getSeconds()
  const zone = hours >= 12 ? 'PM' : 'AM'
  const timeString = getTimeString({ hours, minutes, seconds, zone })
  checkAlarm(timeString)
}, 1000)

const checkAlarm = (timeString) => {
  if (updateString === timeString) {
    execute().then(res => console.log(res || 'Scraping executed.'))
  } else {
    console.info(timeString)
  }
}
const getTimeString = ({ hours, minutes, seconds, zone }) => {
  if (minutes / 10 < 1) {
    minutes = '0' + minutes
  }
  if (seconds / 10 < 1) {
    seconds = '0' + seconds
  }
  return `${hours}:${minutes}:${seconds} ${zone}`
}
