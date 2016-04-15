'use strict';

let mocha = require('mocha');
let coMocha = require('co-mocha');
let assert = require('chai').assert;
let fleek = require('../../lib/fleek');

const SWAG = {
  PATH: {
    VALID: __dirname + '/../unit/config/swagger.json',
    INVALID: './foobar'
  },
  OBJECT: {
    VALID: require('./config/swagger.json'),
    INVALID: {}
  },
};

describe('Configuration and setup', () => {

  describe('Swagger loading', () => {

    describe ('Path', () => {

      it('should look for swagger if no parameter is sent', function *() {
        process.chdir('tests/unit');
        let app = fleek();
        process.chdir('../..');
      });

      it('should accept a path to a swagger file', function *() {
        let app = fleek(SWAG.PATH.VALID);
      });

      it('should error out if path is invalid', function *() {
        assert.throws(() => fleek(SWAG.PATH.INVALID), 'Failed to resolve swagger');
      });
    });

    describe ('Object', () => {
      it('should accepts a raw swagger object', function *() {
        let app = fleek(SWAG.OBJECT.VALID);
      });

      it('should error out if the object is invalid', function *() {
        assert.throws(() => fleek(SWAG.OBJECT.INVALID), 'Swagger source must be');
      });
    });
  });
});
