'use strict';

let BaseDriver = require('../base');
let http = require('http');
let co = require('co');

/*
 DO NOT USE

 This driver is no where near complete. not even a POC at the moment
*/

class KoaDriver extends BaseDriver{
  constructor () {
    this.app = http.createServer();
  }

  use (middleware) {
  }

  listen () {
    this.app.listen(arguments);
  }
}
