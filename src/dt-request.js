/**
* @public
* @param {Object} request datatable request object
* @param {Object} options Options for this dt-server
* @returns {DtRequest}
* @description
* Wraps the datatable request object. Provides helper
* functionality to the base request
**/
function DtRequest(request, options) {
  this.request = request
  this.options = options
}

/** start
* @public
* @returns {Number} returns the length of the current set
**/
DtRequest.prototype.length = function() {
  return this.request.length
}

/** start
* @public
* @returns {Number} returns the starting index in the set
**/
DtRequest.prototype.start = function() {
  return this.request.start
}

/**
* @public
* @returns {String} returns the request draw value increased by 1
* @description
* For the datatable to render properly the draw needs to be incremented
**/
DtRequest.prototype.nextDraw = function() {
  return (parseInt(this.request.draw, 10) + 1).toString()
}


/**
* @public
* @returns {Array<String>} returns string array of only the Column.data values
* @description
* This is useful for generating queries based off the data source name
* I.E. generating the SELECT clause
**/
DtRequest.prototype.columnDataSource = function() {
  return this.request.columns.map(
    function(column) {
      return column.data
    }
  )
}


/**
* @public searchableColumns
* @returns {Array<Object>} searchable column object array
* @description
* This function returns all the columns that are searchable
**/
DtRequest.prototype.searchableColumns = function() {
  return this.request.columns.filter(function(column) {
      return column.searchable === 'true' || column.searchable === true
    }
  )
}


/**
* @public
* @returns {Array<Object>} returns the search objects for columns
* @description
* This function returns all the search objects for columns that
* are searchable and filter based on the excludeRegex options
**/
DtRequest.prototype.searchesForColumns = function() {
  var self           = this
  var columnSearches = { }

  self.searchableColumns().forEach(function(column) {
    var useRegex     = column.search.regex === 'true'
      || column.search.regex === true

    var excludeRegex = self.options.request.excludeRegex === 'true'
      || self.options.request.excludeRegex === true

    var filter       = self.options.request.filter

    if(!(excludeRegex === true && useRegex === true)) {
      columnSearches[column.data] = {
        "value": filter
          ? filter(column.search.value, useRegex)
          : column.search.value,
        "regex": useRegex.toString()
      }
    }
  })

  return columnSearches
}


/**
* @public
* @returns {Object} returns the search objects for columns
* @description
* This function returns all the search objects for columns that
* are searchable and filter based on the excludeRegex options
**/
DtRequest.prototype.globalFilter = function() {
  var requestOptions = this.options.request
  var search         = this.request.search

  var useRegex       = search.regex === 'true'
    || search.regex === true

  var excludeRegex   = requestOptions.excludeRegex === 'true'
    || requestOptions.excludeRegex === true

  if(!(excludeRegex === true && useRegex === true)) {
    return {
      "value": requestOptions.filter
        ? requestOptions.filter(search.value, useRegex)
        : search.value,
      "regex": useRegex.toString()
    }
  }

  return null
}


/**
* @public
* @returns {Object} returns all ordered columns that are orderable
**/
DtRequest.prototype.orderedColumns = function() {
  var self   = this
  var sorted = []

  this.request.order.forEach(function(order) {
    var column = self.request.columns[order.column]

    if(column) {
      if(column.orderable === 'true' || column.orderable === true) {
        sorted.push({
          "column": column.data,
          "order": order.dir === 'desc' ? 'desc' : 'asc'
        })
      }
    }
  })

  return sorted
}

module.exports = DtRequest
