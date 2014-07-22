var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({lazy:false});

gulp.task('scripts', function(){
  //combine all js files of the app
  gulp.src(['!./app/**/*_test.js','./app/**/*.js'])
    // .pipe(plugins.jshint())
    // .pipe(plugins.jshint.reporter('default'))
    .pipe(plugins.concat('app.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('templates',function(){
  //combine all template files of the app into a js file
  gulp.src(['!./app/index.html',
    './app/**/*.html'])
    .pipe(plugins.angularTemplatecache('templates.js',{standalone:true}))
    .pipe(gulp.dest('./build'));
});

gulp.task('css', function(){
  gulp.src(['./app/**/*.css'])
    .pipe(plugins.concat('app.css'))
    .pipe(gulp.dest('./build'));
});

gulp.task('clean-bower-main', function(){
  var stream = gulp.src('./bower_components-main', {read: false})
    .pipe(plugins.clean({force: true}));
  return stream;
});

gulp.task('bower-main', ['clean-bower-main'], function(){
  var stream = plugins.bowerFiles()
    .pipe(gulp.dest('./bower_components-main'));
  return stream;
});

gulp.task('bowerJS', ['bower-main'], function(){
  //concatenate vendor JS files
  gulp.src('./bower_components-main/**/*.js')
    .pipe(plugins.concat('lib.js'))
    .pipe(gulp.dest('./build'));
});

gulp.task('bowerCSS', ['bower-main'], function(){
  //concatenate vendor CSS files
  gulp.src(['./bower_components-main/**/*.css'])
    .pipe(plugins.concat('lib.css'))
    .pipe(gulp.dest('./build'));
});

gulp.task('copy-index', function() {
  gulp.src('./app/index.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('build',['scripts','templates','css','copy-index','bowerJS','bowerCSS']);

gulp.task('connect', plugins.connect.server({
  root: ['build'],
  port: 9000,
  livereload: true
}));

gulp.task('serve',['build','connect']);

gulp.task('watch', ['serve'], function(){
  gulp.watch([
    'build/**/*.html',
    'build/**/*.js',
    'build/**/*.css'
  ], function(event) {
    return gulp.src(event.path)
      .pipe(plugins.connect.reload());
  });
  gulp.watch(['./app/**/*.js','!./app/**/*test.js'],['scripts']);
  gulp.watch(['!./app/index.html','./app/**/*.html'],['templates']);
  gulp.watch('./app/**/*.css',['css']);
  gulp.watch('./app/index.html',['copy-index']);
});

gulp.task('default',['build']);
