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

let app = fleek('./config/swagger.json');

// let app = fleek(); // Attempts to find swagger docs on its own
// let app = fleek({ source: './config/swagger.json' }); // additional options

app.use(router());

app.use(validator());

app.use(response());

app.use(somehandler);

app.listen();


```
