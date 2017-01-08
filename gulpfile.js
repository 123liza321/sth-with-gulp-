var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    rename = require("gulp-rename"),
    del = require("del");

var path = {
    destination: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html',
        js: 'src/js/main.js',
        scss: 'src/scss/main.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        scss: 'src/scss/**/*.scss',
        img: 'src/img/**/*.*'
    }
};

/*----------------------------- WATCHER functions -----------------------------*/

gulp.task('js', function() { // Конкатенация всех JS файлов
    return gulp.src([path.src.js, path.watch.js]) // На первом месте будет main.js
        .pipe(concat('main.js')) // Конкатенируем все в app.js
        .pipe(uglify({ // Минификация app файла
            compress:{
                hoist_funs: false // Таким образом функции располагаются в правильном порядке. Документация: "hoist function declarations". Изначально true
            }
        }))
        .pipe(rename({suffix: '.min'})) // Добавление суффикса .min
        .pipe(gulp.dest(path.destination.js)); // Сохранение минифицированого файла app.min.js
});

// gulp.task('sass', function () {
//     gulp.src(path.src.scss) // Выберем наш main.scss
//         .pipe(sass()) // Компиляция scss в css
//         .pipe(autoprefixer()) // Добавление вендорных префиксов
//         .pipe(sourcemaps.write()) // Записать все в соурсмапс
//         .pipe(cssmin()) // Минификация css
//         .pipe(rename({suffix: '.min'}))// Добавление суффикса .min
//         .pipe(gulp.dest(path.destination.css)); // Сохранение в build
// });

gulp.task('img', function () {
    gulp.src(path.src.img)
        .pipe(gulp.dest(path.destination.img))
});

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.destination.html))
});

gulp.task('fonts', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.destination.fonts))
});

gulp.task('clean', function () {
    del.sync('build/**');
});

/*----------------------------- VENDOR functions -----------------------------*/

gulp.task('concatVendorJS', function() { // Конкатенация всех вендорных JS с Bower'a
    return gulp.src(['bower_components/jquery/jquery.js', 'bower_components/slick-carousel/slick/slick.min.js']) // Сбор всех js с Bower'a
    //return gulp.src([]) // Сбор всех js с Bower'a
        .pipe(concat('app.vendor.js'))// Конкатенируем все в app.vendor.js
        .pipe(gulp.dest(path.destination.js)); // Сохранение в build
});

gulp.task('concatVendorCSS', function() {
    return gulp.src(['bower_components/normalize-css/normalize.css', 'bower_components/slick-carousel/slick/slick.css', 'bower_components/slick-carousel/slick/slick-theme.css'])
    //return gulp.src([])
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(path.destination.css));
});

/*----------------------------- LAUNCHERS -----------------------------*/

gulp.task('watch', function() {
    gulp.watch(path.watch.html, ['html']);
    gulp.watch(path.watch.js, ['js']);
    gulp.watch(path.watch.scss, ['sass']);
    gulp.watch(path.watch.img, ['img']);
});

gulp.task('default', ['watch', 'html', 'js', 'sass', 'img']);

gulp.task('build', ['clean', 'concatVendorJS', 'concatVendorCSS', 'html', 'js', 'sass', 'img', 'fonts']);



