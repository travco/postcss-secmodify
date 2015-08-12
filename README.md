# postcss-secmodify [![Build Status](https://travis-ci.org/travco/postcss-secmodify.svg?branch=master)](https://travis-ci.org/travco/postcss-secmodify)

**A [PostCSS](https://github.com/postcss/postcss) plugin that allows you to target individual sections of your CSS and modify them.** 
(So you can pretend it's not a hacky fix)

Use this plugin to:
- Target certain parts of your css so you don't have to worry about accidentally matching and replacing something you didn't want to touch
- Make edits to personalize a CSS library that isn't yours, without needing to maintain your own clone (as much).
- Make a postcss polyfill, without the time required to code a plugin.
- Make automatic hacky fixes and have some piece of mind that a file-wide RegEx wouldn't give you.

[Installation](https://github.com/travco/postcss-secmodify#installation) | [Usage](https://github.com/travco/postcss-secmodify#usage) | [Getting it Working](https://github.com/travco/postcss-secmodify#getting-it-working-with-postcss) | [Quirks](https://github.com/travco/postcss-secmodify#quirks)
--- | --- | --- | ---



**`postcss-secmodify` is compatible with PostCSS v4.1+.**

## Installation
```
npm install postcss-secmodify --save
```

## Usage

The config object for this tool controls everything, secModify looks at the keys 'sel', 'dec', 'decVal', 'atRule', 'media', 'selInMedia', 'decInMedia', 'decValInMedia', atRuleInMedia', and 'rString':
```js
var secMConfig = {
  // sel: [],
  // dec: [],
  // decVal: [],
  // atRule: [],
  // media: [],
  // selInMedia: [],
  // decInMedia: [],
  // decValInMedia: [],
  // atRuleInMedia: [],
  rString: ''
};
```
rString's value is a string or function that will be used when replacing (aka: the new stuff that gets put in) and is the only mandatory key and value. It can be an empty string of course, if you feel like removing stuff. It can also use the [`$` patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_string_as_a_parameter) to manipulate what is inserted, or, by [inserting a function to use](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#Specifying_a_function_as_a_parameter) you can do much more than simple replacing.

Everything but 'rString' takes in what will be used to match in it's particular section of the css
- sel's value(s) match selectors for rules (e.g. `.foo`) outside of `@media` blocks,
- dec's value(s) match declaration properties (e.g. `color`) outside of `@media` blocks,
- decVal's value(s) match declaration values (e.g. `blue`) outside of `@media` blocks,
- atRule's value(s) match parameters of non-media at-rules (e.g. the `screen` in `@special screen {`) outside of `@media` blocks,
- media's value(s) match parameters of only `@media` statements,
- selInMedia's value(s) match selectors for rules, but only inside `@media` statements

*... I think you get the picture*

All the these 'matcher' keys can be strings, RegEx objects, or arrays of strings and/or RegEx objects. They are also (as you might have guessed) completely optional, and can be excluded from the object. Secmodify is based off of [string.replace()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace) and inherits it's behavior. For example, an **inputted string (to match) will only match and replace the first thing it finds**.

## Getting It Working with PostCSS

There is a mandatory 'config object' that must be passed in. For example (as a node script):

```js
var fs = require('fs');
var postcss = require('postcss');
var secModify = require('postcss-secmodify');

var inputCss = fs.readFileSync('input.css', 'utf8');

var secMConfig = {
  sel: '.foo',
  dec: [new RegExp(/-\d[abcd]-/g), new RegExp(/-\d+-/g)],
  // atRule: [],
  media: new RegExp(/-\w\w-/g),
  selInMedia: ['stuff', 'things', 'otherStuff'],
  // decInMedia: [],
  // decValInMedia: [],
  // atRuleInMedia: [],
  rString: 'something_else'
};

var outputCss = postcss()
  .use(secModify(secMConfig))
  .process(inputCss)
  .css;

console.log(outputCss);
```
Any part of the config object not declared (besides the rString key) will speed up execution because the things it applies to will not be looked at.

Or instead of doing this directly, you can take advantage of [any of the myriad of other ways to consume PostCSS](https://github.com/postcss/postcss#usage), and follow the plugin instructions they provide.

## Quirks
As with any piece of code it's got a few quirks. Behaviors that are not intended, and not enforced, and may disappear (or be forcibly altered) with the next release, so it's useful to be aware of them.

**Order of Processing** : It should evaluate top-to-bottom, and in the order of 'sel', 'dec', 'decVal', 'atRule', 'media', 'selInMedia', 'decInMedia', 'decValInMedia', 'atRuleInMedia'. So, more or less specificity-inclined.

Developer's thoughts *"Don't get me wrong, this is probably quite niche, but whatever, here it is anyway."*
