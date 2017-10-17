var DtErrors = require('./dt-error')


/**
* @public DtResponse
* @param {Object} options user defined options
* @description
* Wraps a database adapter to generate a valid datatable response
* given a dt-request
**/
function DtResponse(adapter, options) {
  this.adapter = adapter
  this.options = options
}


/**
* @public get
* @param {DtRequest} dtrequest DtRequest class object
* @param {String} model Model from the database I.E.TableName
* @param {Object}  params Input paramters for model
* @returns {Promise}
**/
DtResponse.prototype.get = function(dtrequest, model, params) {
  var self = this

  return self.adapter.get(dtrequest,
    model,
    params
  )
  .then(function(res) {
    return self.formatResponse(res)
  })
}


/**
* @public formatResponse
* @param {Array} res raw data from database adapter
* @returns {Array} returns the response data
* @description
* Formats the data the way a datatable likes and
* invokes custom format function if specified. This
* function assumes that the default data format
* returned from a database adapter is object-array.
*
* Example object-array:
*   data => [{name: 'John', address: '123'}, {name:'Bob', address: '222'}]
*
* If your database adapter returns something different override
* the format with the formatData option.
**/
DtResponse.prototype.formatResponse = function(res) {
  var format     = this.options.response.format
  var formatData = this.options.response.formatData

  if(res !== Object(res)) {
    return {error: DtErrors.INV_RESPONSE_FORMAT}
  }

  if(formatData && typeof formatData === 'function') {
    return formatData(res, this.options)
  }

  if(format === 'value-array' && Array.isArray(res.data)) {
    res.data = res.data.map(function(object) {
      if(object === Object(object)) {
        var keys = Object.keys(object)
        return keys.map(function(key) {
          return object[key]
        })
      }
      return object
    })
  }

  return res
}

module.exports = DtResponse;
