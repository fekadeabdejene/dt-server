var sqlite3     = require('sqlite3').verbose()
var rowCount    = 50000
var initialized = false
var db          = undefined


var InitializeDB = function(done) {
  if(initialized) {
    return done(db)
  }

  db = new sqlite3.Database('./mock.db', function(err) {
    if(err) {
      console.log(err)
      process.exit(-1)
    }
    generateMockDb(db, done)
  })

  db.on('error', function(err) {
      console.log("ON ERROR -- ", err)
      process.exit(-1)
  })

  return db
}

var generateMockDb = function(db, done) {
  var drop   = "DROP TABLE IF EXISTS USERS;"
  var create = [
    "CREATE TABLE USERS (",
    "id INTEGER PRIMARY KEY,",
    "name TEXT NOT NULL,",
    "address TEXT NOT NULL,",
    "postalcode TEXT NOT NULL",
    ");"
  ]
  .join(' ')
  var data = "INSERT INTO USERS(name, address, postalcode)"

  var rows = []
  for(var i = 1; i <= rowCount; i++) {
    rows.push([
      data,
      " VALUES(",
      "'name"+i+"',",
      "'address"+i+"',",
      "'postalcode"+i+"'",
      ");"
    ].join(' '))
  }

  var err = function(err) {
    if(err) {
      console.log(err)
      throw new Error(err)
    }
  }

  db.serialize(function() {
    db.run("BEGIN;", err)
    db.run(drop, err)
    db.run(create, err)

    rows.forEach(function(row) {
      db.run(row, err)
    })

    db.run("END;", function(errs) {
      initialized = true
      done(db)
    })

  })
}

var copyMockQuery = function() {
  return JSON.parse(JSON.stringify(mockQuery))
}

var mockQuery = {
  draw: '1',
  columns: [
    {
      data: 'id',
      name: 'id',
      searchable: 'true',
      orderable: 'true',
      search: {
        value: '',
        regex: 'false'
      }
    },
    {
      data: 'name',
      name: 'name',
      searchable: 'true',
      orderable: 'true',
      search: {
        value: '',
        regex: 'false'
      }
    },
    {
      data: 'address',
      name: 'address',
      searchable: 'true',
      orderable: 'true',
      search: {
        value: '',
        regex: 'false'
      }
    },
    {
      data: 'postalcode',
      name: 'postalcode',
      searchable: 'true',
      orderable: 'true',
      search: {
        value: '',
        regex: 'false'
      }
    }
  ],
  order: [
    { column: '0', dir: 'asc' },
    { column: '1', dir: 'desc'  },
    { column: '2', dir: 'asc' },
    { column: '3', dir: 'asc' }
  ],
  start: '0',
  length: '10',
  search: {
    value: '',
    regex: 'false'
  },
  _: '1507217433999'
}
module.exports = {
  InitializeDB, InitializeDB,
  mockQuery: copyMockQuery,
  count: rowCount
}
