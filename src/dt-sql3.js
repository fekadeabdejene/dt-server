
function DtSql3(sql3, options) {
  if(!sql3) {
    throw 'sqlite3 is not a defined value'
  }
  this.sql3 = sql3
  this.options = options
}

DtSql3.prototype.countQuery = function(countName, model) {
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

      self.sql3.all(query, function(err, data) {
        err ? reject(err) : resolve(data[0])
      })
    }
  )
}

DtSql3.prototype.dataQuery = function(dtRequest, model, params) {
  var columns       = dtRequest.columnDataSource()
  var searchcolumns = dtRequest.searchableColumns()
  var columnSearch  = dtRequest.searchesForColumns()
  var orderColumns  = dtRequest.orderedColumns()
  var columnParams  = {}

  var globalFilter  = dtRequest.globalFilter()

  globalFilter = globalFilter
    ? globalFilter.value
    : ''

  //generate select clause
  var select = columns.join(',')

  //generate where cluase
  var where = searchcolumns.map(function(column) {
    return [
      column.data,
      '=$',
      column.data,
      ' OR ',
      column.data,
      '=$globalFilter'
    ]
    .join('')
  })
  .join(' OR ')

  searchcolumns.forEach(function(column) {
    var search = columnSearch[column.data]
    columnParams["$" + column.data] = search
      ? search.value
      : ''
  })

  //generate order by clause
  var orderby = orderColumns.map(function(sorted) {
      return [sorted.column, sorted.order].join(' ')
    }
  )
  .join(',');

  var query = [
    'SELECT', select,
    'FROM', '(', model ,')',
    'WHERE', where,
    'ORDER BY', orderby,
    'LIMIT', '$limit',
    'OFFSET', '$offset'
  ]

  return {
    query: query.join(' '),
    params: Object.assign({}, {
      globalFilter: globalFilter,
      $limit: dtRequest.length(),
      $offset: dtRequest.start(),
      },
      columnParams,
      params
    )
  }

}

DtSql3.prototype.filteredQuery = function(dtRequest, model, params) {
  var self = this

  return new Promise(function(resolve, reject) {
    var request = self.dataQuery(dtRequest, model, params)

    self.sql3.all(request.query, params, function(err, data) {
      err ? reject(err) : resolve({
        "recordsFiltered": data.length,
        "data": data
      })
    })
  })
}

DtSql3.prototype.get = function(dtRequest, model, params) {
  var self = this

  return Promise.all([
    Promise.resolve({
      "draw": dtRequest.nextDraw()
    }),
    self.countQuery('recordsTotal', model),
    self.filteredQuery(dtRequest, model, params),
  ])
  .then(function(results) {
    return results.reduce(function(a, b) {
      return Object.assign({}, a, b)
    })
  })
}

module.exports = DtSql3
