'use strict';

var test = require('tape');
var postcss = require('postcss');
var secModify = require('..');

function checkForWarnings(css, inputObject, cb) {
  postcss(secModify(inputObject)).process(css).then(function(result) {
    cb(result.warnings(), result);
  }).catch(function(err) {
    console.log(err);
  });
}

test('registers no rString warning', function(t) {

  t.test('completely left out of input object', function(st) {
    var simple = '.foo { color: blue; }';
    var inputObject = { sel: '.foo' };
    checkForWarnings(simple, inputObject, function(warnings, result) {
      st.equal(warnings.length, 1, 'registers a warning');
      st.ok(/used during a replace is undefined, make sure you pass an object with the 'rString' keyvalue/.test(warnings[0].text),
        'registers the right warning');
      st.equal(result.css, simple, 'untampered css');
      st.end();
    });
  });

  t.end();
});

test('registers non-string rString warning', function(t) {

  t.test('bad input', function(st) {
    var simple = '.foo { color: blue; }';
    var inputObject = { sel: '.foo', rString: new RegExp(/.bar/g) };
    checkForWarnings(simple, inputObject, function(warnings, result) {
      st.equal(warnings.length, 1, 'registers a warning');
      st.ok(/value that will be used during a replace is not a string/.test(warnings[0].text),
        'registers the right warning');
      st.equal(result.css, simple, 'untampered css');
      st.end();
    });
  });

  t.end();
});