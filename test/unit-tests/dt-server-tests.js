var DtServer    = require('../../src/dt-server')
var DtErrors    = require('../../src/dt-error')
var MockAdapter = require('./dt-mock-adapter')
var MockRequest = require('./dt-mock-request')
var assert      = require('chai').assert

var ObjectAdapter = MockAdapter.ObjectAdapter
var ValueAdapter  = MockAdapter.ValueAdapter
var query         = MockRequest.dtQuery


describe("DtServer Operation Tests", function() {

  describe("DtServer Execution Tests", function() {

    it("Should throw error invalid request", function() {
      var dtServer = new DtServer(new ObjectAdapter)

      return dtServer.get({}, 'Users')
      .then(function(result) {
        assert.fail(true, false, "An error should be thrown on an invalid request")
      })
      .catch(function(err) {
        assert.isNotNull(err)
        assert.propertyVal(err, "error", DtErrors.INV_SEARCH)//first request check
      })

    })

    it("Should throw error invalid model", function() {
      var dtServer = new DtServer(new ObjectAdapter, {
        response: {
          validate: false
        }
      })

      return dtServer.get(query, null)
      .then(function(result) {
        assert.fail(true, false, "An error should be thrown on an invalid model")
      })
      .catch(function(err) {
        assert.isNotNull(err)
        assert.propertyVal(err, "error", DtErrors.INV_MODEL)
      })

    })

    it("Should throw error invalid request with no validation", function() {
      var dtServer = new DtServer(new ObjectAdapter, {
        response: {
          validate: false
        }
      })

      return dtServer.get({}, 'Users')
      .then(function(result) {
        assert.fail(true, false, "An error should be thrown on an invalid request")
      })
      .catch(function(err) {
        assert.isNotNull(err)
      })

    })

    it("should throw an error on a rejected response", function() {
      var dtServer = new DtServer({
        get: function() {
          return Promise.reject('some error')
        }
      },{
        response: {
          validate: true
        }
      })

      return dtServer.get(query, "Users")
      .then(function(result) {
        assert.fail(true, false, "An error should be thrown")
      })
      .catch(function(err) {
        assert.isNotNull(err)
      })
    })

    it("should throw an error on a invalid response", function() {
      var dtServer = new DtServer({
        get: function() {
          return Promise.resolve({
            a: ['a']
          })
        }
      }, {
        response: {
          validate: true
        }
      })

      return dtServer.get(query, "Users")
      .then(function(result) {
        assert.fail(true, false, "An error should be thrown")
      })
      .catch(function(err) {
        assert.isNotNull(err)
      })
    })

    it("should not throw an error on a invalid response with no validation", function() {
      var dtServer = new DtServer({
        get: function() {
          return Promise.resolve({
            a: ['a']
          })
        }
      },{
        response: {
          validate: false
        }
      })

      return dtServer.get(query, "Users")
      .then(function(result) {
      })
      .catch(function(err) {
        assert.fail(true, false, "response should not throw an error with no validation")
      })
    })

    it("Should throw error on invalid adapter", function() {
      var dtServer = new DtServer()

      return dtServer.get(query, 'Users')
      .then(function(result) {
        assert.fail(true, false, "An error should be thrown on an invalid request")
      })
      .catch(function(err) {
        assert.isNotNull(err)
        assert.isNotNull(err.error)
      })
    })
  })

  describe("overriding default options", function() {

    it("should override adapter", function() {
      var valueAdapter = new ValueAdapter
      var server = new DtServer(valueAdapter)

      assert.equal(server.adapter, valueAdapter)
    })

    it("should override excludeRegex", function() {
      var userOptions = {
        request: {
          excludeRegex: 'false'
        }
      }
      var server = new DtServer(new ValueAdapter, userOptions)

      assert.strictEqual(server.options.request.excludeRegex, 'false');
    })

    it("should override filter", function() {
      var userOptions = {
        request: {
          excludeRegex: 'false',
          filter: function(str, regex) {
            return '1'
          }
        }
      }
      var server = new DtServer({}, userOptions)

      assert.strictEqual(server.options.request.filter(), '1');
      assert.strictEqual(server.options.request.excludeRegex, 'false')
    })

    it("should override data-format", function() {
      var filter = function(str, regex) {
        return '1'
      }
      var userOptions = {
        request: {
          excludeRegex: 'false',
          filter: filter
        },
        response: {
          format: 'value-array'
        }
      }
      var result = {
        request: {
          excludeRegex: 'false',
          filter: filter,
          validate: 'true'
        },

        response: {
          format: 'value-array',
          formatData: undefined,
          validate: 'false',
        }
      }
      var server = new DtServer({}, userOptions)

      assert.deepInclude(server.options, result)
    })
  })
})
