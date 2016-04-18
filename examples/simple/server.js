'use strict';

let fleek = require('../../lib/fleek');

const PORT = 8000;

// setup
let app = fleek(__dirname + '/api.json');

// controller
app.use(function *() {
  let ctx = this;

  let log = '  ' + ctx.method + ' ' + ctx.path;
  console.log('-->' + log);

  if (!this.fleek.route.path) {
    ctx.status = 404;
    ctx.body = 'NOT FOUND';
  } else {
    ctx.body = 'OK';
  }

  console.log('<--' + log + ' : [' + ctx.status + '] ' + ctx.body);
});

// listen
app.listen(PORT);
console.log('listening on: ' + PORT);
