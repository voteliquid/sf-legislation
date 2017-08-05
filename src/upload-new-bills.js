// Upload parsed json of agendas to api.liquid.vote db

const _ = require('lodash')
const r = require('rethinkdb')
const convertDateString = require('./convert-date-string')

module.exports = function uploadNewBills(newJson) {
  console.log('\n...Uploading bills to api.liquid.vote')

  require('./connect-to-db')().then(dbConn => (

    r.table('bills').filter({ legislature: 'san_francisco' }).run(dbConn).call('toArray')
    .then((bills) => {

      // Get unique dates already uploaded
      const alreadyUploadedBills = _.uniq(bills.map(bill => bill.date))
      const convertedDateString = convertDateString(newJson)

      // Stop if our latest json has already been uploaded
      if (alreadyUploadedBills.includes(convertedDateString)) {
        console.log(`${convertedDateString} bills already uploaded`)
        return
      }

      // Load the already parsed agenda
      const agenda = require(`../json/${newJson}.js`) // eslint-disable-line import/no-dynamic-require

      // Remove fields with value = 'undefined',
      // such as { sponsor: undefined }.
      // Otherwise Rethink throws an error, see: https://github.com/rethinkdb/rethinkdb/issues/663
      .map(bill => _.omitBy(bill, value => value === undefined))

      return r.table('bills').insert(agenda).run(dbConn)
        .tap(() => { console.log('New bills uploaded:') })
        .then(results => console.log(convertedDateString, results))
    })
  ))
  .then(process.exit)
}
