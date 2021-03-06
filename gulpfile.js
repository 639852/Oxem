// function defaultTask(cb) {
//   // place code for your default task here
//   cb();
// }

// exports.default = defaultTask

let project_folder = require("path").basename(__dirname);
let source_folder = "src";
let fs = require('fs');
let path = {
	build: {
		html: project_folder + "/",
		css: project_folder + "/css/",
		js: project_folder + "/js/",
		img: project_folder + "/img/",
		fonts: project_folder + "/fonts/",
	},
	src: {
		html: source_folder + "/[^_]*.html",
		css: source_folder + "/scss/[^_]*.scss",
		js: source_folder + "/js/[^_]*.js",
		img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp|mp4)",
		fonts: source_folder + "/fonts/*.+(ttf|svg)",
	},
	watch: {
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		js: source_folder + "/js/**/*.js",
		img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp|mp4)",
	},
	clean: "./" + project_folder + "/"
}

let {src, dest} = require('gulp'),
	gulp = require('gulp'),
	browsersync = require('browser-sync').create(),
	fileinclude = require('gulp-file-include'),
	del = require('del'),
	scss = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	mediaqueries = require('gulp-group-css-media-queries'),
	cleancss = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify-es').default,
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	webphtml = require('gulp-webp-html'),
	webpcss = require('gulp-webpcss'),
	// svgsprite = require('gulp-svg-sprite'),
	ttf2woff = require('gulp-ttf2woff'),
	ttf2woff2 = require('gulp-ttf2woff2'),
	fonter = require('gulp-fonter');


function browserSync(argument) {
	browsersync.init({
		server: {
			baseDir: "./" + project_folder + "/"
		},
		port: 3000,
		notify: false
	})
}

function html(argument) {
	return src(path.src.html)
		.pipe(fileinclude())
		.pipe(webphtml())
		.pipe(dest(path.build.html))
		.pipe(browsersync.stream())
}

function css(argument) {
	return src(path.src.css)
		.pipe(
			scss({
				outputStyle: "expanded"
			})
		)
		.pipe(
			autoprefixer({
				grid: true,
				overrideBrowserslist: ["last 5 version"],
				cascade: true
			})
		)
		.pipe(mediaqueries())
		.pipe(
			webpcss({
				webpClass: '.webp',
				noWebpClass: '.no-webp'
			})
		)
		.pipe(dest(path.build.css))
		.pipe(cleancss())
		.pipe(
			rename({
				extname: ".min.css"
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browsersync.stream())
}

function js(argument) {
	return src(path.src.js)
		.pipe(fileinclude())
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: ".min.js"
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browsersync.stream())
}

function img(argument) {
	return src(path.src.img)
		.pipe(
			webp({
				quality: 70
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				interlaced: true,
			    progressive: true,
			    optimizationLevel: 4,
			    svgoPlugins: [{removeViewBox: false}]
			})
		)
		.pipe(dest(path.build.img))
		.pipe(browsersync.stream())
}

function fonts(argument) {
	src(path.src.fonts)
	.pipe(ttf2woff())
	.pipe(dest(path.build.fonts));
	return src(path.src.fonts)
		.pipe(ttf2woff2())
		.pipe(dest(path.build.fonts))
}

gulp.task('otf2ttf', function() {
	return src([source_folder + "/fonts/*.otf"])
	.pipe(fonter({
		formats: ['ttf']
	}))
	.pipe(dest(source_folder + "/fonts/"));
})

function fontsStyle(argument) {
	let file_content = fs.readFileSync(source_folder + '/scss/_fonts.scss');
	if (file_content == '') {
		fs.writeFile(source_folder + '/scss/_fonts.scss', '', cb);
		return fs.readdir(path.build.fonts, function (err, items) {
			if (items) {
				let c_fontname;
				for (var i = 0; i < items.length; i++) {
					let fontname = items[i].split('.');
					fontname = fontname[0];
					if (c_fontname != fontname) {
						fs.appendFile(source_folder + '/scss/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
					}
					c_fontname = fontname;
				}
			}
		})
	}
}
function cb() { }

function watchFiles(argument) {
	gulp.watch([path.watch.html], html);
	gulp.watch([path.watch.css], css);
	gulp.watch([path.watch.js], js);
	gulp.watch([path.watch.img], img);
}

function clean(argument) {
	return del(path.clean)
}

let build = gulp.series(clean, gulp.parallel(html, css, js, img, fonts), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.img = img;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;