function Balancer (nodes) {
  this.nodes = nodes;
  this.cursor = 0;
}

Balancer.prototype.next = function () {
  if (this.cursor >= this.nodes) {
    this.cursor = 0;
  } else {
    this.cursor++;
  }
  return this.cursor;
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

module.exports = Balancer;
