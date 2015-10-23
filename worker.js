'use strict';
var cluster   = require('cluster');

let tasks = [];

function registerTask (task) {
  tasks.push(task);
}

function report () {
  console.log(`[${cluster.worker.id}]\t${tasks}`);
}

function dispatch (msg) {
  switch (msg.action) {
    case 'register':
      registerTask(msg.task);
      break;
    case 'report':
      report();
      break;
  }
}

if (cluster.isWorker) {
  process.on('message', dispatch);
}
