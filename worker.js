'use strict';
var cluster   = require('cluster');

let tasks = [];

function registerTask (msg) {
  tasks.push(msg.task);
}

function report () {
  let msg = {
    id: cluster.worker.id,
    tasks: tasks
  };
  process.send(msg);
}

let dispatch = {
  REGISTER: registerTask,
  REPORT: report
};

if (cluster.isWorker) {
  process.on('message', msg => {
    dispatch[msg.action].call(null, msg);
  });
}
