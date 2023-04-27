const {src, dest, watch, parallel} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer').create();

// создает файл main.min.js в директории app/js/main.js
// сжимает все файлы в main.min.js из файла main.js

function scripts() {                                
    return src('app/js/main.js')
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
}

// создает файл style.min.css в директории app/scss/style.scss
// сжимает все файлы в style.min.css из файла style.scss
// конвертирует scss в css

function styles() {
    return src('app/scss/style.scss')
    .pipe(concat('style.min.css'))
    .pipe(scss({outputStyle: 'compressed'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
}

// отслеживает изменения в указанных файлах и автосохраняет

function watching() {
    watch(['app/scss/style.scss'], styles)
    watch(['app/js/main.js'], scripts)
    watch(['app/*.html']).on('change', browserSync.reload);
}

// обновляет страницу HTML при изменениях

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });
}

function build() {
    return src([
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/**/*.html'
    ], {base : 'app'})
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;
exports.build = build;

exports.default = parallel(styles, scripts, browsersync, watching);