'use strict';

class BaseDriver {
  constructor () {
    this.app = null;
    this.middleware = [];
  }

  use (middleware) {
    middleware.push(middleware);
  }

  listen (port) {

  }
}

module.exports = BaseDriver;
