var objectArray = function() {
  return JSON.parse(JSON.stringify([
    {name: 'bo', address: '1'},
    {name: 'jo', address: '2'},
    {name: 'ro', address: '3'},
    {name: 'ho', address: '4'},
    {name: 'zo', address: '5'},
    {name: 'do', address: '6'}
  ]))
}

var valueArray = function() {
  return Array.from([
    ['bo', '1'],
    ['jo', '2'],
    ['ro', '3'],
    ['ho', '4'],
    ['zo', '5'],
    ['do', '6']
  ])
}

var ObjectAdapter = function() { }

ObjectAdapter.prototype.get = function(dtRequest, model, params) {
  return Promise.resolve({
    "data": objectArray(),
    "recordsTotal": '0',
    "recordsFiltered": '0',
    "draw": '1'
  })
}

var ValueAdapter = function() { }

ValueAdapter.prototype.get = function(dtRequest, model, params) {
  return Promise.resolve({
    "data": valueArray(),
    "recordsTotal": '0',
    "recordsFiltered": '0',
    "draw": '1'
  })
}

module.exports = {
  ObjectAdapter: ObjectAdapter,
  ValueAdapter:  ValueAdapter,
  objectArray:   objectArray,
  valueArray:    valueArray
}
