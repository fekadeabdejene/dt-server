var DtSql3    = require('../../src/dt-sql3')
var DtRequest = require('../../src/dt-request')
var DtErrors = require('../../src/dt-error')
var dtQuery   = require('./dt-mock-request').dtQuery
var assert    = require('chai').assert

describe("sqlite3 adapter tests", function() {
  it("should throw error on null db", function() {

    function throw1() {
      var nullsql = new DtSql3(null)
    }

    function throw2() {
      var undefinedSql = new DtSql3(undefined)
    }

    assert.throws(throw1, DtErrors.INV_SQL3)
    assert.throws(throw2, DtErrors.INV_SQL3)
  })

  it("it should return a properly foramtted query", function() {
    var sql3Adapter = new DtSql3({})
    var dtRequest   = new DtRequest(dtQuery, {
      request: {
        excludeRegex: 'true'
      }
    })

    var filterQuery = sql3Adapter.generateFilterQuery(dtRequest, "MockModel", {} , true);
    var result = 'SELECT id, name, address, zip, number FROM ( MockModel ) WHERE name LIKE $name OR address LIKE $address OR name LIKE $globalFilter OR address LIKE $globalFilter OR number LIKE $globalFilter ORDER BY id desc, address desc, number asc LIMIT 10 OFFSET 0'
    var params =  {
     "$name": '%Column-2 Filter%',
     "$address": '%Column-3 Filter%',
     "$globalFilter": '%GlobalFilter%'
   }

   assert.strictEqual(filterQuery.query, result)
   assert.deepInclude(filterQuery.params, params)
  })
})
