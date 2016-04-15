'use strict';

let BaseDriver = require('../base');
let express = require('express');
let co = require('co');

/*
 DO NOT USE

 This driver is no where near complete. not even a POC at the moment
*/

class KoaDriver extends BaseDriver{
  constructor () {
    this.app = BaseDriver();
    this.app.use(function (req, res, next) {
      req._ctx = req;
      next();
    });
  }

  use (middleware) {
    this.app.use(function (req, res, next) {
      co(function *() {
        yield middleware.call(req.ctx, function *() {

        });

        next();
      }).catch((e) => {
        next(e);
      });
    });
  }

  listen () {
    this.app.listen.call(this.app, arguments);
  }
}
