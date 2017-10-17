var DtErrors = require('./dt-error')

/**
* @public DtSql3
* @param {Database} sql3 Sqlite database object
* @param {object} options user defined options
* @description
* constructor for a new SQLite3 Datatable adapter the works
* within a DTServer object
**/
function DtSql3(sql3, options) {

  if(!sql3) {
    throw DtErrors.INV_SQL3
  }

  this.sql3 = sql3
  this.options = options
}

/**
* @public countQuery
* @param {String} countName count name => COunt(*) as countName
* @param {String} model the database model
* @param {Object} params optional parameters for the model
* @returns {Promise}
* @description
* Generates and executes the count query of a given model
**/
DtSql3.prototype.countQuery = function(countName, model, params) {
  var self = this

  return new Promise(
    function(resolve, reject) {
      var query = [
        "SELECT COUNT(*) AS",
        countName.toString(),
        "FROM",
        "(", model.toString(), ")"
      ]
      .join(' ')
      self.sql3.all(query, params, function(err, data) {
        err ? reject(err) : resolve(data[0])
      })
    }
  )
}

/**
* @public generateFilterQuery
* @param {DtRequesst} dtRequest DtRequesst object
* @param {String} model the database model
* @param {Object} params optional parameters for the model
* @param {Boolean} total will not apply limit, offset, and order by
* @returns {Object}
* @description
* Generates the filter query given a dtRequest
**/
DtSql3.prototype.generateFilterQuery = function(dtRequest, model, params, total) {
  var columns       = dtRequest.columnDataSource()
  var searchcolumns = dtRequest.searchableColumns()
  var columnSearch  = dtRequest.searchesForColumns()
  var orderColumns  = dtRequest.orderedColumns()
  var globalFilter  = dtRequest.globalFilter()
  var select        = columns.join(', ')
  var columnParams  = {}
  var where         = []


  //generate where cluase
  searchcolumns.forEach(function(column) {
    var search = columnSearch[column.data]
    if(search && search.value) {
      where.push([column.data,' LIKE $', column.data])
      columnParams["$" + column.data] = "%" + search.value + "%"
    }
  })

  if(globalFilter && globalFilter.value) {
    searchcolumns.forEach(function(column) {
      where.push([column.data,
        ' LIKE $globalFilter'
      ])
      columnParams['$globalFilter'] = "%" + globalFilter.value + "%"
    })
  }

  where = where.map(function(arr) {
    return arr.join('')
  })
  .join(' OR ')

  //generate order by clause
  var orderby = orderColumns.map(function(sorted) {
      return [sorted.column, sorted.order].join(' ')
    }
  )
  .join(', ');

  var query = [
    'SELECT'  , select,
    'FROM'    , '(', model ,')'
  ]

  if(where.length > 0) {
    query.push("WHERE",
      where
    )
  }

  if(orderby.length > 0 && total) {
    query.push("ORDER BY",
      orderby
    )
  }

  if(total) {
    query.push('LIMIT',
      dtRequest.length(),
      'OFFSET',
      dtRequest.start()
    )
  }

  return {
    query: query.join(' '),
    params: Object.assign({},
      columnParams,
      params
    )
  }
}

/**
* @public filteredQuery
* @param {DtRequesst} dtRequest DtRequesst object
* @param {String} model the database model
* @param {Object} params optional parameters for the model
* @returns {Promise}
* @description
* Generates and executes the filter (recordsFiltered) query given a dtRequest
**/
DtSql3.prototype.filteredQuery = function(dtRequest, model, params) {
  var request = this.generateFilterQuery(dtRequest, model, params, false)
  return this.countQuery("recordsFiltered", request.query, request.params)
}

/**
* @public dataQuery
* @param {DtRequesst} dtRequest DtRequesst object
* @param {String} model the database model
* @param {Object} params optional parameters for the model
* @returns {Promise}
* @description
* Generates and executes the data query, the actual records, given a dtRequest
**/
DtSql3.prototype.dataQuery = function(dtRequest, model, params) {
  var self = this
  return new Promise(function(resolve, reject) {
    var request = self.generateFilterQuery(dtRequest, model, params, true)

    self.sql3.all(request.query, request.params, function(err, data) {
      err ? reject(err) : resolve({
        "data": data
      })
    })
  })
}

/**
* @public get
* @param {DtRequesst} dtRequest DtRequesst object
* @param {String} model the database model
* @param {Object} params optional parameters for the model
* @returns {Promise}
* @description
* Generates the raw unformatted response from a SQLite database
* In the base Datatable response format
**/
DtSql3.prototype.get = function(dtRequest, model, params) {
  var self = this

  return Promise.all([
    Promise.resolve({
      "draw": dtRequest.nextDraw()
    }),
    self.countQuery('recordsTotal', model, params),
    self.filteredQuery(dtRequest, model, params),
    self.dataQuery(dtRequest, model, params)
  ])
  .then(function(results) {
    return results.reduce(function(a, b) {
      return Object.assign({}, a, b)
    })
  })
}

module.exports = DtSql3
