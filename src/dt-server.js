var DtErrors    = require('./dt-error')
var DtResponse  = require('./dt-response')
var DtRequest   = require('./dt-request')
var DtValidator = require('./dt-validator')
var extend      = require('./extend')

/**
* @public DtServer constructor
* @param {object} options user defined options
* @description
* constructor for a new Datatable server object. This is the
* base object to interact with.
**/
function DtServer(adapter, options) {
  var defaults = {
    request: {
      excludeRegex: 'true', //'true'|'false'
      filter: function(str, regex) { //callback to modify search value
        return str
      },
      validate: 'true'
    },

    response: {
      format: 'value-array', //object-array, value-array,
      formatData: undefined, //function(data, format) { }''
      validate: 'false',
    }
  }


  this.options  = extend(defaults, options)

  this.adapter = adapter === Object(adapter) && adapter.get
    ? adapter
    : {
      get: function() {
        return {
          "error": DtErrors.INV_ADAPTER
        }
      }
    }
  }


/**
* @public
* @param {DtRequest} request datatable query object
* @param {Object} model Model from the database that is being requested. I.E. Tablename
* @param {Object} params Input paramters for prepared statments, advanced queries, etc.
* @returns {Promise} returns a promise
**/
DtServer.prototype.get = function(request, model, params) {
  var self = this

  return new Promise(function(resolve, reject) {
    var validateRequest = self.options.request.validate

    validateRequest = validateRequest === 'false'
      || validateRequest === false

    var errRequest = !validateRequest
      ? DtValidator.DtValidateRequest(request)
      : null

    if(errRequest) {
      reject({
        error: errRequest
      })
    }

    if(!model || typeof model !== 'string') {
      reject({
        error: DtErrors.INV_MODEL
      })
    }

    var dtRequest     = new DtRequest(request, self.options)
    var dtResponse    = new DtResponse(self.adapter, self.options)

    var dtResponseGet = dtResponse.get(dtRequest, model, params)

    dtResponseGet.then(function(result) {
      var validateResponse = self.options.response.validate

      validateResponse = validateResponse === 'true' ||
        validateResponse === true

      var errResponse = validateResponse
        ? DtValidator.DtValidateResponse(result)
        : null

      errResponse ? reject(errResponse) : resolve(result)
    })
    .catch(reject)
  })
}



module.exports = DtServer
