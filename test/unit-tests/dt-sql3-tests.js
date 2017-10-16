var DtSql3 = require('../../src/dt-sql3')
var DtRequest   = require('../../src/dt-request')
var dtQuery     = require('./dt-mock-request').dtQuery
var assert      = require('chai').assert

describe("sqlite3 adapter tests", function() {

  it("it should return a properly foramtted query", function() {
    var sql3Adapter = new DtSql3({})
    var dtRequest   = new DtRequest(dtQuery, {
      request: {
        excludeRegex: 'true'
      }
    })

    var query = sql3Adapter.dataQuery(dtRequest, "MockModel");
    console.log(query)
    assert.fail(true, false)
  })
})
