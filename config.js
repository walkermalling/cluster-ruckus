'use strict';
let nconf       = require('nconf');
let toml        = require('toml');
require('toml-require').install({toml: toml});
let defaults    = require('./defaults');

// set config var priority
nconf.argv().env().defaults(defaults);

// export ncof util with config loaded
module.exports = nconf;
