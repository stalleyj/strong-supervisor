// Copyright IBM Corp. 2014,2015. All Rights Reserved.
// Node module: strong-supervisor
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var printfReplacer = require('./printf-replacer');

exports.expand = function(str, worker) {
  return printfReplacer(str || '', workerParams(worker));
};

function workerParams(worker) {
  var vars = {};
  if ('id' in worker)
    vars.w = worker.id;
  if ('pid' in worker)
    vars.p = worker.pid;
  if ('appName' in worker) // normalize dots out of app names
    vars.a = String(worker.appName).replace(/\./g, '-');
  if ('hostname' in worker) // truncate hostname to first component
    vars.h = String(worker.hostname).replace(/\..*/, '');
  return vars;
}
