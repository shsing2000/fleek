'use strict';

let _ = require('lodash');
let Path = require('path');
let parser = require('fleek-parser');
let helpers = require('./helpers');

let toss = helpers.toss;
let checkpoint = helpers.checkpoint;
let loadFile = helpers.loadFile;
let fileExists = helpers.fileExists;

const SOURCE_PATHS = [
  'swagger.json',
  'api.json',
  'config/swagger.json',
  'config/api.json'
];

// Determine if the object is a swagger object
let isSwagger = module.exports.isSwagger = function (source) {
  return source && _.isString(source.swagger) && _.isArray(source.paths);
};

// Take a source and return the path
let findSource = module.exports.findSource = function () {
  let resolved;
  _.each(SOURCE_PATHS, (path) => {
    let fullPath = Path.join(process.cwd(), path);
    let result = fileExists(fullPath);
    if (result) {
      resolved = fullPath;
      return false;
    }
  });
  return resolved;
};

// take an undefined, string, or object source and resolve it to a swagger object
module.exports.resolveSource = function (source) {
  let path;
  let swag;
  if (isSwagger(source)) {
    swag = source;
  } else if (!source) {
    path = findSource();
  } else if (_.isString(source)) {
    let valid = fileExists(Path.normalize(source));
    if (valid) {
      path = source;
    } else {
      toss('Failed to resolve swagger file: ' + source);
    }
  } else {
    checkpoint(path, 'Swagger source must be empty, a string, or a simple object. Found: [' + (typeof source) + ']');
  }

  if (path && !swag) swag = parser.parse(path);
  checkpoint(swag, 'Failed to compile swagger object');
  return swag;
};
