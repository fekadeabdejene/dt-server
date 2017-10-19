var assert = require('chai').assert

describe("Index Tests", function() {
  it("should require the default package", function() {
    var DataTable = require('../../index.js')()
    var DataTable2 = require('../../index.js')([])//invalid adapter
    assert.isNotNull(DataTable.DtServer)
    assert.isNotNull(DataTable.DtSql3)
    assert.isNotNull(DataTable2.DtServer)
    assert.isNotNull(DataTable2.DtSql3)
  })

  it("should require sqlite case insensitive", function() {
    var DataTable  = require('../../index.js')('sql3',{B:'B'} )
    var DataTable2 = require('../../index.js')('SQL3',{B:'B'} )

    assert.strictEqual(DataTable.constructor.name, 'DtServer')
    assert.strictEqual(DataTable.adapter.constructor.name, 'DtSql3')

    assert.strictEqual(DataTable2.constructor.name, 'DtServer')
    assert.strictEqual(DataTable2.adapter.constructor.name, 'DtSql3')
  })

  it("Should return default on bad arguments", function() {
    var DataTable2 = require('../../index.js')('S',{B:'B'} )

    assert.throws(function() {
      require('../../index.js')('sql3', null )
    })

    assert.isNotNull(DataTable2.DtServer)
    assert.isNotNull(DataTable2.DtSql3)
  })
})
