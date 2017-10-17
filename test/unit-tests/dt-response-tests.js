var DtResponse  = require('../../src/dt-response')
var DtErrors    = require('../../src/dt-error')
var assert      = require('chai').assert
var MockAdapter   = require('./dt-mock-adapter')

var ValueAdapter  = MockAdapter.ValueAdapter
var ObjectAdapter = MockAdapter.ObjectAdapter
var valueArray    = MockAdapter.valueArray
var objectArray   = MockAdapter.objectArray

var dtResponse = function(adapter) {
  return new DtResponse(adapter, baseOptions())
}

var baseOptions = function() {
  var base = JSON.parse(JSON.stringify({
    response: {
      format: 'object-array'
    }
  }))
  return base
}

describe("DtResponse Operation Tests", function() {
  it("should return default error response", function(done) {
    var res = dtResponse({
      get: function() {
        return Promise.reject({
          error: DtErrors.INV_ADAPTER
        })
      }
    })

    res.get()
    .then(function(result) {
      assert.fail(true, false, 'Expected an error response')
    })
    .catch(function(err) {
      assert.deepPropertyVal(err, 'error', DtErrors.INV_ADAPTER)
    })
    .then(done)
  })

  it("should return empty array on null/undefined data", function() {
    var res = dtResponse()
    var nullData = res.formatResponse(null)
    var undefinedData = res.formatResponse(undefined)

    assert.deepInclude(nullData, {error: DtErrors.INV_RESPONSE_FORMAT})
    assert.deepInclude(undefinedData,  {error: DtErrors.INV_RESPONSE_FORMAT})
  })

  it("should return custom format properly", function() {
    var res = dtResponse(new ObjectAdapter)

    var expected = [
      'bo0',
      'jo1',
      'ro2',
      'ho3',
      'zo4',
      'do5'
    ]
    res.options.response.formatData = function(res, options) {
      assert.strictEqual(options.response.format, 'object-array')
      return res.data.map(function(obj, i) {
        obj.name = obj.name + i.toString()
        return obj
      })
    }

    return res.get()
    .then(function(result) {
      assert.isNotNull(result)
      assert.isArray(result)

      result.forEach(function(data, i) {
        assert.strictEqual(data.name, expected[i])
      })
    })
    .catch(function(err) {
      throw new Error(err)
    })
  })

  it("should return properly formatted to object-array", function() {
    return dtResponse(new ObjectAdapter)
    .get()
    .then(function(result) {
      var expected = objectArray()

      assert.isNotNull(result)
      assert.isArray(result.data)

      result.data.forEach(function(data, i) {
        assert.deepInclude(data, expected[i])
      })
    })
    .catch(function(err) {
      throw new Error(err)
    })
  })

  it("should return properly formatted to value-array", function() {
    var res = dtResponse(new ObjectAdapter)
    var expected = valueArray()

    res.options.response.format = "value-array"
    return res.get()
    .then(function(result) {
      assert.isNotNull(result)
      assert.isArray(result.data)
      result.data.forEach(function(data, i) {

        assert.isArray(data)
        assert.lengthOf(data, 2)
        assert.strictEqual(data[0], expected[i][0])
        assert.strictEqual(data[1], expected[i][1])
      })
    })
    .catch(function(err) {
      throw new Error(err)
    })

  })

  it("should return properly data unchanged", function() {
    var res = dtResponse(new ValueAdapter)
    var expected = valueArray()

    return res.get()
    .then(function(result) {
      assert.isNotNull(result)
      assert.isArray(result.data)
      assert.deepInclude(result.data, expected)
    })
    .catch(function(err) {
      return new Error(err)
    })
  })

  it("should return properly data unchanged", function() {
    var res = dtResponse(new ValueAdapter)
    var expected = valueArray()

    res.options.response.format = "value-array"

    return res.get()
    .then(function(result) {
      assert.isNotNull(result)
      assert.isArray(result.data)
      assert.deepInclude(result.data, expected)
    })
    .catch(function(err) {
      return new Error(err)
    })
  })

  it("should return properly data unchanged with err format", function() {
    var res = dtResponse(new ValueAdapter)
    var expected = valueArray()

    res.options.response.format = "vas"
    res.options.response.formatData = 'asfds'

    return res.get()
    .then(function(result) {
      assert.isNotNull(result)
      assert.isArray(result.data)
      assert.deepInclude(result.data, expected)
    })
    .catch(function(err) {
      return new Error(err)
    })
  })
})
