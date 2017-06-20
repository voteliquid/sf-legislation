/* global document */

// Lookup the Legistar URL for an individual legislative item
//
// 170323 => 'https://sfgov.legistar.com/LegislationDetail.aspx?ID=3006002&GUID=9CDC6172-0963-4073-9722-109B8A9F5DE3&Options=ID|Text|'
//

const Nightmare = require('nightmare')

function lookupLegistarUrl(legID) {
  console.log(`Getting legistar URL for ${legID}\n`)
  return Nightmare({ show: false })
    .goto('https://sfgov.legistar.com/Legislation.aspx')
    .type('#ctl00_ContentPlaceHolder1_txtSearch', legID)
    .click('#visibleSearchButton')
    .wait('#ctl00_ContentPlaceHolder1_gridMain_ctl00_ctl04_hypFile')
    .evaluate(() => {
      const href = document.querySelector('#ctl00_ContentPlaceHolder1_gridMain_ctl00_ctl04_hypFile').href
      const ID = href.slice(href.indexOf('ID') + 3, href.indexOf('&'))
      const GUID = href.slice(href.indexOf('GUID') + 5, href.indexOf('Options') - 1)
      return { GUID, ID }
    })
    .end()
    .then(({ GUID, ID }) => `https://sfgov.legistar.com/LegislationDetail.aspx?ID=${ID}&GUID=${GUID}&Options=ID|Text|`)
    .catch((error) => {
      console.error('Search failed:', error)
    })
}

lookupLegistarUrl(170323)
  .then(console.log)
