// Upload parsed json of agendas to the db

const Promise = require('bluebird')
const _ = require('lodash')
const r = require('rethinkdb')
const connectToDB = require('./connect-to-db')

connectToDB().then(dbConn => (

  // For each of these agenda dates
  Promise.resolve([
    // '011017',
    // '012417',
    // '013117',
    // '020717',
    // '021417',
    // '022817',
    // '030717',
    // '110116',
    // '111516',
    // '112916',
    // '120616',
    // '121316',
  ]).each((date) => {

    // Load the already parsed agenda
    const agenda = require(`./json/${date}.js`) // eslint-disable-line import/no-dynamic-require

    // Remove fields with value = 'undefined',
    // such as { sponsor: undefined }.
    // Otherwise Rethink throws an error, see: https://github.com/rethinkdb/rethinkdb/issues/663
    .map(bill => _.omitBy(bill, value => value === undefined))

    return r.table('bills').insert(agenda).run(dbConn)
      .then(results => console.log(date, results))
  })
))
.then(process.exit)
