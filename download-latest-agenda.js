// Run this script to save the latest published SF BoS agenda file to the ./pdfs/ folder

const fetch = require('node-fetch')

let filename

module.exports = function downloadLatestAgenda() {
  console.log('...Getting latest agenda from sfbos.org')
  return fetch('http://sfbos.org/meetings/42') // Page where new agendas are published
    .then(response => response.text())
    .then(require('cheerio').load)
    .then(($) => {
      // Get the latest agenda pdf's url
      const latestAgendaUrl = $('tbody > tr > td.views-field-field-meeting-type-1 > a').attr('href')
      console.log(`Latest agenda URL = http://sfbos.org${latestAgendaUrl}`)

      filename = require('lodash').last(latestAgendaUrl.split('/'))

      // Download and save the new agenda file
      console.log('\n...Downloading')
      return fetch(`http://sfbos.org${latestAgendaUrl}`)
        .then((response) => {
          const stream = response.body.pipe(require('fs').createWriteStream(`./pdfs/${filename}.pdf`))

          return new Promise((resolve) => {
            stream.on('finish', () => {
              console.log(`Saved ./pdfs/${filename}.pdf\n`)
              resolve([filename.slice(3, 9)])
            })
          })
        })
    })
}
