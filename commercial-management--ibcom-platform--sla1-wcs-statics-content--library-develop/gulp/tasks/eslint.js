module.exports = function(gulp, plugins, config, reporter, fs,  functions) {
	gulp.task('eslint', function () {
		// Create reports directory if it doesn't already exist
		if (!fs.existsSync(config.reports)) {
			fs.mkdirSync(config.reports);
		}
		// Create lint reports directory if it doesn't already exist
		if (!fs.existsSync(config.lintReports)) {
			fs.mkdirSync(config.lintReports);
		}
		// Create checkstyle.xml lint report output
		var output = fs.createWriteStream(config.lintReports + 'checkstyle.xml');

		return gulp.src(['dev/js/components/*.js','!node_modules/**'])
		// Tell the eslint plugin where to look for the rules
			.pipe(plugins.eslint({
				rulePaths: ['gulp/config/lint/'],
				configFile: 'gulp/config/lint/.eslintrc',
				globals: [
					'jQuery',
					'$'
				],
			}))
			// .pipe(plugins.eslint.format())
			// // To have the process exit with an error code (1) on
			// // lint error, return the stream and pipe to failAfterError last.
			// .pipe(plugins.eslint.failAfterError());
			// Run eslint and return the results to the console screen
			.pipe(plugins.eslint.format())
			// Run eslint and put the results into the checkstyle.xml created above
			.pipe(plugins.eslint.format('checkstyle', output))
			// Run eslint, format the report into html file and export to lint reports directory
			.pipe(plugins.eslint.format(reporter, function (results) {
					fs.writeFileSync(config.lintReports + 'report-results.html', results);
				})
			);
	});
};
