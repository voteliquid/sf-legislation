const util = require('util')
const Promise = require('bluebird')
const parseAgendaFile = require('./parse-agenda-file')

const agendaDates = [
  '011017',
  '012417',
  '110116',
  '111516',
  '112916',
  '120616',
  '121316',
]
function convertDateString(dateFormatFromFilename) {
  // Converts '110116' => '2016-11-01'

  const month = dateFormatFromFilename.slice(0, 2)
  const day = dateFormatFromFilename.slice(2, 4)
  const year = dateFormatFromFilename.slice(4, 6)

  return `20${year}-${month}-${day}`
}

Promise.all(agendaDates)
  .map(date => (
    parseAgendaFile(`./pdfs/bag${date}_agenda.pdf`)
    .map(bill => Object.assign(bill, {
      date: convertDateString(date),
      source_doc: `bag${date}_agenda.pdf`,
    }))
    .then((agenda) => {
      console.log(util.inspect(agenda, { depth: null }))
    })
  ))
