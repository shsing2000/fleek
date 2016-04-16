'use strict';

let _ = require('lodash');
let genit = require('genit');
let configuration = require('./configuration');
let helpers = require('./helpers');

let toss = helpers.toss;
let checkpoint = helpers.checkpoint;

const DRIVERS = require('./drivers');

class Fleek {
  constructor(param) {
    let opts = {
      source: null,
      driver: 'koa'
    };

    // Load swagger source
    opts.source = configuration.resolveSource((param || {}).source ? param.source : param);
    param = param || {};

    // Establish a driver
    if (param.driver) {
      if (_.isString(param.driver)) {
        opts.driver = param.driver;
        let Driver = DRIVERS.internal[opts.driver.toLowerCase()];
        if (!Driver) toss('Failed to load app driver ' + opts.driver);
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

  use (func) {
    checkpoint(genit.isGenerator(func), 'Generator expected as argument to .use(); Found [' + (typeof func) + ']');
    this.driver.use(func);
  }
}

module.exports = function (param) {
  return new Fleek(param);
};

module.exports.Fleek = Fleek;
module.exports.BaseDriver = DRIVERS.base;
