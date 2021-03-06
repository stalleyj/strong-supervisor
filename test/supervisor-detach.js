// Copyright IBM Corp. 2014,2016. All Rights Reserved.
// Node module: strong-supervisor
// This file is licensed under the Artistic License 2.0.
// License text available at https://opensource.org/licenses/Artistic-2.0

'use strict';

var child_process = require('child_process');
var assert = require('assert');
var path = require('path');
var fs = require('fs');

var slr = require.resolve('../bin/sl-run');

var exp = /^supervisor (\d+) detached process (\d+), output log in '(\S+)'$/mg;

describe('supervisor --detach', function() {
  var pids = [];

  this.timeout(10000); // CI machines are slow for process creation

  beforeEach(function() {
    // re-using exp means resetting it after each use
    exp.lastIndex = 0;
  });

  afterEach(function() {
    pids.forEach(function(pid) {
      try { process.kill(pid, 'SIGTERM'); } catch (e) { }
    });
    pids = [];
  });

  it('creates a detached process', function(done) {
    var app = path.join('test', 'module-app');
    var cmd = [slr, '--detach', app].join(' ');
    child_process.exec(cmd, function(err, stdout, stderr) {
      assert.ifError(err);
      var parts = exp.exec(stderr.toString());
      var detachedPid = parts[2];
      var logName = parts[3];
      var logPath = path.join(app, logName);
      pids.push(detachedPid);
      assert(fs.existsSync(logPath), logPath + ' should exist');
      done();
    });
  });

  it('creates a log file matching spec', function(done) {
    var app = path.join('test', 'module-app');
    var cmd = [slr, '--detach', '--log=myApp-%w-%p.log', app].join(' ');
    child_process.exec(cmd, function(err, stdout, stderr) {
      assert.ifError(err);
      var parts = exp.exec(stderr.toString());
      var detachedPid = parts[2];
      var logName = parts[3];
      var logPath = path.join(app, logName);
      pids.push(detachedPid);
      assert(fs.existsSync(logPath), logPath + ' should exist');
      done();
    });
  });

});
