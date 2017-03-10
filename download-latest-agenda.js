// Run this script to save the latest published SF BoS agenda file to the ./pdfs/ folder

const fetch = require('node-fetch')
const cheerio = require('cheerio')
const _ = require('lodash')
const fs = require('fs')

fetch('http://sfbos.org/meetings/42') // Page where new agendas are published
  .then(response => response.text())
  .then(cheerio.load)
  .then(($) => {
    // Get the latest agenda pdf's url
    const latestAgendaUrl = $('tbody > tr > td.views-field-field-meeting-type-1 > a').attr('href')

    const filename = _.last(latestAgendaUrl.split('/'))

    // Download and save the new agenda file
    fetch(`http://sfbos.org${latestAgendaUrl}`)
      .then(response => response.body.pipe(fs.createWriteStream(`./pdfs/${filename}.pdf`)))
  })
