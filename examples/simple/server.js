'use strict';

let fleek = require('../../lib/fleek');

let app = fleek(__dirname + '/api.json');

app.use(function *() {
  let ctx = this;
  if (!this.fleek.route.path) {
    ctx.body = 'NOT FOUND';
  } else {
    ctx.body = 'OK';
  }
});

app.listen(8000);
