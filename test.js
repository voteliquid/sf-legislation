// Test the parseAgendaFile function against the stored json

const storedJSON = require('./json/110116.js')
const parseAgendaFile = require('./parse-agenda-file')

const fieldsToCheck = [
  'itemNumber',
  'id',
  'title',
  'sponsors',
  'text',
  'fiscalImpact',
  'statusLog',
  'question',
]

// Parse the file
parseAgendaFile('./pdfs/bag110116_agenda.pdf')
  .each((bill, index) => {
    // Does it match the stored values?
    fieldsToCheck.forEach((field) => {

      const expected = JSON.stringify(storedJSON[index][field])
      const actual = JSON.stringify(bill[field])

      if (expected !== actual) {
        console.log('Expected:', expected)
        console.log('Actual:', actual)
        console.log()

        throw new Error(`FAILED PARSE: agenda[${index}][${field}]`)
      }
    })

  })
