/**
* @private
* @param {object} extendee object to be extended
* @returns {Object} returns the extended object
* @description used to merge user options with default options. Does not handle
* prototype methods **
**/
function extend(extendee) {
  for(var i = 1; i < arguments.length; i++) {
    var val = arguments[i]

    if(typeof val !== 'object') {
      continue
    }

    for(var j in val) {
      if(val.hasOwnProperty(j)) {
        extendee[j] = typeof val[j] === 'object'
          ? extend({}, extendee[j], val[j])
          : val[j]
      }
    }
  }
  return extendee
}

module.exports = extend
