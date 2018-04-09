#!/usr/bin/env node
'use strict';

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _shins = require('shins');

var _shins2 = _interopRequireDefault(_shins);

var _npmRoot = require('npm-root');

var _npmRoot2 = _interopRequireDefault(_npmRoot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const d = new _debug2.default('make-shins');

_commander2.default.version('0.1.0').option('-i, --input <input>', 'Input markdown file', 'index.html.md').option('-o, --output <output>', 'Output directory', 'public').option('-l, --logo <logo>', 'logo.png file to use').option('-c, --custom-css <custom-css>', 'Directory to custom CSS').option('-i, --inline', 'Inlines CSS and JS, minifies output').option('-m, --minify', 'Minifies the output').option('-l, --local', 'Specify that this module is installed locally and not globally').parse(process.argv);

console.time('make-shins');
d('Reading markdown');
const markdownString = _fsExtra2.default.readFileSync(_path2.default.resolve(_commander2.default.input), 'utf8');

d('Rendering shins');
_shins2.default.render(markdownString, {
  customCss: _commander2.default.customCss,
  inline: _commander2.default.inline,
  minify: _commander2.default.minify
}, (error, html) => {
  if (error) {
    console.error('Could not render shins', error);
  }

  if (_commander2.default.output) {
    d('Preparing output directory');
    // prepare by removing, since shins uses symlinks which break copySync
    _fsExtra2.default.removeSync(_commander2.default.output);
    d('Writing output');
    (0, _npmRoot2.default)({
      global: !_commander2.default.local
    }, (error, rootPath) => {
      _fsExtra2.default.copySync(_path2.default.join(rootPath, '/make-shins/node_modules/shins'), _commander2.default.output, {
        dereference: true
      });
      _fsExtra2.default.writeFileSync(_path2.default.join(_commander2.default.output, 'index.html'), html);

      if (_commander2.default.customCss) {
        d('Copying custom CSS');
        _fsExtra2.default.copySync(_commander2.default.customCss, _path2.default.join(_commander2.default.output, '/pub/css'));
      }

      if (_commander2.default.logo) {
        d('Copying logo.png');
        _fsExtra2.default.copySync(_commander2.default.logo, _path2.default.join(_commander2.default.output, 'source/images/logo.png'));
      }
    });
  }
  d('Finished');
  console.timeEnd('make-shins');
});