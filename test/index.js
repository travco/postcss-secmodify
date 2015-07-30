'use strict';

var fs = require('fs');
var postcss = require('postcss');
var test = require('tape');
var secModify = require('..');

function fixturePath(name) {
  return 'test/fixtures/' + name + '.css';
}

function fixture(name) {
  return fs.readFileSync(fixturePath(name), 'utf8').trim();
}

function compareFixtures(t, name, SMI) {
  var actualCss = postcss(secModify(SMI))
    .process(fixture(name), { from: fixturePath(name) })
    .css
    .trim();

  fs.writeFile(fixturePath(name + '.actual'), actualCss);

  var expectedCss = fixture(name + '.expected');

  return t.equal(
    actualCss,
    expectedCss,
    'processed fixture ' + name + ' should be equal to expected output'
  );
}

// function p(css) {
//   return postcss(secModify()).process(css).css;
// }

test('Basic', function(t) {
  var inputObject = {
    sel: new RegExp(/.u-/g),
    // dec: [],
    // decVal: [],
    // atRule: [],
    // media: [],
    // selInMedia: [],
    // decInMedia: [],
    // decValInMedia: [],
    // atRuleInMedia: [],
    rString: '.u-md-'
  };
  compareFixtures(t, 'basic', inputObject);
  t.end();
});

test('Basic in Media', function(t) {
  var inputObject = {
    media: new RegExp(/-md-/g),
    selInMedia: ['-md-', '-me-', '-mg-'],
    rString: '-tKelty-'
  };
  compareFixtures(t, 'basic-media', inputObject);
  t.end();
});

test('Basic for shortcuts', function(t) {
  var inputObject = {
    decValInMedia: '!i',
    rString: '!important'
  };
  compareFixtures(t, 'basic-shortcut', inputObject);
  t.end();
});

require('./warnings');
