dt-server -
A wrapper around a datatable server side processing
=======
[![Build Status via Travis CI](https://travis-ci.org/fekadeabdejene/dt-server.svg?branch=master)](https://travis-ci.org/fekadeabdejene/dt-server)
[![Coverage Status](https://coveralls.io/repos/github/fekadeabdejene/dt-server/badge.svg?branch=master)](https://coveralls.io/github/fekadeabdejene/dt-server?branch=master)
### Installation
```
npm install dt-server
```

### Dependencies
None


### Example Usage (Express)
There are four main objects in this project.

DtRequest  
  - Wraps the raw query from a datatable with added helper functionality

DtResponse 
  - Wraps an adapter - a SQLite adapter is provided - and generates a valid response

DtServer   
  - Handles creation of the above objects and returns the response

Adapter
  - A class that implements the interface seen below in the DtSql3 Object
  
```js
var dts = require('dt-server').Server

router.get('/dtsql3', function(req, res, next) {
  var dtServer = new dts.DtServer(new dts.DtSql3(db), {
    response: {
      format: 'object-array'
    }
  })
  
  dtServer.get(req.query,'USERS')
  .then(function(results) {
    res.status(200).json(results)
  })
  .catch(function(err) {
    res.status(400).json(err)
  })
})
```

### API

- `DtServer([adapter], [options])`
  * `[adapter] => Adapter for a database I.E. DtSql3 wraps the SQLite database`
  * `[options] => Custom options`

- `DtServer.get([request], [model], (optional)[params])`
  * `[request] => Datatable JSON request object`
  * `[model]   => Model to get from the database`
  * `[params]  => Optional database parameters`
  * `returns  => {Promise}`

- `DtSql3([Database])`
  * `[Database] => Database object`

- `DtSql3.get([dtRequest], [model], (optional)[params])`
  * `[dtRequest] => DtRequest object`
  * `[model]   => Model to get from the database`
  * `[params]  => Optional database parameters`
  * `returns  => {Promise}`

### Extending
Implementing the interface seen in DtSql3 will allow you to pass that adapter 
as you would the DtSql3 object

### Available Options
Defaults
```js
{
  request: {
    excludeRegex: 'true' //'true'|'false'
    filter: function(str, regex) { 
      return str
    },
    validate: 'true' //'true'|'false'
  },

  response: {
    format: 'object-array', //object-array, value-array,
    formatData: undefined, //Array function(data, format) { }
    validate: 'false', 'true'|'false'
  }
}
```
```
- Pass an object with one, or more of these options to override the defaults
  - request.exlcudeRegex: removes search columns using regex
  - request.filter: A funciton that augments incoming search strings
  - request.validate: Flag to validate the datatable JSON request object
  - response.format: Format of the response data from an adapter
  
  - Example Formats:
    - object-array => [{name: 'a', address'b'}, ...]
    - value-array => [['a', 'b'], ...]
  - request.formatData: Custom data formatting function used in-place of the default format function
  - request.validate: Flag to validate JSON response object
```
## License
MIT
