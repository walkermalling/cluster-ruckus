'use strict';
var cluster   = require('cluster');
var Balancer  = require('./Balancer');
var nconf     = require('./config');
var os        = require('os');
var R         = require('ramda');
var util      = require('util');

const CPUS    = os.cpus().length - 1;
const WORKERS = nconf.get('workers');

let tasks = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

cluster.setupMaster({
  exec: 'worker.js'
});

cluster.on('exit', function(worker, code, signal) {
  console.log(`Worker ${worker} died`);
});

cluster.on('online', function(worker) {
  console.log(`Worker ${worker.id} is online`);
});

function spawnWorkers () {
  let workers = R.lte(WORKERS, CPUS) ? WORKERS : CPUS;
  for (var i = 0; i < workers; i++) {
    cluster.fork();
  }
}

let assignTasks = function () {
  let balancer = new Balancer(Object.keys(cluster.workers).length);
  let taskList = R.clone(tasks);
  let registerTask = {action: 'register'};

  while (taskList.length > 0) {
    let newTask = R.merge(registerTask,{
      task: taskList.shift()
    });
    while (true) {
      let nextId = balancer.next();
      if (cluster.workers[nextId]){
        cluster.workers[nextId].send(newTask);
        break;
      } else {
        console.log('still waiting');
      }
    }
  }
};

// exec

spawnWorkers();
assignTasks();

for (var id in cluster.workers) {
  cluster.workers[id].send({action: 'report'});
}
