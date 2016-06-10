'use strict';

var postcss = require('postcss');
// /*DEBUG*/ var appendout = require('fs').appendFileSync;

module.exports = postcss.plugin('postcss-secmodify', function secModify(SMI) {

  return function(css, result) {

    //Nothing to replace with? Bug out!
    if (!SMI.hasOwnProperty('rString')) {
      result.warn('\'rString\', the value that will be used during a replace is undefined, make sure you pass an object with the \'rString\' keyvalue into secModify');
      return;
    } else if (typeof SMI.rString !== 'string' && typeof SMI.rString !== 'function') {
      result.warn('\'rString\', the value that will be used during a replace is not a string or a function, make sure you give \'rString\' a string when passing it in.');
      return;
    }

    // /*DEBUG*/ appendout('./test/debugout.txt', '\n----------------------------------------');
    ['sel', 'dec', 'decVal', 'atRule', 'media', 'selInMedia', 'decInMedia', 'decValInMedia', 'atRuleInMedia'].forEach(function(filter) {
      if (!SMI.hasOwnProperty(filter)) {
        return;
      } else if (typeof SMI[filter] === 'undefined') {
        return;
      }
      if (filter.indexOf('sel') !== -1) {
        css.walkRules(function(targetNode) {
          secReplace(targetNode, filter, 'selector');
        });
      }else if (filter.indexOf('dec') !== -1) {
        var key = 'prop';
        if (filter.indexOf('Val') !== -1) {
          key = 'value';
        }
        css.walkDecl(function(targetNode) {
          secReplace(targetNode, filter, key);
        });
      }else if (filter.indexOf('atRule') !== -1) {
        css.walkAtRule(function(targetNode) {
          secReplace(targetNode, filter, 'params');
        });
      }else if (filter === 'media') {
        css.walkAtRule(function(targetNode) {
          if (targetNode.name !== 'media') {
            return;
          }
          var str = targetNode.params;

          //Bailout for a bad node[key] or a non-target
          if (str === '' || typeof str === 'undefined') {
            return;
          }
          // // /*DEBUG*/ appendout('./test/debugout.txt', '\n\nRunning with SMI[' + filter + '], which contains:\n' + SMI[filter] + '\nwith key: params, and str: ' + str);
          if (SMI[filter].constructor === Array) {
            SMI[filter].forEach(function(rExpression) {
              str = str.replace(rExpression, SMI.rString);
            });
          } else {
            str = str.replace(SMI[filter], SMI.rString);
          }
          targetNode.params = str;
        });
      }
    });

    function secReplace(node, filter, key) {
      var mediaOnly = (filter.indexOf('InMedia') !== -1);
      var str = '';
      if (mediaOnly && hasMediaAncestor(node)) {
        str = node[key];
      } else if (!mediaOnly && !hasMediaAncestor(node)) {
        str = node[key];
      }
      //Bailout for a bad node[key] or a non-target
      if (str === '' || typeof str === 'undefined') {
        return;
      }
      // /*DEBUG*/ appendout('./test/debugout.txt', '\n\nRunning with SMI[' + filter + '], which contains:\n' + SMI[filter] + '\nwith key: ' + key + ', and str: ' + str);
      if (SMI[filter].constructor === Array) {
        SMI[filter].forEach(function(matcher) {
          str = str.replace(matcher, SMI.rString);
        });
      } else {
        str = str.replace(SMI[filter], SMI.rString);
      }
      node[key] = str;
    }

    function hasMediaAncestor(node) {
      var parent = node.parent;
      if (parent === undefined) {
        return false;
      }
      if (parent.type === 'atrule' && parent.name === 'media') {
        return true;
      }
      if (parent.type !== 'root') {
        return hasMediaAncestor(parent);
      }
    }
  };
});
