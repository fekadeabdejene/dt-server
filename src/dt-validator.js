var DtServerErrors = require('./dt-error');


var DtValidateRequest = function (request) {

  if(request !== Object(request)) {
    return DtServerErrors.INV_REQUEST
  }

  if(request.search !== Object(request.search)) {
      return DtServerErrors.INV_SEARCH
  }

  if(!Array.isArray(request.columns)) {
    return DtServerErrors.INV_COLUMNS
  }

  if(!Array.isArray(request.order)) {
    return DtServerErrors.INV_ORDER
  }

  var start = parseInt(request.start, 10)
  var length = parseInt(request.length, 10)

  if(isNaN(parseInt(request.draw, 10))) {
    return  DtServerErrors.INV_DRAW
  }

  if(isNaN(start) || start < 0) {
    return DtServerErrors.INV_START
  }

  //-1 means return all objects according to documentation
  if(isNaN(length) || length < -1) {
    return DtServerErrors.INV_LENGTH
  }

  return null;
}

var DtValidateResponse = function(response) {
  if(response !== Object(response)) {
    return DtServerErrors.INV_RESPONSE
  }

  if(isNaN(parseInt(response.draw, 10))) {
    return DtServerErrors.INV_DRAW
  }

  if(isNaN(parseInt(response.recordsTotal, 10))) {
    return DtServerErrors.INV_RECORDS_TOTAL
  }

  if(isNaN(parseInt(response.recordsFiltered, 10))) {
    return DtServerErrors.INV_RECORDS_FILTER
  }

  if(!Array.isArray(response.data)) {
    return DtServerErrors.INV_DATA
  }

  if(response.error || typeof response.error !== 'string') {
    return DtServerErrors.INV_ERROR_RESPONSE
  }

  return null;
}

module.exports = {
  DtValidateRequest: DtValidateRequest,
  DtValidateResponse: DtValidateResponse
}
