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

  tag (tag, middleware) {
    middleware.push(function *(next) {
      let tags = this.fleek.routeConfig.tags;
      if (this.fleek && this.fleek.routeConfig) {
        tags = this.fleek.routeConfig.tags || [];
        if (_.findIndex(tags, tag)) {
          return yield middleware(next);
        }
      }

      return yield next();
    });
  }

  listen () {
    this.app.listen.apply(this.app, arguments);
  }
}

module.exports = KoaDriver;
