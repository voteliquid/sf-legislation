const parseAgenda = require('./parse-agenda-doc')

parseAgenda('./pdfs/bag110116_agenda.pdf')
  .then(console.log)
