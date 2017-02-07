// // Test the parseAgendaFile function against stored json expectations

const Promise = require('bluebird')
const parseAgendaFile = require('./parse-agenda-file')

// Check each of these agenda dates
Promise.resolve([
  '011017',
  '012417',
  '013117',
  '020717',
  '110116',
  '111516',
  '112916',
  '120616',
  '121316',
])
.each((date) => {

  // Load the expected json for the agenda
  const storedJSON = require(`./json/${date}.js`) // eslint-disable-line import/no-dynamic-require

  // Parse the pdf file
  parseAgendaFile(`./pdfs/bag${date}_agenda.pdf`)

  // Check each bill
  .each((bill, index) => {

    // Check each of these fields
    [
      'itemNumber',
      'id',
      'title',
      'sponsors',
      'text',
      'fiscalImpact',
      'statusLog',
      'question',
    ].forEach((field) => {

      const expected = JSON.stringify(storedJSON[index][field])
      const actual = JSON.stringify(bill[field])

      if (expected !== actual) {
        console.log('Expected:', expected)
        console.log('Actual:', actual)
        console.log()

        throw new Error(`PARSE EXPECTATION FAILURE: agenda[${index}][${field}]`)
      }
    })

  })

})
