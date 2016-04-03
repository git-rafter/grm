(function(){
    var gulp = require('gulp'),
        mocha = require('gulp-mocha'),
        jshint = require('gulp-jshint'),
        gutil = require('gulp-util'),
        lodash = require('lodash'),
        runSequence = require('run-sequence'),
        istanbul = require('gulp-istanbul'),
        del = require('del'),
        paths = {
            scripts: ['lib/commands/**/*.js'],
            tests: ['test/**/*.spec.js']
        };

    // Test Tasks
    gulp.task('mocha', function(){
        global.expect = require('chai').expect;
        global.assert = require('chai').assert;
        global.sinon = require('sinon');
        global.path = require('path');
        require('chai').use(require('chai-as-promised'));
        require('chai').use(require('sinon-chai'));
        require('sinon-as-promised');



        return gulp.src(paths.tests, {read: false})
            .pipe(mocha({
                reporter: 'spec',
                should: require('chai').should()
            }));
    });

    gulp.task('pre-test', function(){
      return gulp.src(paths.scripts)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
    });

    gulp.task('code-coverage', function(){
      return gulp.src(paths.tests)
        .pipe(istanbul.writeReports({
          dir: 'dist/reports/coverage'
        }))
        .pipe(istanbul.enforceThresholds(
          {
            thresholds: {
              global: {
                branches: 75
              }
            }
          }));
    })

    gulp.task('lint', function(){
        return gulp.src(paths.scripts.concat(paths.tests))
            .pipe(jshint())
            .pipe(jshint.reporter('jshint-stylish'));
    });

    gulp.task('test', function(done){
      runSequence('lint', 'pre-test', 'mocha', 'code-coverage', done);
    });

    gulp.task('default', ['test']);

    gulp.task('clean', function(done){
      del(['dist/*'], done)
    });
})();
