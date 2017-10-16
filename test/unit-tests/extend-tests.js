var extend = require('../../src/extend.js')
const assert = require('chai').assert
var ValueAdapter  = require('./dt-mock-adapter').ValueAdapter

describe("Extend", function() {

  it("should return an empty merged object", function() {
    var obj1 = {
      name: 'abc'
    }

    var obj2 = {
      name: 'def'
    }

    var merged = extend(obj1, obj2)

    assert.deepInclude(merged, {
      name: 'def'
    })
  })

  it("should return the merged object", function() {
    var error = function() {
      return {'b':'b'}
    }

    var obj1 = {
      adapter: {
        get: function() {
          return {'a':'a'}
        }
      }
    }

    var obj2 = {
      adapter: {
        get: error,
        set: 'SetFunction'
      }
    }

    var merged = {
      adapter: {
        set: 'SetFunction',
        get: error,
      }
    }
    assert.deepInclude(extend(obj1, obj2), merged)
  })

  it("Should merge multiple objects correctly", function() {
    var defaults = {
      request: {
        excludeRegex: 'true',
        filter: function(str, regex) {
          return str
        }
      },

      response: {
        format: 'value-array',
        formatData: undefined, 
        validate: false,
      }
    }

    var override = {
      request: {
        excludeRegex: 'false',
        filter: function(str, regex) {
          return '1'
        }
      },
      response: {
        formatData: function() {}
      }
    }

    var merged = extend(defaults, override)

    assert.strictEqual(merged.request.excludeRegex, 'false')
    assert.strictEqual(merged.request.filter(), '1')
  })


  it("should return null object", function() {
    assert.isNull(extend(null))
  })

  it("should return undefined object", function() {
    assert.isUndefined(extend(undefined))
  })

  it("should return object back", function() {
    var obj = {}
    assert.strictEqual(extend(obj), obj)
  })
})
