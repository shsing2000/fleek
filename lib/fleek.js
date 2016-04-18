'use strict';

let _ = require('lodash');
let genit = require('genit');
let configuration = require('./configuration');
let helpers = require('./helpers');
let routington = require('routington');

let toss = helpers.toss;
let checkpoint = helpers.checkpoint;

const DRIVERS = require('./drivers');
const METHODS = {get:1, put:1, post:1, delete:1, option:1, head:1, patch:1};

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

    // Build route mapping
    this.router = { map : {} };
    _.each(opts.source.sanitizedRoutes || opts.source.compiledRoutes, (pathObj) => {
      let method = (pathObj.method || '').toLowerCase();
      if (!_.isString(pathObj.path) || !METHODS[method]) return;
      let path = _.map(pathObj.path.split('/'), (str) => {
        return str.indexOf('{') === 0 ? str.replace('{', ':').replace('}', '') : str;
      }).join('/');
      if (!this.router.map[method]) this.router.map[method] = routington();
      let node = this.router.map[method].define(path)[0];
      node.routeConfig = pathObj;
    });

    // stash important values for access
    this.swagger = opts.source;
    this.config = opts;
    this.driver = opts.driver;

    // add initial middleware for context injection
    let _fleek = this;
    this.driver.use(function *(next) {
      let ctx = this;

      // perform route analysis
      let router = _fleek.router.map[ctx.method.toLowerCase()];
      let match = router.match(ctx.path);
      let route = {};
      if (match && match.node && match.node.routeConfig) {
        route = match.node.routeConfig;
      } else {
        route.method = false;
        route.path = false;
      }

      // stash relevant data in context
      ctx.fleek = {
        route: route,
        swagger: _fleek.swagger
      };

      yield next;
    });
  }

  use (func) {
    checkpoint(genit.isGenerator(func), 'Generator expected as argument to .use(); Found [' + (typeof func) + ']');
    this.driver.use(func);
  }

  tag (tag, func) {
    checkpoint(_.isString(tag), 'String expected as argument to .tag(); Found [' + (typeof tag) + ']');
    checkpoint(genit.isGenerator(func), 'Generator expected as argument to .tag(); Found [' + (typeof func) + ']');
    this.driver.tag(tag, func);
  }

  listen() {
    this.driver.listen.apply(this.driver, arguments);
  }
}

module.exports = function (param) {
  return new Fleek(param);
};

module.exports.Fleek = Fleek;
module.exports.BaseDriver = DRIVERS.base;
