/* global document, $ */

// Lookup the Board of Supervisor votes for an individual legislative item
//
// 170334 => {
//   'Kim': 'yea',
//   'Peskin': 'nay',
//   'Fewer': 'yea',
//   'Yee': 'yea',
// }
//

const Nightmare = require('nightmare')

function lookupVote(legID) {

  // Get legislar URL
  console.log(`Getting legistar URL for ${legID}\n`)
  Nightmare({ show: false })
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
    .then(({ GUID, ID }) => {
      console.log({ GUID, ID })

      const legislationUrl = `https://sfgov.legistar.com/LegislationDetail.aspx?ID=${ID}&GUID=${GUID}&Options=ID|Text|`
      console.log('\n\nOpening', legislationUrl, '\n')

      return Nightmare({ show: true })
        .goto(legislationUrl)
        .wait('#ctl00_ContentPlaceHolder1_lblType2')
        .evaluate(() => {
          // Identify 'Board Row'
          const boardRow = $('#ctl00_ContentPlaceHolder1_gridLegislation_ctl00').find('td:contains("Board of Supervisors")').parent()

          // Get Board Action
          const boardAction = boardRow.children('td:nth-child(4)').text()

          // Get result
          const result = boardRow.children('td:nth-child(5)').text()

          // Click on vote anchor
          const voteAnchor = `#${(boardRow).children('td:nth-child(6)').children('a:nth-child(1)').attr('id')}`
          $(voteAnchor).click()

          const voteLink = $('#RadWindowWrapper_HistoryDetail iframe').attr('src')

          const legislationType = document.querySelector('#ctl00_ContentPlaceHolder1_lblType2').innerHTML
          switch (legislationType) {
            case 'Resolution':
              return (voteLink) ? { boardAction, result, voteLink } : { result: 'pending' }
            case 'Movement':
              return (voteLink) ? { boardAction, result, voteLink } : { result: 'pending' }
            case 'Ordinance':
              return (boardAction === 'FINALLY PASSED') ? { boardAction, result, voteLink } : { result: 'pending' }
            default:
              return { boardAction, result, voteLink: 'N/A' }
          }
        })
        // .end()
        .then((result) => {
          console.log(result)
          return result
        })
        .catch((error) => {
          console.error('Vote Status: pending', error)
        })
    })
    .catch((error) => {
      console.error('Search failed:', error)
    })
}

lookupVote(170323)
