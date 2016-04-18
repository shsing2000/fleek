'use strict';

let mocha = require('mocha');
let coMocha = require('co-mocha');
let assert = require('chai').assert;
let fleek = require('../../lib/fleek');
let _ = require('lodash');

const DRIVERS = require('../../lib/drivers');
const SWAG_PATH = __dirname + '/../unit/config/swagger.json';

let isValieRouteMatch = (match) => {
  assert.isObject(match);
  assert.isObject(match.node);
  assert.isObject(match.node.routeConfig);
  assert.isString(match.node.routeConfig.path);
  assert.isString(match.node.routeConfig.method);
};

describe('Routing', () => {

  describe('path mapping', () => {
    it('should set up a mapping of methods to routers', function *() {
      let app = fleek(SWAG_PATH);
      assert.isObject(app.router);
      assert.isObject(app.router.map);
      _.each(['get', 'put', 'post', 'delete'], (method) => assert.isObject(app.router.map[method]));
      assert.isUndefined(app.router.map.nonsense);
    });

    it('should find a valid simple path (GET /foo) with swagger route configuration', function *() {
      let app = fleek(SWAG_PATH);
      let match = app.router.map.get.match('/foo');
      isValieRouteMatch(match);
    });

    it('should find a valid variable path (GET /foo/{id}) with swagger route configuration', function *() {
      let app = fleek(SWAG_PATH);
      let match = app.router.map.get.match('/foo/test');
      isValieRouteMatch(match);
    });

    it('should fail to find undefined path (GET /fourohfour)', function *() {
      let app = fleek(SWAG_PATH);
      let match = app.router.map.get.match('/fourohfour');
      assert.isUndefined(match);
    });

    it('should fail to find valid path with invalid method (DELETE /foo)', function *() {
      let app = fleek(SWAG_PATH);
      let match = app.router.map.delete.match('/foo');
      assert.isObject(match);
      assert.isObject(match.node);
      assert.isUndefined(match.node.routeConfig);
    });
  });
});
