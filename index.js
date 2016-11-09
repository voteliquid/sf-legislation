var path = require('path')
var filePath = path.join(__dirname, './bag110116_minutes.pdf')
var extract = require('pdf-text-extract')
extract(filePath, function (err, pages) {
  if (err) {
    console.dir(err)
    return
  }
  console.dir(pages)
})
