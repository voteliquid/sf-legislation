var path = require('path')
var filePath = path.join(__dirname, 'pdfs/bag110116_agenda.pdf')
var extract = require('pdf-text-extract')
extract(filePath, function (err, pages) {
  if (err) {
    console.dir(err)
    return
  }

  const currentPage = pages[6]

  console.log(processPage(currentPage)) // eslint-disable-line

})


function processPage(pageString) {
  // loops through text to convert OCR to object
  const billObj = {}


  const billRegEx = /\d\. +\d{6} +(.|\n)*?[A-Z]+\?/g

  // Separate out each bill
  const bills = pageString.match(billRegEx)
  const bill = bills[0]

  const data = bill.split(/ {2,}/)

  // Grab bill attributes in status positions
  billObj.itemNumber = Number(data[0].slice(0, data[0].length - 1))
  billObj.id = Number(data[1])
  // TODO: fix multi-line title
  billObj.title = data[2].split('[')[1].split(']')[0]
  console.log(billObj)
  billObj.sponsors = data[3].trim().split(': ')[1].split('; ')
  billObj.question = data[data.length - 1]



  let remainingLines = data.slice(4, data.length - 1)

  billObj.fiscalImpact = false
  // Search and remove '(Fiscal Impact)' line
  const lineLengthBeforeSearching = remainingLines.length
  remainingLines = remainingLines.filter(line => !/\(Fiscal Impact\)/.test(line))
  if (remainingLines.length < lineLengthBeforeSearching) {
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



  billObj.raw = remainingLines

  // data.forEach((row) => {
  //   // is it a
  // })

  return billObj
}
