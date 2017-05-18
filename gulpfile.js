'use strict';

// required modules
var gulp = require('gulp'),
	git = require('gulp-git'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	scss = require('gulp-sass'),
	less = require('gulp-less'),
	lessPath = require('path'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	imagemin = require('gulp-imagemin'),
	cssbeautify = require('gulp-cssbeautify'),
	gcmq = require('gulp-group-css-media-queries'), // gruop media queries in css
	jsprettify = require('gulp-js-prettify'),
	cleanCSS = require('gulp-clean-css'), // minify css
	uglify = require('gulp-uglify'), // minify js
	pump = require('pump'), // additional to minify js
	babel = require('gulp-babel'), // es6 to es5
	fileinclude = require('gulp-file-include'), // html includes
	connect = require('gulp-connect'), // additional to livereload
	notify = require("gulp-notify");

// functional variables 
var localhostId = '3030';
var mainCss = 'all.css';
var mainJQuery = 'jquery.main.js';
var mainPureJs = 'main.js';
var fontName = 'iconfont';

// project structure
var path = {
	remoteMarkup: 'https://github.com/gladisihor/markup.git',
	root: 'markup/',
	html: 'markup/',
	htmlIncludes: 'markup/includes/*.html',
	scss: 'markup/styles/',
	less: 'markup/less/',
	css: 'markup/css/',
	js: 'markup/js/',
	imagesInput: 'markup/images/**/*.*',
	imagesOutput: 'markup/images/',
	svgFontInput: 'markup/sourceicons/*.svg',
	svgFontOutput: 'markup/fonts/',
	svgFontTemplate: 'markup/sourceicons/template/_icons.css',
	svgFontScssOutput: '../scss/base/_icons.scss',
	svgFontLessOutput: '../less/base/_icons.less',
	svgFontCssPath: '../fonts/',
	watch: {
		html: 'markup/**/*.html',
		htmlIncludes: 'markup/includes/**/*.html',
		js: 'markup/js/**/*.js',
		scssToCss: 'markup/styles/**/*.scss',
		lessToCss: 'markup/less/**/*.less',
		css: 'markup/css/*.css',
		img: 'markup/sourceimages/**/*.*',
		svgFonts: 'markup/sourceicons/**/*.*'
	}
};

// modules' API
var prefApi = {
	browsers: ['last 2 versions', '> 1%',  'ie 10'],
	cascade: false
};
var connectApi = {
	root: 'markup',
	port: localhostId,
	livereload: true
}
var prettifyApi = {
	indent: '	'
};
var fileincludeApi = {
	prefix: '@@',
	basepath: '@file'
};
var iconfontApi = function(less) {
	return {
		fontName: fontName,
		path: path.svgFontTemplate,
		targetPath: less ? path.svgFontLessOutput : path.svgFontScssOutput,
		fontPath: path.svgFontCssPath,
		cssClass: 'icon'
	};
};
var iconGeneratorApi = {
	fontName: fontName,
	formats: ['ttf', 'eot', 'woff', 'woff2', 'svg']
};

// src is the root folder for git to initialize 
gulp.task('git:init', function(){
	git.init(function (err) {
		if (err) throw err;
	});
});
// Clone a remote markup template with all features
gulp.task('deploy', ['git:init'], function(){
	git.clone(path.remoteMarkup, function (err) {
		if (err) throw err;
	});
});

// livereload + connect
gulp.task('connect', function() {
	connect.server(connectApi);
	gulp.src('.')
		.pipe(notify('Localhost port: ' + localhostId));
});

// scss
gulp.task('scss', function () {
	return gulp.src(path.watch.scssToCss)
		.pipe(sourcemaps.init())
		.pipe(scss().on('error', scss.logError))
		.pipe(autoprefixer(prefApi))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.css))
		.pipe(connect.reload());
});

// less
gulp.task('less', function () {
	return gulp.src(path.watch.lessToCss)
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(autoprefixer(prefApi))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.css))
		.pipe(connect.reload());
});

// html
gulp.task('html', function () {
	gulp.src(path.watch.html)
		.pipe(connect.reload());
});

// html includes
gulp.task('fileinclude', function() {
	gulp.src([path.htmlIncludes])
		.pipe(fileinclude(fileincludeApi))
		.pipe(gulp.dest(path.html));
});

// create icon fonts
gulp.task('iconfont', function(){
	gulp.src([path.svgFontInput])
		.pipe(iconfontCss(iconfontApi()))
		.pipe(iconfont(iconGeneratorApi))
		.pipe(gulp.dest(path.svgFontOutput));
});
gulp.task('iconfont:less', function(){
	gulp.src([path.svgFontInput])
		.pipe(iconfontCss(iconfontApi('less')))
		.pipe(iconfont(iconGeneratorApi))
		.pipe(gulp.dest(path.svgFontOutput));
});

// optimize images
gulp.task('optimize', function () {
	return gulp.src(path.imagesInput)
		.pipe(imagemin())
		.pipe(gulp.dest(path.imagesOutput));
});

// prettify css
gulp.task('prettify:css', function () {
	return gulp.src(path.watch.css)
		.pipe(gcmq())
		.pipe(cssbeautify(prettifyApi))
		.pipe(gulp.dest(path.css));
});

// minify css
gulp.task('minify:css', function () {
	return gulp.src(path.css + mainCss)
		.pipe(gcmq())
		.pipe(cleanCSS())
		.pipe(gulp.dest(path.css));
});

// prettify js
gulp.task('prettify:js', function() {
	return gulp.src(path.js + mainJQuery)
		.pipe(jsprettify())
		.pipe(gulp.dest(path.js));
});

// minify js
gulp.task('minify:js', function(cb) {
	pump([
		gulp.src(path.js + mainJQuery),
		uglify(),
		gulp.dest(path.js)], cb);
});

// babel (es6 to es5)
gulp.task('babel', function() {
	return gulp.src(path.js + mainJQuery)
		.pipe(babel({presets: ['es2015']}))
		.pipe(gulp.dest(path.js));
});


// Output combo groups
gulp.task('watch', ['scss'], function() {
	gulp.watch(path.watch.scssToCss, ['scss']);
	gulp.watch(path.watch.html, ['html']);
});

gulp.task('watch:less', ['less'], function() {
	gulp.watch(path.watch.lessToCss, ['less']);
	gulp.watch(path.watch.html, ['html']);
});

gulp.task('watch:includes', ['fileinclude'], function() {
	gulp.watch(path.watch.htmlIncludes, ['fileinclude']);
});

gulp.task('localhost', ['connect', 'watch']);
gulp.task('localhost:includes', ['connect', 'watch', 'watch:includes']);
gulp.task('localhost:less', ['connect', 'watch:less']);
gulp.task('localhost:incless', ['connect', 'watch:less', 'watch:includes']);

gulp.task('default', ['localhost']);

gulp.task('prettify', ['prettify:js', 'prettify:css']);
gulp.task('minify', ['minify:js', 'minify:css']);

gulp.task('dist', ['prettify:css', 'optimize']);
gulp.task('dist:minify', ['minify', 'optimize']);
