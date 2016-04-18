# fleek

Unifying library for the fleek framework

# V2 Proposal

This server will act as a central hinge for the V2 versions of the fleek libraries. A more modern modular approach should be taken for V2, detailed below.

# The purpose of the fleek module

the fleek module will act as the glue to hold together the individual pieces. this will allow the other components of fleek (router, validator, etc) to keep very limited architectural scope. parsing, route context, and a few other overhead components will be done here, allowing the other modules to have a very specific task that they perform well.

### Current functionality

- finds swagger source either by receiving an absolute path, a path relative to cwd, a swagger object, or by searching for it in the cwd
- allows selection and injection of a driver (core server) that extends the `BaseDriver` class. This class is almost 1:1 proxy of koa
- injects an initial middleware that maps the request route to a swagger path+method definition and stash's the route context in `ctx.fleek.route`
- injects the full swagger object to `ctx.fleek.swagger`
- see the examples directory for a working example


### Future functionality

- add actionId to ctx injection

# Implementation notes

- routing done via [routington](https://www.npmjs.com/package/routington) (trie over regex for speed)

# tests needed

- unit
  - routing setup and compilation
    - test router in mocha by accessing `fleek.router.map` for an object of method-route routington instances
  - integration
    - make sure router functions when hit over the wire

## Proposed Example

```javascript
let fleek = require('fleek');

let router = require('fleek-router');
let validator = require('fleek-validator');
let response = require('fleek-response');
let sockets = require('fleek-sockets');

let app = fleek('./config/swagger.json'); // implicitly add an app.use middleware to bind fleek/req context
// let app = fleek(); // Attempts to find swagger docs on its own
// let app = fleek({ source: './config/swagger.json' }); // additional options

app.use(sockets()); // binds socket logic

app.use(validator()); // binds validation logic

app.use(response()); // binds response logic

app.use(function *(next) {

});

// execute as middleware for any endpoint with the user tag
app.tag('user', function *() {

});

// execute as middleware for any endpoint with the user tag
app.tags({
  user: function *() {

  }
});

app.use(router()); // routes to controllers. router will no longer perform context injection

app.listen(3000);
```
