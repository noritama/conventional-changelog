#!/usr/bin/env node

var pkg = require('./package.json');
var fs = require('fs');
var changelog = require('./lib/changelog');

changelog({
  version: pkg.version,
  repository: 'https://github.com/ajoslin/conventional-changelog'
}, function(log) {
  fs.writeFileSync('CHANGELOG.md', log);
});