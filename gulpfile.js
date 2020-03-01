const run = require('gulp-run');
const gulp = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const pug = require('gulp-pug');
const babel = require("gulp-babel");
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const beautify = require('gulp-beautify');
const htmlMin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const ftp = require('vinyl-ftp');

// Setup the sass compiler.
sass.compiler = require('node-sass');

/**
 * Settings. Activate or deactivate tasks.
 */
const settings = {
  clean: true,
  normalize: true,
  sass: true,
  pug: true,
  js: true,
  jekyll: true,
  browserSync: true,
  ftpUpload: true,
  watch: true,

  // Build production
  cssMinify: true,
  htmlMinify: true,
  jsMinify: true
};

/**
 * FTP information to deploy on server.
 */

// {
//   "host": "185.224.138.15",
//   "port": "21",
//   "user": "",
//   "password": "",
//   "serverPath": "aero-dev"
// }

try {
  const ftpInfo = require('./ftp.json');
} catch (error) {
  const ftpInfo = false;
  console.error('The ftp.json does not exist in the root directory.');
}

/**
 * Files and folders paths.
 */
const outDir = './_public';

const cleanFiles = [outDir, './_layouts', './*.html', './.sass-cache', './.pug-cache', './.jekyll-metadata', './*.html', './_sass/modules/_normalize.scss'];
const imgFiles = ['./_img/**/*'];
const pugFiles = ['./_pug/**/*.pug'];
const pugWatchFiles = ['./*.{pug,md}', './_pug/**/*.pug', './_includes/**/*.pug', './_layouts/**/*.pug', './_pages/**/*.pug', './_posts/**/*.{pug,md}', './_projects/**/*.pug'];
const sassFiles = ['./_sass/**/*.{sass,scss}'];
const jsFiles = ['./_js/**/*'];
const ymlReload = ['./admin/**/*'];

/**
 * Clean all the unnecessary files.
 */
function cleanTask(done) {

  if (!settings.clean) {
    done();
    return;
  }

  return gulp.src(cleanFiles, {
    read: false,
    allowEmpty: true
  })
    .pipe(clean())
    .on('close', done);
}

/**
 * Rename NPM's 'normalize.css' to '_normalize.scss' and move it to the working directory.
 */
function normalizeScssTask(done) {

  if (!settings.normalize) {
    return gulp.src('./_sass/**/*.sass')
      .pipe(replace('@import \'modules/normalize\'', '// @normalize deactivated'))
      .pipe(gulp.dest('./_sass'))
      .on('close', done);
  } else {
    gulp.src('./_sass/**/*.sass')
      .pipe(replace('// @normalize deactivated', '@import \'modules/normalize\''))
      .pipe(gulp.dest('./_sass'))
      .on('close', done);
  }

  return gulp.src('./node_modules/normalize.css/normalize.css')
    .pipe(rename(function (path) {
      path.basename = '_normalize';
      path.extname = '.scss';
    }))
    .pipe(gulp.dest('./_sass/modules'))
    .on('close', done);
}

/**
 * Compile into _site/css for live injecting. 
 */
function sassCompileTask(done) {

  if (!settings.sass) {
    done();
    return;
  }

  return gulp.src(sassFiles)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(prefix({
      cascade: true
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outDir + '/css'))
    .pipe(browserSync.stream())
    .on('close', done);
}

/**
 * Compile sass files, but first import normalize.
 */
const sassTask = gulp.series(normalizeScssTask, sassCompileTask);

/**
 * Minify the css compiled file.
 */
function cssMinifyTask(done) {

  if (!settings.cssMinify) {
    done();
    return;
  }

  return gulp.src(outDir + '/css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outDir + '/css'))
    .on('close', done);
}

/**
 * Compile pug into html.
 */
function pugCompileTask(done) {

  if (!settings.pug) {
    done();
    return;
  }

  return gulp.src(pugFiles)
    .pipe(pug({
      pretty: '\t',
      compileDebug: true
    }))
    .pipe(replace(/\B\n---\n/m, '---\n'))
    .pipe(gulp.dest(!settings.jekyll ? outDir : './'))
    .on('close', done);
}

/**
 * Minify the html compiled files.
 */
function htmlMinifyTask(done) {

  if (!settings.htmlMinify) {
    done();
    return;
  }

  return gulp.src(outDir + '/**/*.html')
    .pipe(htmlMin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(outDir))
    .on('close', done);
}

/**
 * Beautify the html compiled files.
 */
function htmlBeautifyTask(done) {
  return gulp.src(outDir + '/**/*.html')
    .pipe(beautify.html())
    .pipe(gulp.dest(outDir))
    .on('close', done);
}

/**
 * Optimize image files.
 */
function imgOptimizeTask(done) {
  return gulp.src(imgFiles)
    .pipe(imagemin())
    .pipe(gulp.dest(outDir + '/img'))
    .on('close', done);
}

/**
 * Compile all js files and concatenate them with sourcemaps.
 */
function jsCompileTask(done) {

  if (!settings.js) {
    done();
    return;
  }

  return gulp.src(jsFiles)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outDir + '/js'))
    .on('close', done);
}

