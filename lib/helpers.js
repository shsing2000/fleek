'use strict';

let path = require('path');
let fs = require('fs');
let _ = require('lodash');

let toss = module.exports.toss = function (msg, escape) {
  let error = Error(msg);
  if (escape) {
    setTimeout(() => {
      throw error;
    });
  } else {
    throw error;
  }
};

module.exports.checkpoint = function (condition, error) {
  if (!condition) toss(error);
  return {
    and: module.exports.checkpoint,
  };
};

// load a file from a given path without chance of error
module.exports.loadFile = function (path, encoding) {
  encoding = encoding || 'utf8';
  let file;
  try {
    file = fs.readFileSync(path, encoding);
  } catch (e) {
    console.log(e);
    file = false;
  }

  return file;
};

module.exports.fileExists = function (path) {
  let exists = false;
  try {
    fs.accessSync(path, fs.F_OK);
    exists = true;
  } catch (e) {
    exists = false;
  }

  return exists;

};
