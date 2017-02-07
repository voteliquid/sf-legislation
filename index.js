const path = require('path')
const extract = require('pdf-text-extract')
const _ = require('lodash')

const filePath = path.join(__dirname, 'pdfs/bag110116_agenda.pdf')

extract(filePath, (err, pages) => {
  if (err) {
    console.dir(err)
    return
  }

  console.log(_.flatten(pages.map(processPage))) // eslint-disable-line

})

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
    const startOfDescription = /^(Ordinance|Motion|Resolution) /
    const sponsorLines = []
    while (!startOfDescription.test(remainingLines[0])) {
      sponsorLines.push(remainingLines.shift().trim())
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

function processPage(pageString) {
  // loops through text to convert OCR to object

  const billRegEx = /\d+\. +\d{6} +(.|\n)*?[A-Z]+\?/g
  // Separate out each bill
  const bills = pageString.match(billRegEx)

  return bills ? bills.map(processBillText) : []
}
