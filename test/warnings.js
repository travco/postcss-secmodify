'use strict';

var test = require('tape');
var postcss = require('postcss');
var simpleExtend = require('..');

function checkForWarnings(css, cb) {
  postcss(simpleExtend).process(css).then(function(result) {
    cb(result.warnings(), result);
  }).catch(function(err) {
    console.log(err);
  });
}

test('registers location warning', function(t) {

  t.test('with non-root definition', function(st) {
    var nonrootDefine = '.foo { @define-placeholder bar { background: pink; } }';
    checkForWarnings(nonrootDefine, function(warnings, result) {
      st.equal(warnings.length, 1, 'registers a warning');
      st.ok(/must occur at the root level/.test(warnings[0].text),
        'registers the right warning');
      st.equal(result.css, '.foo { }', 'bad definition is removed');
      st.end();
    });
  });

  t.end();
});