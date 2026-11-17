module.exports = function(gulp, plugins, config) {
    gulp.task('cachePug', function() {
        return gulp.src(config.target.pugWatch)
            //cachea el contenido y el archivo
            .pipe(plugins.cached('pug'));
    });
};
