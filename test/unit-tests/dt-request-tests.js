var DtRequest     = require('../../src/dt-request')
var assert        = require('chai').assert
var dtQuery       = require('./dt-mock-request').dtQuery
var dtRequestBase = new DtRequest(dtQuery, {request: { excludeRegex: 'false' } })

describe("DtRequest Operation Tests", function() {
  it("Should return draw the draw number incremeneted by 1", function() {
    var draw = parseInt(dtQuery.draw, 10)
    var nextDraw = parseInt(dtRequestBase.nextDraw())

    assert.strictEqual(draw+1, nextDraw);
  })

  it("Should return all the column data source names", function() {
    var dataSources = [
      'id',
      'name',
      'address',
      'zip',
      'number'
    ]
    var dtDataSources = dtRequestBase.columnDataSource();

    assert.lengthOf(dtDataSources, dataSources.length)

    dtDataSources.forEach(function(dataSource, i) {
      assert.strictEqual(dataSource, dataSources[i])
    })
  })

  it("Should return all the searchable columns", function() {
    var dtSearchable = dtRequestBase.searchableColumns()
    var result = [
      'name',
      'address',
      'number'
    ]

    assert.lengthOf(dtSearchable, 3)

    dtSearchable.forEach(function(column, i) {
      assert.strictEqual(column.data, result[i]);
    })
  })

  it("Should return all searchValues for each column - excludeRegex = false", function() {
    dtRequestBase.options.excludeRegex = 'false'

    var dtSearches = dtRequestBase.searchesForColumns()
    var result = {
      'name': {
        "value": 'Column-2 Filter',
        "regex": 'false'
      },
      'address': {
        "value": 'Column-3 Filter',
        "regex": 'false'
      },
      'number': {
        "value": 'Column-5 Filter',
        "regex": 'true'
      }
    }

    assert.deepInclude(dtSearches, result);
  })

  it("Should return all searchValues for each column - excludeRegex = true", function() {
    dtRequestBase.options.excludeRegex = 'true'

    var dtSearches = dtRequestBase.searchesForColumns()
    var result = {
      'name': {
        "value":'Column-2 Filter',
        "regex": 'false'
      },
      'address': {
        "value":'Column-3 Filter',
        "regex": 'false'
      }
    }

    assert.deepInclude(dtSearches, result);
  })

  it("Should return all globalFilter - excludeRegex = true", function() {
    dtRequestBase.options.excludeRegex = 'false'

    var dtSearches = dtRequestBase.globalFilter()
    var result = {
      "value":'GlobalFilter',
      "regex": 'false'
    }

    assert.deepInclude(dtSearches, result);
  })

  it("Should return all globalFilter - excludeRegex = false", function() {
    dtRequestBase.options.excludeRegex = 'false'

    var dtSearches = dtRequestBase.globalFilter()
    var result = {
      "value":'GlobalFilter',
      "regex": 'false'
    }

    assert.deepInclude(dtSearches, result);
  })

  it("Should return all orderable columns", function() {
    var order = dtRequestBase.orderedColumns()
    var result = [
      {
        column: 'id',
        order: 'desc'
      },
      {
        column: 'address',
        order: 'desc'
      },
      {
        column: 'number',
        order: 'asc'
      }
    ]

    order.forEach(function(ord, i) {
      assert.deepInclude(ord, result[i])
    })

  })
})
