'use strict';
var es = require('event-stream');
var Writer = require('./Writer');

var EMPTY_COMPONENT = '$$';

function writeLog(commits, options, done) {
  var log = '';
  var stream = es.through(function(data) {
    log += data;
  }, function() {
    done(null, log);
  });

  var writer = new Writer(stream, options);
  var sections = {
    fix: {},
    feat: {},
    breaks: {},
    other: {}
  };

  commits.forEach(function(commit) {
    var section = sections[commit.type] || sections.other;
    var component = commit.component || EMPTY_COMPONENT;

    section[component] = section[component] || [];
    section[component].push(commit);

    commit.breaks.forEach(function(breakMsg) {
      sections.breaks[EMPTY_COMPONENT] = sections.breaks[EMPTY_COMPONENT] || [];

      sections.breaks[EMPTY_COMPONENT].push({
        subject: breakMsg,
        hash: commit.hash,
        closes: []
      });
    });
  });

  if (!writer.header()) {
    return done('No version specified');
  }
  writer.section('Bug Fixes', sections.fix);
  writer.section('Features', sections.feat);
  writer.section('Breaking Changes', sections.breaks);
  writer.section('Other Changes', sections.other);
  writer.end();
}

module.exports = writeLog;
