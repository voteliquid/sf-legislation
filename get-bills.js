// Get the unique dates we have bills for

const connectToDB = require('./connect-to-db')
const r = require('rethinkdb')
const _ = require('lodash')

connectToDB().then(dbConn => (
  r.table('bills').run(dbConn).call('toArray')
  .then(results => (

    // Display unique dates
    console.log('Unique dates:', _.uniq(results.map(bill => bill.date)))

  ))
))
.then(process.exit)
