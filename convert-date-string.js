module.exports = function convertDateString(dateFormatFromFilename) {
  // Converts '110116' => '2016-11-01'

  const month = dateFormatFromFilename.slice(0, 2)
  const day = dateFormatFromFilename.slice(2, 4)
  const year = dateFormatFromFilename.slice(4, 6)

  return `20${year}-${month}-${day}`
}
