'use strict';

class BaseDriver {
  constructor () {
    this.app = null;
    this.middleware = [];
  }

  use (middleware) {
    middleware.push(middleware);
  }

  tag (tag, middleware) {
    middleware.push(function *(next) {
      let tags = this.fleek.routeConfig.tags;
      if (this.fleek && this.fleek.routeConfig) {
        tags = this.fleek.routeConfig.tags || [];
        if (_.findIndex(tags, tag)) {
          return yield next();
        }
      } else {
        return yield next();
      }
    });
  }

  listen (port) {

  }
}

module.exports = BaseDriver;
