'use strict';
var Balancer = require('../Balancer');
var assert = require('assert');

describe('Balancer', function () {

  it('instantiates a new balancer', function () {
    let b = new Balancer(1);
    assert(b instanceof Balancer);
  });

  it('increments its cursor', function () {
    let b = new Balancer(1);
    assert(b instanceof Balancer);
    let startingPoint = b.cursorValue();
    assert.equal(startingPoint, 0);
    let cursorNext = b.next();
    assert.equal(cursorNext, 1);
    let cursorNow = b.cursorValue();
    assert.equal(cursorNow, 1);
    let cursorBack = b.next();
    assert.equal(cursorBack, 0);
  });

  it('can increase and decrease max nodes', function () {

  });

});
