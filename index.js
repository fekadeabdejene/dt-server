module.exports = function(/*adapter, database, options*/) {
  var DtServer = require('./src/dt-server')
  var DtSql3   = require('./src/dt-sql3')
  var defaultModule  = {
    DtServer: DtServer,
    DtSql3: DtSql3
  }

  if(arguments.length <= 0) {
    return defaultModule
  }

  return (function(adapter, db, options) {
    if(Object.prototype.toString.call(adapter) === '[object String]') {
      switch(adapter.toLowerCase()) {
        case "sql3":
          return (new DtServer(
            new DtSql3(db),
            options
          ))
      }
    }
    return defaultModule
  }).apply(this, arguments)
}
