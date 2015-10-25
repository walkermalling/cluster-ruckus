'use strict';
var R = require('ramda');

function Balancer (options) {
  this.nodes = R.propOr(0, 'nodes')(options);
  this.floor = R.propOr(0, 'floor')(options);
  this.cursor = R.propOr(0, 'floor')(options);
}

Balancer.prototype.next = function () {
  this.cursor++;
  if (this.cursor > this.nodes) {
    this.resetCursor();
  }
  return this.cursor;
};

Balancer.prototype.resetCursor = function () {
  this.cursor = this.floor;
};

Balancer.prototype.cursorValue = function () {
  return this.cursor;
};

Balancer.prototype.addNode = function () {
  this.nodes++;
};

Balancer.prototype.removeNode = function () {
  this.nodes--;
};

Balancer.prototype.setFloor = function (newFloor) {
  this.floor = newFloor;
};

Balancer.prototype.setCeiling = function (newCeiling) {
  this.nodes = newCeiling;
};

module.exports = Balancer;
