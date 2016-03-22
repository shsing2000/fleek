# fleek

Unifying library for the fleek framework

# V2 Proposal

This server will act as a central hinge for the V2 versions of the fleek libraries. A more modern modular approach should be taken for V2, detailed below.

## Example

```javascript
let fleek = require('fleek');

let router = require('fleek-router');
let validator = require('fleek-validator');
let response = require('fleek-response');
let sockets = require('fleek-sockets');

let app = fleek('./config/swagger.json'); // implicitly add an app.use middleware to bind fleek/req context
// let app = fleek(); // Attempts to find swagger docs on its own
// let app = fleek({ source: './config/swagger.json' }); // additional options

app.use(sockets()); // binds validation logic

app.use(validator()); // binds validation logic

app.use(response()); // binds response logic

app.use(function *(next) {

});

// execute as middleware for any endpoint with the user tag
app.tag('user', function *() {

});

app.tags({
  user: function *() {

  }
});

app.use(router()); // routes to controllers. router will no longer perform context injection

app.listen(3000);
```
