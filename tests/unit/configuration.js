'use strict';

let mocha = require('mocha');
let coMocha = require('co-mocha');
let assert = require('chai').assert;
let fleek = require('../../lib/fleek');

const DRIVERS = require('../../lib/drivers');
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

describe('Configuration', () => {

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


  describe('Driver selection', () => {

    it('should default to the koa driver', function *() {
      let app = fleek(SWAG.OBJECT.VALID);
      assert.instanceOf(app.driver, DRIVERS.internal.koa);
    });

    it('should allow specification of another supported driver', function *() {
      let app = fleek({ source: SWAG.OBJECT.VALID, driver: 'koa' });
      assert.instanceOf(app.driver, DRIVERS.internal.koa);
      //  TODO: implement another driver to make this useful
    });

    it('should error out for unsuported driver', function *() {
      assert.throws(() => fleek({ source: SWAG.OBJECT.INVALID, driver: 'FAIL' }), '');
    });

    it('should allow allow custom driver injection', function *() {
      class FooDriver extends DRIVERS.base {}
      assert.throws(() => fleek({ source: SWAG.OBJECT.VALID, driver: (new Foodriver) }), '');
    });

    it('should error out for custom driver that does not extend BaseDriver', function *() {
      assert.throws(() => fleek({ source: SWAG.OBJECT.VALID, driver: {} }), 'class extending BaseDriver');
    });
  });
});
