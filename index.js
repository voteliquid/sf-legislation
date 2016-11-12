var path = require('path')
var filePath = path.join(__dirname, 'pdfs/bag110116_agenda.pdf')
var extract = require('pdf-text-extract')
extract(filePath, function (err, pages) {
  if (err) {
    console.dir(err)
    return
  }
  console.dir(pages)
})
