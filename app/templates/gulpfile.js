;(function (){
  
  'use strict';

  // Put Your CSS Dependencies Here
  var cssVendorFiles = 
  [
    'normalize-css/normalize.css'
  ];

  // Require Specific Modules
  var gulp        = require('gulp'),
      sass        = require('gulp-sass'),
      uglify      = require('gulp-uglify'),
      jade        = require('gulp-jade'),
      concat      = require('gulp-concat'),
      livereload  = require('gulp-livereload'),
      tinylr      = require('tiny-lr'),
      express     = require('express'),
      app         = express(),
      browserify  = require('browserify'),
      transform   = require('vinyl-transform'),
      path        = require('path'),
      server      = tinylr(),
      gulpif      = require('gulp-if');

  // Convert SASS (.scss) files to CSS (.css)
  gulp.task('css', function() {
    return gulp.src('app/styles/*.scss')
      .pipe( 
        sass( { 
          includePaths: ['app/styles'],
          errLogToConsole: true
        } ) )
      .pipe(gulp.dest('dist/styles/') )
      .pipe(livereload( server ));
  });
   
  // Browseriy's, Uglify's, & Concats JS
  // Note, we only Uglify when production is true
  function js(production) {
    var browserified = transform(function(filename) {
      var b = browserify(filename);
      return b.bundle();
    });
    return gulp.src('app/scripts/*.js')
      .pipe(browserified)
      .pipe(gulpif(production, uglify()))
      .pipe(concat('app.min.js'))
      .pipe(gulp.dest('dist/scripts/'))
      .pipe(livereload(server));
  }
   
  // Process .jade files
  gulp.task('jade', function() {
    return gulp.src('app/**/*.jade')
      .pipe(jade({ pretty: true }))
      .pipe(gulp.dest('dist/'))
      .pipe(livereload(server));
  });

  // Bower Dependencies 
  gulp.task('bower-css', function() {
    cssVendorFiles = cssVendorFiles.map(function (f) {
      return 'bower_components/' + f;
    });
    return gulp.src(cssVendorFiles)
      .pipe(concat('vendor.css'))
      .pipe(gulp.dest('dist/styles/'))
      .pipe(livereload(server));
  });


  // Starts an express server 
  gulp.task('server', function() {
    var spawn = require('child_process').spawn

    app.use(require('connect-livereload')());
    app.use(express.static(path.resolve('./dist')));
    app.listen(8000);
    spawn('open', ['http://localhost:8000']);
    return console.log('Listening on port: 8000');
  });
   
  // Sets live-reload to watch the files
  gulp.task('listen', function () {
    server.listen(35729, function (err) {
      if (err) return console.log(err);
    });
    gulp.watch('app/styles/*.scss',['css']);
    gulp.watch('app/scripts/*.js',['js']);
    gulp.watch('app/**/*.jade',['jade']);
        
  });

  // Watch Task
  // Watches files and runs live-reload
  gulp.task('watch', ['css', 'jade', 'server', 'bower-css', 'listen'], function () {
    return js(false);
  });

  // Build Task
  gulp.task('build', ['css', 'jade', 'bower-css'], function () {
    return js(true);
  });

  // Default Task
  gulp.task('default', ['build']);
  

}());