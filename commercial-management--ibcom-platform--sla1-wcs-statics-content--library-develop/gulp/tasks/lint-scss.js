module.exports = function(gulp, plugins, scsslint, config, functions) {
	gulp.task('lint-scss', function () {
		// Create reports directory if it doesn't already exist
		return gulp.src('dev/scss/modules/*.scss')
			.pipe(plugins.cached('scsslint'))
			.pipe(scsslint({
				'config': 'gulp/config/scss-lint/lint.yml',
				'maxBuffer': 30000000000000000000 * 1024,
				// 'colorizeOutput': true
				// 'reporterOutput': 'scssReport.json',
				// 'reporterOutputFormat': 'Checkstyle',
				// 'filePipeOutput': 'scssReport.xml'
			}))
			// .pipe(gulp.dest('./reports/lint-scss'))
	});
};
