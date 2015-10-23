'use strict';
var cluster   = require('cluster');
var numCPUs   = require('os').cpus().length;
var R         = require('ramda');
var chalk     = require('chalk');
var util      = require('util');

let tasks = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

cluster.setupMaster({
  exec: 'worker.js'
});

for (var i = 0; i < numCPUs; i++) {
  cluster.fork();
}

cluster.on('exit', function(worker, code, signal) {
  console.log(`Worker ${worker} died`);
});

cluster.on('online', function(worker) {
  console.log(`Worker ${worker.id} is online`);
});

let delegateTask = function (task) {
  let next = Math.floor(Math.random() * Object.keys(cluster.workers).length) + 1;
  cluster.workers[next].send(task);
};

let assignTasks = function () {
  for (var k = 0; k < tasks.length; k++) {
    delegateTask({
      action: 'register',
      task: tasks[k]
    });
  }
};

// exec

assignTasks();

for (var id in cluster.workers) {
  cluster.workers[id].send({action: 'report'});
}
