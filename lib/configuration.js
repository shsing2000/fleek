'use strict';

let _ = require('lodash');
let assert = require('assert');

// Determine if the object is a swagger object
let isSwagger = module.exports.isSwagger = function (source) {
  return source && _.isString(source.swagger) && _.isArray(source.paths);
};

// Take a source and return the path
let findSource = module.exports.findSource = function (source) {

  //
  // TODO: find swagger source path
  //

  return false;
};

// take an undefined, string, or object source and resolve it to a swagger object
module.exports.resolveSource = function (source) {
  let path = null;
  let swag = null;

  if (_.isSwagger(source)) {
    swag = source;
  } else {
    if (!source) {
      path = findSource();
    } else if (_.isString(source)) {
      path = source;
    }

    assert(path, 'failed to resolve path');
    swag = parser.parse(path);
  }

  assert(swag, 'Failed to get swagger object');
  return swag;
};
