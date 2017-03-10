const fs = require('fs')
const util = require('util')

const convertDateString = require('./convert-date-string')

module.exports = function transformPdfsToJson(arrayOfDatesToParse) {
  return require('bluebird').all(arrayOfDatesToParse)
    .map(date => (
      require('./parse-agenda-pdf')(`./pdfs/bag${date}_agenda.pdf`)
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
        return date
      })
    ))
}
