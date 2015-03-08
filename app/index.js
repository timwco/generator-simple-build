'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var AppGenerator = module.exports = function Appgenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.options = options;
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AppGenerator, yeoman.generators.Base);

AppGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  if (!this.options['skip-welcome-message']) {
    this.log(yosay('Single Malt : A Small Custom Generator \n Version: ' + this.pkg.version));
  }

  cb();
};

AppGenerator.prototype.gulpfile = function () {
  this.template('gulpfile.js');
};

AppGenerator.prototype.packageJSON = function () {
  this.template('_package.json', 'package.json');
};

AppGenerator.prototype.git = function () {
  this.copy('gitignore', '.gitignore');
};

AppGenerator.prototype.bower = function () {
  this.copy('bower.json', 'bower.json');
};


AppGenerator.prototype.editorConfig = function () {
  this.copy('Readme.md', 'Readme.md');
};

AppGenerator.prototype.mainStylesheet = function () {
  var css = 'main.scss';
  this.copy(css, 'app/styles/' + css);
};

AppGenerator.prototype.writeIndex = function () {
  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.jade'));
  this.indexFile = this.engine(this.indexFile, this);

  this.indexFile = this.appendFiles({
    html: this.indexFile,
    fileType: 'js',
    optimizedPath: 'scripts/app.js',
    sourceFileList: ['scripts/app.js']
  });
};

AppGenerator.prototype.app = function () {
  this.mkdir('app');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/images');
  this.write('app/index.jade', this.indexFile);
  this.write('app/scripts/app.js', 'console.log(\'Ready. Set. Go!\');');
};

AppGenerator.prototype.install = function () {

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: function () {
      var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));

      done();
    }.bind(this)
  });
};
