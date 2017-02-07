// Grab our .env environment variables
require('dotenv').config({ silent: true })

console.log('Connecting to db...')
module.exports = function connectToDb() {
  return require('rethinkdb').connect({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    ssl: {
      ca: process.env.DB_SSL_CERT,
      rejectUnauthorized: false,
    },
  })
  .tap(dbConn => console.log('Connected to db as user:', dbConn.rawSocket.user, '\n'))
}
