'use strict';
var cluster   = require('cluster');
var Balancer  = require('./Balancer');
var nconf     = require('./config');
var os        = require('os');
var R         = require('ramda');
var util      = require('util');
var chalk     = require('chalk');

const CPUS    = os.cpus().length - 1;
const WORKERS = nconf.get('workers');

let tasks = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

cluster.setupMaster({
  exec: 'worker.js'
});

cluster.on('exit', function(worker, code, signal) {
  console.log(`Worker ${worker} died`);
  // redistribute jobs
});

cluster.on('online', function(worker) {
  console.log(`Worker ${worker.id} is online`);
  // redistribute jobs (but only in instances after init has completed?)
});

cluster.on('message', function (msg) {
  console.log(chalk.red(util.inspect(msg)));
});

function getWorkers () {
  return Object.keys(cluster.workers);
}

function spawnWorkers () {
  let workers = R.lte(WORKERS, CPUS) ? WORKERS : CPUS;
  for (var i = 0; i < workers; i++) {
    cluster.fork();
  }
}

function broadcast (msg) {
  for (var id in cluster.workers) {
    cluster.workers[id].send(msg);
  }
}

let assignTasks = function () {
  console.log('assigning tasks');
  let balancer = new Balancer({
    nodes: getWorkers().length,
    floor: 1
  });

  let taskList = R.clone(tasks);
  let registerTask = {action: 'REGISTER'};

  while (taskList.length > 0) {
    let newTask = R.merge(registerTask,{
      task: taskList.shift()
    });
    cluster.workers[balancer.next()].send(newTask);
  }
};

// exec

spawnWorkers();

assignTasks();

broadcast({action: 'REPORT'});
