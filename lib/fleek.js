'use strict';

let _ = require('lodash');
let configuration = require('./configuration');

const DRIVERS = require('./drivers');

class Fleek {
  constructor(param) {
    param = param || {};
    let opts = {
      source: null,
      driver: 'koa'
    };

    // Load swagger source
    opts.source = configuration.resolveSource(_.isString(param) ? param : param.source);

    // Establish a driver
    if (param.driver) {
      if (_.isString(param.driver)) {
        opts.driver = param.driver;
        let Driver = DRIVERS[opts.driver.toLowercase()];
        if (!Driver) toss('Failed to load app driver ' + opts.driver + '\n' + e.stack);
        opts.driver = new Driver();
      } else if (param.driver.prototype instanceof DRIVERS.base) {
        opts.driver = param.driver;
      } else {
        toss('Driver must be a string specifying an implemented driver, or a driver class extending BaseDriver');
      }
    } else {
      opts.driver = new DRIVERS.internal.koa;
    }

    _.extend(this, opts);
  }
}

module.exports = function (param) {
  return new Fleek(param);
};

module.exports.Fleek = Fleek;
module.exports.BaseDriver = DRIVERS.base;
