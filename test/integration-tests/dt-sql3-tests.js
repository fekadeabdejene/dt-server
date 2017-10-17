var mockdb   = require('./dt-mock-sql3-db')
var DtServer = require('../../src/dt-server')
var DtSql3   = require('../../src/dt-sql3')
var assert   = require('chai').assert
var db       = undefined
var rowCount    = mockdb.count

describe("SQLite3 Integration Tests", function() {
  before(function(done) {
    db = mockdb.InitializeDB(function() {
      done()
    })
  })

  describe("setup tests", function() {
    it("MockDB should be setup correctly", function(done) {
      db.all('SELECT COUNT(*) as count FROM USERS;', function(err, data) {
        assert.strictEqual(data[0].count, rowCount)
        done()
      })
    })
  })

  describe("Valid Response tests", function() {
    var validResponse = function(response,
      draw,
      recordsTotal,
      recordsFiltered,
      dataLength) {

      assert.equal(response.draw, draw, "draw")
      assert.equal(response.recordsTotal, recordsTotal, "recordsTotal")
      assert.equal(response.recordsFiltered, recordsFiltered, "recordsFiltered")
      assert.strictEqual(response.data.length, dataLength === -1 ? recordsTotal : dataLength, "data length")
    }

    var ResponseTest = function(draw, recordsTotal, recordsFiltered, dataLength, offset, model) {
      var query = mockdb.mockQuery()
      var dtServer = new DtServer(new DtSql3(db), {
        response: {
          format: 'object-array'
        }
      })

      if(!model) {
        model = "USERS"
      }

      query.length = dataLength
      query.start  = offset

      return dtServer.get(query, model)
      .then(function(results) {
        validResponse(results, draw, recordsTotal, recordsFiltered, dataLength)
        results.data.forEach(function(result, id) {
          var nid = id + 1 + offset
          var expected = {
            id: nid ,
            name: "name" + nid,
            address: "address" + nid,
            postalcode: "postalcode" + nid
          }
          assert.deepInclude(result, expected)
        })
        return results
      })
      .catch(function(err) {
        throw new Error(err)
      })
    }

    it("Should return the first 10 records in the table", function() {
      return ResponseTest(2, rowCount, rowCount, 10, 0)
    })

    it("Should return the first 10 records in the table offset by 10", function() {
      return ResponseTest(2, rowCount, rowCount, 10, 10)
    })

    it("Should return the all records in the table offset by -1 => all records", function() {
      return ResponseTest(2, rowCount, rowCount, -1, 0)
    })

    it("Should return the all records in the table offset by 0", function() {
      return ResponseTest(2, rowCount, rowCount, rowCount, 0)
    })

    it("Should return a single record in the table offset by N - 1", function() {
      return ResponseTest(2, rowCount, rowCount, 1, rowCount - 1)
    })

    it("Should return the first 10 records of a sub select model", function() {
      //4000
      //40000...40009
      //elements elements

      var length = 10
      var total = 11
      var query  = mockdb.mockQuery()
      var dtServer = new DtServer(new DtSql3(db))

      query.length = length
      query.start  = 0

      return dtServer.get(query, 'SELECT * FROM USERS WHERE postalcode LIKE "postalcode4000%"')
      .then(function(results) {
        validResponse(results, "2", total, total, length)
      })
    })

    it("Should return the first 10 records of a sub select model with params", function() {
      //4999
      //49990 ... 49999
      //elements elements

      var length = 5
      var total  = 11
      var query  = mockdb.mockQuery()
      var dtServer = new DtServer(new DtSql3(db))

      query.length = length
      query.start  = 0

      return dtServer.get(query, 'SELECT * FROM USERS WHERE postalcode LIKE $customparam', {
        $customparam: 'postalcode4999%'
      })
      .then(function(results) {
        validResponse(results, "2", total, total, length)
      })
    })

    it("Should return the first 10 records in descending order", function() {
      var length = 10

      var query = mockdb.mockQuery()
      query.order[0].dir = 'desc'
      var dtServer = new DtServer(new DtSql3(db), {
        response: {
          format: 'object-array'
        }
      })

      query.length = length
      query.start  = 0

      return dtServer.get(query, 'USERS')
      .then(function(results) {
        var nid = rowCount;
        results.data.forEach(function(result, id) {
          var expected = {
            id: nid ,
            name: "name" + nid,
            address: "address" + nid,
            postalcode: "postalcode" + nid
          }
          --nid;
          assert.deepInclude(result, expected)
        })
      })
    })

    it("Should return an error on an invalid model", function() {
      var query = mockdb.mockQuery()
      var dtServer = new DtServer(new DtSql3(db))

      return dtServer.get(query, 'INVALIDMODEL')
      .then(function(results) {
        assert.fail(true, false, "AN error should have been thrown")
      })
      .catch(function(err) {
        return new Error(err)
      })
    })

  })
})