/**
 * Minify the js compiled file.
 */
function jsMinifyTask(done) {

  if (!settings.jsMinify) {
    done();
    return;
  }

  return gulp.src(outDir + '/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(outDir + '/js'))
    .on('close', done);
}

/**
 * Build the Jekyll site. Jekyll Bliss was used in order to use Pug.
 */
function jekyllBuildTask(done) {

	if (!settings.jekyll) {
		done();
		return;
	}

  browserSync.notify('Running: $ jekyll build');
  
	return run('bundle exec jekyll build --incremental --destination ' + outDir).exec()
		.on('close', done);
}

/**
 * Synchronize the local files with the browser server.
 */
function browserSyncTask(done) {

  if (!settings.browserSync) {
    done();
    return;
  }

  browserSync.init({
    server: outDir
  });
  done();
}

/**
 * Browser sync reload.
 */
function browserSyncReloadTask(done) {

  if (!settings.browserSync) {
    done();
    return;
  }

  browserSync.reload();
  done();
}

/**
 * 
 */
function ftpUploadTask(done) {

  if (!settings.ftpUpload) {
    done();
    return;
  }

  if (!ftpInfo) {
    console.error('The ftp.json does not exist in the root directory.');
    done();
    return;
  }

  const conn = ftp.create({
    host: ftpInfo.host,
    port: ftpInfo.port,
    user: ftpInfo.user,
    password: ftpInfo.password,
    parallel: 10
  });

  // Using base = '.' will transfer everything to /public_html correctly.
  // Turn off buffering in gulp.src for best performance.

  return gulp.src(outDir + '/**/*', {
    base: outDir,
    buffer: false
  })
    .pipe(conn.newer('/public_html/' + ftpInfo.serverPath)) // Only upload newer files.
    .pipe(conn.dest('/public_html/' + ftpInfo.serverPath))
    .on('close', done);
}

/**
 * Watch all files and compile them when changes are detected.
 */
function watchTask(done) {

  if (!settings.watch) {
    done();
    return;
  }

  gulp.watch(sassFiles, sassCompileTask);
  gulp.watch(ymlReload, gulp.series(jekyllBuildTask,browserSyncReloadTask ));
  gulp.watch(jsFiles, gulp.series(jsCompileTask, browserSyncReloadTask));
  gulp.watch(imgFiles, imgOptimizeTask);
  gulp.watch(pugWatchFiles, gulp.series(pugCompileTask, jekyllBuildTask, gulp.parallel(sassTask, jsCompileTask,imgOptimizeTask), browserSyncReloadTask));
  done();
}

/**
 * Build the entire website by compiling everyting.
 */
const buildTask = gulp.series(cleanTask, pugCompileTask, jekyllBuildTask, imgOptimizeTask, gulp.parallel(htmlBeautifyTask, sassTask, jsCompileTask));

/**
 * Build the entire website by compiling everyting for production with minified css and js files.
 */
const buildProductionTask = gulp.series(buildTask, gulp.parallel(htmlMinifyTask, cssMinifyTask, jsMinifyTask));

/**
 * Build and watch files.
 */
const defaultTask = gulp.series(buildProductionTask, gulp.parallel(watchTask, browserSyncTask));

/**
 * Export tasks to the outside context in order to make them public.
 */
exports.clean = cleanTask;
exports.sass = sassTask;
exports.pug = pugCompileTask;
exports.js = jsCompileTask;
exports.jekyll = jekyllBuildTask;
exports.build = buildTask;
exports.buildProduction = buildProductionTask;
exports.ftpUpload = ftpUploadTask;
exports.watch = watchTask;
exports.default = defaultTask;