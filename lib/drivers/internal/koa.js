'use strict';

let BaseDriver = require('../base');
let koa = require('koa');

class KoaDriver extends BaseDriver {
  constructor () {
    super();
    this.app = koa();
  }

  use (middleware) {
    this.app.use(middleware);
  }

  listen () {
    this.app.listen.call(this.app, arguments);
  }
}

module.exports = KoaDriver;
