//Подклячаем модули с package.js
const gulp = require('gulp');   //Модуль Gulp cli
const browserSync = require('browser-sync');    //Для автоматического бновления браузера
const autoprefixer = require('gulp-autoprefixer');  //Подставляет префикси в CSS для поддержки браузеров
const cheerio = require('gulp-cheerio');
const cleanCSS = require('gulp-clean-css'); //Минифицырует CSS
const concat = require('gulp-concat');  //Соидиняет файлы в один файл в заданой последовательности
const replace = require('gulp-replace');    //Замена строки
const svgSprite = require('gulp-svg-sprite'); // Для создания SVG-спрайта
const svgMin = require('gulp-svgmin'); //Минифицырует SVG файлы
const uglify = require('gulp-uglify');  //Минифицырует JS файлы
const watch = require('gulp-watch');    //Отслежует изменения в рабочей директории проэкта
const rimraf = require('rimraf');   //Удаляет папку
const reload = browserSync.reload;  //Перезагрузка сервера (Обновление)
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
];
const browserslist = [
    "last 2 version",
    "> 1%",
    "IE 10"
];
const path = {  //Создаем обьект путей
    src: {
        fonts: './src/fonts/**/*.*',
        img: ['./src/img/**/*.jpg', './src/img/**/*.png'],
        svg: './src/img/**/*.svg',
        js: './src/js/main.js',
        html: './src/index.html',
        css: cssFiles
    },
    build: {
        fonts: './build/fonts/',
        img: './build/img/',
        svg: './build/img/svg/',
        js: './build/js/',
        html: './build/',
        css: './build/css/'
    },
    watch:{
        fonts: './src/fonts/**/*.*',
        img:  ['./src/img/**/*.jpg', './src/img/**/*.png'],
        svg: './src/img/**/*.svg',
        js: '.src/js/main.js',
        html: './src/index.html',
        css: cssFiles
    },
    del: './build'
};

//Удаляем папку build
gulp.task('del', (cb) => {
    return rimraf(path.del, cb)
});

gulp.task('webServer', () => {
    browserSync.init({
        server: {
            baseDir: "./build"
        },
        host: 'localhost',
        port: 1979,
        tunel: false
    })
});

gulp.task('htmlBuild', () =>{
    return gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('styleBuild', () => {
    return gulp.src(path.src.css)
        .pipe(concat('style.css'))
        .pipe(autoprefixer({
                overrideBrowserslist: browserslist,
                cascade: false
            }
        ))
        .pipe(cleanCSS({level: 2}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('imgBuild', () => {
    return gulp.src(path.src.img)
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('svgBuild', () => {
    return gulp.src(path.src.svg)
        .pipe(svgMin())
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                    }
                }
            }
        ))
        .pipe(gulp.dest(path.build.svg))
        .pipe(reload({stream: true}));
});

gulp.task('jsBuild', () => {
    return gulp.src(path.src.js)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('fontsBuild', () => {
    return gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}));
});

gulp.task('watchFiles', () => {
    gulp.watch(path.watch.css, gulp.series('styleBuild'));
    gulp.watch(path.watch.html, gulp.series('htmlBuild'));
    gulp.watch(path.watch.img, gulp.series('imgBuild'));
    gulp.watch(path.watch.svg, gulp.series('svgBuild'));
    gulp.watch(path.watch.js, gulp.series('jsBuild'));
    gulp.watch(path.watch.fonts, gulp.series('fontsBuild'));
});

gulp.task('build', gulp.series('htmlBuild', 'styleBuild', 'imgBuild', 'svgBuild', 'jsBuild', 'fontsBuild'));

gulp.task('default', gulp.parallel('build', 'watchFiles', 'webServer'));