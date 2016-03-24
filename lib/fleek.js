'use strict';

let _ = require('lodash');
let configuration = require('./configuration');

class Fleek {
  constructor(param) {
    let opts = {
      source: null,
      driver: 'koa'
    };

    opts.source = configuration.resolveSource(param || param.source);
    param = param || {};

    if (param.driver) opts.driver = param.driver;
    try {
      opts.driver = require('./drivers/' + opts.driver).init();
    } catch (e) {
      toss('Failed to load app driver\n' + e.stack);
    }

    _.extend(this, opts);
  }
}

module.exports =  function (param) {
  return new Fleek(param);
};

module.exports.Fleek = Fleek;
