var DtErrors    = require('./dt-error')
var DtResponse  = require('./dt-response')
var DtRequest   = require('./dt-request')
var DtValidator = require('./dt-validator')
var extend      = require('./extend')

/** DtServer
* @public constructor
* @param {Object} adapter DtResponse Adapter
* @param {Object} options user defined options
* @description
* Creates a new Datatable server object. This is the
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
      format: 'object-array', //object-array, value-array,
      formatData: undefined, //function(data, format) { }''
      validate: 'false',
    }
  }

  this.options  = extend(defaults, options)
  this.adapter = adapter === Object(adapter) && adapter.get
    ? adapter
    : {
      get: function() {
        return DtErrors.INV_ADAPTER
      }
    }

  this.adapter.options = this.options
}


/**
* @public get
* @param {DtRequest} request datatable query object
* @param {String} model Model from the database that is being requested. I.E. Tablename
* @param {Object} params Input paramters for prepared statments, advanced queries, etc.
* @returns {Promise}
**/
DtServer.prototype.get = function(request, model, params) {
  var self = this

  return new Promise(function(resolve, reject) {
    var onErr = function(err) {
      reject({error: err.toString()})
    }

    var validateRequest = self.options.request.validate

    validateRequest = validateRequest === 'false'
      || validateRequest === false

    var errRequest = !validateRequest
      ? DtValidator.DtValidateRequest(request)
      : null

    if(errRequest) {
      onErr(errRequest)
    }

    if(!model || typeof model !== 'string') {
      onErr(DtErrors.INV_MODEL)
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
    .catch(onErr)
  })
}



module.exports = DtServer
