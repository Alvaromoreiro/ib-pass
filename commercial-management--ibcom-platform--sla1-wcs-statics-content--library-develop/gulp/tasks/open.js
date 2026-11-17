/*-------------------------------------------------
   #Iberia-WCS - sonar.js
--------------------------------------------------*/

module.exports = function (gulp, plugins) {
	gulp.task('openSonar', function () {
		var options = {
			uri: 'http://localhost:9000',
			app: 'chrome'
		};
		gulp.src(__filename)
			.pipe(plugins.open(options));
	});
};
