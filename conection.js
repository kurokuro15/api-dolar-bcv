const mysql = require('mysql2')
const conf = require('./conf.js')

const connection = mysql.createConnection({
  host: conf.HOST,
  user: conf.USER,
  password: conf.PWD,
  database: conf.DB
})

function query (query, ...args) {
  return new Promise((resolve, reject) => {
    if (args) {
      connection.query(query, args, (err, results, fields) => {
        if (err) return reject(err)
        if (fields) return resolve({ results, fields })
        return resolve(results)
      })
    } else {
      connection.query(query, (err, results, fields) => {
        if (err) return reject(err)
        if (fields) return resolve({ results, fields })
        return resolve(results)
      })
    }
  })
}

module.exports = { query }
