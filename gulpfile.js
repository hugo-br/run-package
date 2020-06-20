const settings = require('./settings.js');

var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    rename      = require('gulp-rename'),
    cssmin      = require('gulp-cssnano'),
    prefix      = require('gulp-autoprefixer'),
    plumber     = require('gulp-plumber'),
    notify      = require('gulp-notify'),
    sourcemaps  = require('gulp-sourcemaps'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    babel       = require('gulp-babel');    

var displayError = function(error) {
  // Initial building up of the error
  var errorString = '[' + error.plugin.error.bold + ']';
  errorString += ' ' + error.message.replace("\n",''); // Removes new line at the end

  // If the error contains the filename or line number add it to the string
  if(error.fileName)
      errorString += ' in ' + error.fileName;

  if(error.lineNumber)
      errorString += ' on line ' + error.lineNumber.bold;

  // This will output an error like the following:
  // [gulp-sass] error message in file_name on line 1
  console.error(errorString);
};

var onError = function(err) {
  notify.onError({
    title:    "Error Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Basso"
  })(err);
  this.emit('end');
};

var sassOptions = {
  outputStyle: 'expanded'
};

var prefixerOptions = {
  overrideBrowserslist: ['last 4 version', 'ie > 8', 'safari 5']
};

// BUILD SUBTASKS
// ---------------^

// process sass et scss files
// create multiples minified and 
gulp.task('style', function() {
  return gulp.src(settings.cssFiles)
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(gulp.dest('output/css'))

	// minified each
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('output/css/min'))
});

// combined all css into one file
gulp.task('combined-style', function() {
  return gulp.src(settings.cssFiles)
    .pipe(plumber({errorHandler: onError}))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(prefix(prefixerOptions))
    .pipe(gulp.dest('output/css'))

	// minified each
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('output/css/min'))
	
	// minified combined 
    .pipe(concat('combined.css'))
    .pipe(cssmin())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('output/css/combined'));
});



// AUTO TASKS
// ------------
gulp.task('auto-style', function () {
	gulp.watch(settings.cssFiles, gulp.series('style'));
});


/****************
        js
 *****************/ 

gulp.task('js', function() {
  return gulp.src(settings.jsFiles)
    .pipe(babel({
        presets: ['@babel/env']
    })) 
    .pipe(gulp.dest('output/js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('output/js/min'));
});

/* Build the prod Js file */
// minified fold
gulp.task('combined-js', function() {
  return gulp.src(settings.jsFiles)
   .pipe(babel({
        presets: ['@babel/env']
    })) 
    .pipe(concat('combined.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('output/js/combined'));
});


// AUTO TASKS
// ------------
gulp.task('auto-js', function () {
	gulp.watch(settings.jsFiles, gulp.series('js'));
});

gulp.task('combined', function () {
	gulp.watch(settings.jsFiles, gulp.series('combined-js'));
});