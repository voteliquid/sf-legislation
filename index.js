const parseAgendaFile = require('./parse-agenda-file')

parseAgendaFile('./pdfs/bag110116_agenda.pdf')
  .then(console.log)
