module.exports = function (gulp, plugins, config, functions) {
	gulp.task('pug-components', function () {
		return gulp.src(config.target.pugComponents)
			.pipe(plugins.plumber({
				errorHandler: function (err) {
					return functions.errorHandler(gulp, plugins, config, err, this);
				}
			}))
			//cachea el contenido y el archivo
			// .pipe(gulpif(global.isWatching, cached('pug')))
			.pipe(plugins.cached('pug'))

			//filtra carpetas y archivos con guion bajo para no compilarlos
			.pipe(plugins.filter(function (file) {
				return !/\/_/.test(file.path) && !/^_/.test(file.relative);
			}))

			//compila el pug
			.pipe(plugins.pug({pretty: true}))
			.pipe(plugins.rename(function (path) {
				path.dirname = path.basename;
				console.log(path)
			}))
			.pipe(gulp.dest(config.target.componentsFolder))
			.pipe(plugins.browserSync.stream());
	});
};
