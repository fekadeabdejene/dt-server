var DtValidator        = require('../../src/dt-validator')
var DtValidateRequest  = DtValidator.DtValidateRequest
var DtValidateResponse = DtValidator.DtValidateResponse
var assert             = require('chai').assert


var dtQuery = {
  "draw":'1',
  "columns":[

  ],
  "order":[

  ],
  "start":'0',
  "length":'1',
  "search": {

  },
  "_": '1'
}

var dtResponse = {
  "draw":'99',
  "recordsTotal":'1',
  "recordsFiltered": '1',
  "data": [],
  "error": ''
}

function deepcopy(object) {
  try {
    return JSON.parse(JSON.stringify(object))
  } catch (err) {
    return object
  }
}

function dtQueryCopy() {
  return deepcopy(dtQuery)
}

function dtResponseCopy() {
  return deepcopy(dtResponse)
}

function errorMessageValidator(err) {
    assert.isNotEmpty(err, 'Return error message should not be empty')
}

describe("DtValidator Request Throw Error Tests", function() {
  it("Should throw an error for passing an invalid request", function() {
    var err1 = DtValidateRequest([])//something other than object
    var err2 = DtValidateRequest(undefined)
    var err3 = DtValidateRequest(null)
    var err4 = DtValidateRequest('')

    var err = 'Validator should not return null when invalid request is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)
    assert.isNotNull(err4, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
    errorMessageValidator(err4)
  })

  it("Should throw an error for passing an invalid column array", function() {
    var copy = dtQueryCopy()

    copy.columns = {}
    var err1 = DtValidateRequest(copy)//something other than object

    copy.columns = undefined
    var err2 = DtValidateRequest(copy)

    copy.columns = null
    var err3 = DtValidateRequest(copy)

    var err = 'Validator should not return null when invalid column is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for passing an invalid order array", function() {
    var copy = dtQueryCopy()

    copy.order = {}
    var err1 = DtValidateRequest(copy)//something other than object

    copy.order = undefined
    var err2 = DtValidateRequest(copy)

    copy.order = null
    var err3 = DtValidateRequest(copy)

    var err = 'Validator should not return null when invalid orders is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for passing an invalid draw number", function() {
    var copy = dtQueryCopy()

    copy.draw = '+'
    var err1 = DtValidateRequest(copy)//something other than object

    copy.draw = '-'
    var err2 = DtValidateRequest(copy)

    copy.draw = []
    var err3 = DtValidateRequest(copy)

    var err = 'Validator should not return null when invalid draw is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for passing an invalid start number", function() {
    var copy = dtQueryCopy()

    copy.start = '-1'
    var err1 = DtValidateRequest(copy)//something other than object

    copy.start = ''
    var err2 = DtValidateRequest(copy)

    copy.start = []
    var err3 = DtValidateRequest(copy)

    var err = 'Validator should not return null when invalid starts is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for passing an invalid length number", function() {
    var copy = dtQueryCopy()

    copy.length = '-2'
    var err1 = DtValidateRequest(copy)//something other than object

    copy.length = ''
    var err2 = DtValidateRequest(copy)

    copy.length = undefined
    var err3 = DtValidateRequest(copy)

    var err = 'Validator should not return null when invalid length is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for every missing key in the request", function() {
    var keys = [
      'columns',
      'order',
      'search',
      'start',
      'length',
      'draw'
    ];

    keys.forEach(function(key) {
      var copy = dtQueryCopy()
      delete copy[key]

      var err = DtValidateRequest(copy);

      assert.isNotNull(err, `Validator should not be return null when key: '${key}' is removed`);

      errorMessageValidator(err)
    })
  })


})

describe("DtValidator Request No Error Tests", function() {

  it("should not throw an error on a valid request object", function() {
    var err = DtValidateRequest(dtQuery);
    assert.isNull(err, "Validator should not return a value for a valid datatble request object")
  })
})



describe("DtValidator Response Throw Error Tests", function() {

  it("Should throw an error for passing an invalid draw number", function() {
    var copy = dtResponseCopy()

    copy.draw = ''
    var err1 = DtValidateResponse(copy)//something other than object

    copy.draw = undefined
    var err2 = DtValidateResponse(copy)

    copy.draw = []
    var err3 = DtValidateResponse(copy)

    var err = 'Validator should not return null when invalid draw number is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for passing an invalid recordsTotal number", function() {
    var copy = dtResponseCopy()

    copy.recordsTotal = ''
    var err1 = DtValidateResponse(copy)//something other than object

    copy.recordsTotal = undefined
    var err2 = DtValidateResponse(copy)

    copy.recordsTotal = []
    var err3 = DtValidateResponse(copy)

    var err = 'Validator should not return null when invalid recordsTotal number is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for passing an invalid recordsFiltered number", function() {
    var copy = dtResponseCopy()

    copy.recordsFiltered = ''
    var err1 = DtValidateResponse(copy)//something other than object

    copy.recordsFiltered = undefined
    var err2 = DtValidateResponse(copy)

    copy.recordsFiltered = []
    var err3 = DtValidateResponse(copy)

    var err = 'Validator should not return null when invalid recordsFiltered number is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for passing an invalid error string", function() {
    var copy = dtResponseCopy()

    copy.error = 12;
    var err1 = DtValidateResponse(copy)//something other than object

    copy.error = undefined
    var err2 = DtValidateResponse(copy)

    copy.error = null
    var err3 = DtValidateResponse(copy)

    var err = 'Validator should not return null when invalid error string is passed'

    assert.isNotNull(err1, err)
    assert.isNotNull(err2, err)
    assert.isNotNull(err3, err)

    errorMessageValidator(err1)
    errorMessageValidator(err2)
    errorMessageValidator(err3)
  })

  it("Should throw an error for every missing key in the response", function() {
    var keys = [
      'draw',
      'recordsTotal',
      'recordsFiltered',
      'data',
      //error is optional
    ];

    keys.forEach(function(key) {
      var copy = dtResponseCopy()
      delete copy[key]

      var err = DtValidateResponse(copy);

      assert.isNotNull(err, `Validator should not return null when key: '${key}' is removed`);
      errorMessageValidator(err)
    })
  })

})

describe("DtValidator Response No Error Tests", function() {
  it("should not throw an error on a valid response object", function() {
    var err = DtValidateResponse(dtResponse);
    assert.isNull(err, "Validator should not return a value for a valid datatable response object")
  })
})
