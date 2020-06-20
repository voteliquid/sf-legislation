const extract = require('pdf-text-extract')
const _ = require('lodash')
const Promise = require('bluebird')

function processBillText(bill) {
  const billObj = {
    itemNumber: undefined,
    id: undefined,
    title: undefined,
    sponsors: undefined,
    text: undefined,
    fiscalImpact: false,
    statusLog: undefined,
    question: undefined,
  }

  const data = bill.split(/ {2,}/)

  // Grab bill attributes in status positions
  billObj.itemNumber = Number(data[0].slice(0, data[0].length - 1))
  billObj.id = Number(data[1])

  let remainingLines = data.slice(2, data.length - 1)

  // Find title lines
  const titleLines = []
  while (!remainingLines[0].includes(']')) {
    titleLines.push(remainingLines.shift().trim())
  }
  titleLines.push(remainingLines.shift().trim())
  billObj.title = titleLines.join(' ').split('[')[1].split(']')[0]


  // Find sponsor lines
  const startOfSponsors = /^Sponsors?: /
  if (remainingLines.some(line => startOfSponsors.test(line))) {
    const startOfDescription = /^(Ordinance|Motion|Resolution|Hearing|Proposed|Budget and Appropriation Ordinance|Urgency ordinance|Charter Amendment|Emergency ordinance|Reenactment|Emergency Ordinance) /
    const sponsorLines = []
    try {
      while (!startOfDescription.test(remainingLines[0])) {
        sponsorLines.push(remainingLines.shift().trim())
      }
    } catch (e) {
      console.log('\nError on this item:')
      console.log('(Probably need to add first word(s) after sponsor line to startOfDescription list)\n')
      console.log(billObj)
      console.log(sponsorLines)
      throw e
    }
    billObj.sponsors = sponsorLines.join(' ').split(': ')[1].split('; ')
  }

  // Search and remove '(Fiscal Impact)' line
  const lineLengthBeforeSearching = remainingLines.length
  remainingLines = remainingLines.filter(line => !/\(Fiscal Impact\)/.test(line))
  if (lineLengthBeforeSearching > remainingLines.length) {
    billObj.fiscalImpact = true
  }

  // Filter out lines from end of array that start with dates
  billObj.statusLog = []
  const startsWithDate = /^\d{2}\/\d{2}\/\d{4};/

  while (startsWithDate.test(remainingLines[remainingLines.length - 1])) {
    const statusItem = remainingLines.pop().trim().split('; ')
    billObj.statusLog.push({
      date: statusItem[0],
      status: statusItem[1],
    })
  }

  billObj.text = remainingLines.reduce((memo, line) => `${memo}${line.trim()} `, '').trim()

  billObj.question = data[data.length - 1]

  return billObj
}

module.exports = function parseAgenda(filePath) {
  console.log(`...Parsing ${filePath}`)
  return new Promise((accept, reject) => {
    extract(filePath, (err, pages) => {
      if (err) { return reject(err) }

      accept(_.flatten(pages.map((pageString) => {
        // loops through text to convert OCR to object

        // Skip items about Closed Sessions
        const closedSessionRegEx = /\d+\. +\d{6} +(.|\n)*?Closed Session: The Board of Supervisors shall confer with City Attorney./g
        const pageStringWithoutClosedSession = pageString.replace(closedSessionRegEx, '')

        // Separate out each bill
        // // Looks for start of agenda item, until 'QUESTION?'
        const billRegEx = /\d+\. +\d{6} +(.|\n)*?[A-Z]+\?/g
        const bills = pageStringWithoutClosedSession.match(billRegEx) || []

        return bills.map(processBillText)
      })))
    })
  })
}
