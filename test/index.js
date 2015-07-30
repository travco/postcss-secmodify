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

test('Crossed Fingers', function(t) {
  var oneBigInputObject = {
    // sel: [],
    // def: [],
    // atRule: [],
    media: new RegExp(/-md-/g),
    selInMedia: ['-md-', '-me-', '-mg-'],
    // defInMedia: [],
    // atRuleInMedia: [],
    rString: '-mKelty-'
  };
  compareFixtures(t, 'basic', oneBigInputObject);
  t.end();
});

// require('./warnings');
