// Find bills without a legistar URL

const r = require('rethinkdb')
const _ = require('lodash')
const getLegistarUrl = _.memoize(require('./get-legistar-url'))

function findBillsWithoutLegistar() {
  let count = null
  require('../connect-to-db')().then(dbConn => (

    r.table('bills')

    // Only get bills from 2017 (need to tweak Nightmare search for past years)
    .filter(row => (row('date').ge('2017')))

    // Only select rows that don't already have a `legistar_url` field
    .filter(r.row.hasFields('legistar_url').not())

    // Skip these ids
    .filter(row => (r.contains([
      161178,
    ], row('id')).not()))

    .run(dbConn)
    .call('toArray')
    .tap((bills) => { count = bills.length })
    .map(bill => (
      getLegistarUrl(bill.id)
      .then(legistar_url => r.table('bills').get(bill.uid).update({ legistar_url }).run(dbConn))
      .then(() => console.log(`${count--}. Updated ${bill.uid}`)) // eslint-disable-line no-plusplus
    ), { concurrency: 3 })
  ))
  // .then(process.exit)
}

findBillsWithoutLegistar()
