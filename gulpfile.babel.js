const gulp= require('gulp');
const gulpLoadPlugins= require('gulp-load-plugins');
const browserSync= require('browser-sync');
const childProcess= require('child_process');
const webpack= require('webpack2-stream-watch');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// =======================
//  TASKS FOR DEVELOPMENT
// =======================

// Starts browsersync and file watching
gulp.task('serve', ['browser-sync'], () => {
  gulp.watch(['src/_sass/**/*.scss','src/css/*.scss'], ['sass']);
  gulp.watch(['src/_js/**/*.js'], ['js']);
  gulp.watch(['src/_assets/**/*'], ['imagemin']);
  gulp.watch(['src/graveyard/**/*', 'src/_data/*', 'src/*.html', 'src/*.md', 'src/_plugins/**/*.*', 'src/_layouts/**/*.*', 'src/_includes/**/*.*', 'src/_posts/**/*.*', 'src/_drafts/**/*.*', 'src/_pages/**/*.*'], ['build:reload']);
});

// Builds Jekyll site (including drafts)
gulp.task('build', done => {
  return childProcess.spawn('jekyll', ['build', '--drafts'], {stdio: 'inherit'})
  .on('close', done);
});

// First runs jekyll build task, then reloads browser
gulp.task('build:reload', ['build'], () => { reload(); });

// ======================
//  TASKS FOR DEPLOYMENT
// ======================

// First run htmlmin, then deploy to github
gulp.task('deploy', ['htmlmin'], () => {
  return gulp.src('./dist/**/*').pipe($.ghPages({branch: 'prod'}));
});

// First run build:prod and then minify HTML
gulp.task('htmlmin', ['build:prod'], () => {
  return gulp.src('./dist/**/*.html')
    .pipe($.htmlmin( {collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'))
    .pipe(reload({stream: true}));
});

// Runs jekyll build for 'production' environment
gulp.task('build:prod', ['js', 'sass', 'imagemin'], done => {
  var productionEnv = process.env;
      productionEnv.JEKYLL_ENV = 'production';

  return childProcess.spawn('jekyll', ['build', '--config', '_config.yml,_config.build.yml'], {stdio: 'inherit' , env: productionEnv}).on('close', done);
});

// ====================
//  OTHER USEFUL TASKS
// ====================

// Browser sync + styles for the notification
gulp.task('browser-sync', ['js', 'sass', 'imagemin', 'build'], () => {
  browserSync({
    notify: {
      styles: [
        'font-weight: bold;',
        'padding: 10px;',
        'margin: 0;',
        'position: fixed;',
        'font-size: 0.6em;',
        'line-height: 0.8em;',
        'z-index: 9999;',
        'left: 5px;',
        'top: 5px;',
        'color: #fff;',
        'border-radius: 2px',
        'background-color: #333;',
        'background-color: rgba(50,50,50,0.8);'
      ]
    },
    server: {
      baseDir: 'dist'
    }
  });
});

// Compile sass + livereload with css injection + minificiation
gulp.task('sass', () => {
  return gulp.src('src/css/main.scss')
    .pipe($.sass({
      includePaths: ['src/_sass'],
      onError: browserSync.notify
    }))
    .pipe($.autoprefixer(['last 15 versions', '> 1%', 'ie 8'], {cascade: true}))
    .pipe($.rename('main.css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(reload({stream: true}))
    .pipe($.minifyCss({keepBreaks: false, keepSpecialComments:true}))
    .pipe($.rename({extname: '.min.css'}))
    .pipe(gulp.dest('dist/css'));
});

// Compile JavaScript files + uglifies files
gulp.task('js', () => {
  return gulp.src('src/_js/**/*.js')
    .pipe(webpack({
      module: {
        rules: [{
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: '/node_modules/',
          query: { compact: false }
        }]
      }
    }))
    .pipe($.rename('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(reload({stream: true}))
    .pipe($.uglify({onError: browserSync.notify}))
    .pipe($.rename({extname: '.min.js'}))
    .pipe(gulp.dest('dist/scripts'));
});

// Optimise images + copy any other assets
gulp.task('imagemin', () => {
  return gulp.src('src/_assets/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/assets'));
});
