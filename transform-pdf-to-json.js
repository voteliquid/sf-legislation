const fs = require('fs')
const util = require('util')
const Promise = require('bluebird')
const parseAgendaFile = require('./parse-agenda-file')

function convertDateString(dateFormatFromFilename) {
  // Converts '110116' => '2016-11-01'

  const month = dateFormatFromFilename.slice(0, 2)
  const day = dateFormatFromFilename.slice(2, 4)
  const year = dateFormatFromFilename.slice(4, 6)

  return `20${year}-${month}-${day}`
}

module.exports = function transformPdfsToJson(arrayOfDatesToParse) {
  return Promise.all(arrayOfDatesToParse)
    .map(date => (
      parseAgendaFile(`./pdfs/bag${date}_agenda.pdf`)
      .map(bill => Object.assign(bill, {
        date: convertDateString(date),
        source_doc: `bag${date}_agenda.pdf`,
        uid: `${convertDateString(date)}-${bill.id}`,
      }))

      // .tap((agenda) => { console.log(util.inspect(agenda, { depth: null })) })

      .then((agenda) => {
        // Write agenda to ./json/ directory
        const filePath = `./json/${date}.js`

        fs.writeFileSync(filePath, 'module.exports =\n')
        fs.appendFileSync(filePath, util.inspect(agenda, { depth: null }))
        fs.appendFileSync(filePath, '\n')

        console.log(`Saved ${filePath}`)
      })
    ))
}
