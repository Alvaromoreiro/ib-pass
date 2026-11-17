module.exports = function(gulp, plugins, config) {
    gulp.task('serve', function() {
        //inicia servidor
        plugins.browserSync.init({
            server: config.main,
            port: "8000",
            ghostMode: false,
            baseDir: config.main,
            directory: true,
			ui: {
				port: 8080,
				weinre: {
					port: 9090
				}
			},
			reloadOnRestart: false
        });
    });
};
