var DtServerErrors = {
  "en": {
    /*default lib errors*/
    "INV_LENGTH":          'request.length value must be >= -1',
    "INV_START":           'request.start value must be >= 0',
    "INV_COLUMNS":         'request.columns should be of type "array"',
    "INV_COLUMN":          'request.columns.{COLUMN} should be of type "object"',
    "INV_ORDER":           'request.orders should be of type array object',
    "INV_SEARCH":          'request.search should be of type "object"',
    "INV_DRAW":            'request.draw value must be an integer value',
    "INV_DATA":            'response.data is not an array object',
    "INV_SORT":            'Sort value must either be "asc" or "desc"',
    "INV_ADAPTER":         'dt-server was given an invalid adapter',
    "INV_REQUEST":         'request argument should be of type "object"',
    "INV_RESPONSE":        'response argument should be of type "object"',
    "INV_RECORDS_TOTAL":   'recordsTotal is an invalid number',
    "INV_RECORDS_FILTER":  'recordsFiltered is an invalid number',
    "INV_ERROR_RESPONSE":  'error property should be of type "string"',
    "INV_MODEL":           'Model is not defined or is not of type string',
    "INV_RESPONSE_FORMAT": 'Failed to format invalid response'

    /*adapters errors*/
  }
}

module.exports = DtServerErrors.en
