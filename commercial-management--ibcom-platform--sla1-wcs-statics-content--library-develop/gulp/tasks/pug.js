module.exports = function (gulp, plugins, config, functions) {
	gulp.task('pug', function () {
		return gulp.src(config.target.pugWatch)
			.pipe(plugins.plumber({
				errorHandler: function (err) {
					return functions.errorHandler(gulp, plugins, config, err, this);
				}
			}))

			//coge solo el main y sus partials que han sido cambiados
			.pipe(plugins.changed(config.target.pugFolder, {extension: '.html'}))

			//cachea el contenido y el archivo
			// .pipe(gulpif(global.isWatching, cached('pug')))
			.pipe(plugins.cached('pug'))

			//encuentra los ficheros que depende de los que han sido cambiados
			.pipe(plugins.pugInheritance({basedir: config.target.pugFolder}))

			//filtra carpetas y archivos con guion bajo para no compilarlos
			.pipe(plugins.filter(function (file) {
				return !/\/_/.test(file.path) && !/^_/.test(file.relative);
			}))

			//compila el pug
			.pipe(plugins.pug({pretty: true}))
			.pipe(gulp.dest(config.main))
			.pipe(plugins.browserSync.stream());
	});
};
