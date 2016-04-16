'use strict';

let mocha = require('mocha');
let coMocha = require('co-mocha');
let assert = require('chai').assert;
let fleek = require('../../lib/fleek');

const DRIVERS = require('../../lib/drivers');
const SWAG_PATH = __dirname + '/../unit/config/swagger.json';

describe('Setup', () => {

  describe('.use', () => {
    it('should accept a generator', function *() {
      let app = fleek(SWAG_PATH);
      app.use(function * () {});
    });

    it('should reject non-genertor value', function *() {
      let app = fleek(SWAG_PATH);
      assert.throws(() => app.use(), 'Generator expected');
      assert.throws(() => app.use({}), 'Generator expected');
      assert.throws(() => app.use(function () {}), 'Generator expected');
    });
  });
});
