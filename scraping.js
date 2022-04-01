const puppeteer = require('puppeteer')
const jsdom = require('jsdom')
const { query } = require('./conection.js')

const scraping = async () => {
  const insert = async obj => {
    const { usd, eur } = obj
    const queryString = {
      dolar: 'INSERT INTO dolar(value) VALUES(?)',
      euro: 'INSERT INTO euro(value) VALUES(?)'
    }
    const q1 = await query(queryString.dolar, [usd])
    const q2 = await query(queryString.euro, [eur])
    console.log({ q1, q2 })
  }

  try {
    // Abrimos una instancia del puppeteer y accedemos a la url de google
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const response = await page.goto('http://www.bcv.org.ve/')
    const body = await response.text()

    // Creamos una instancia del resultado devuelto por puppeter para parsearlo con jsdom
    const {
      window: { document }
    } = new jsdom.JSDOM(body)

    // Seleccionamos los titulos y lo mostramos en consola
    const currencies = [
      document.querySelector('div#dolar strong').textContent,
      document.querySelector('div#euro strong').textContent
    ]
    const res = currencies.map(string => {
      return Number(string.replace(',', '.'))
    })
    const obj = { usd: res[0], eur: res[1] }
    await insert(obj)
    // Cerramos el puppeteer
    await browser.close()
    return 'Página web escarbada y datos almacenados en la db.'
  } catch (error) {
    console.error(error)
  }
}

async function get () {
  const queryString = 'SELECT dolar.value as dolar, euro.value as euro, dolar.time as time FROM dolar JOIN euro on euro.time = dolar.time ORDER BY dolar.time DESC LIMIT 1'
  const result = await query(queryString)
  return result
}

async function execute () {
  const result = await scraping()
  console.info(result)
}

module.exports = { get, execute }
