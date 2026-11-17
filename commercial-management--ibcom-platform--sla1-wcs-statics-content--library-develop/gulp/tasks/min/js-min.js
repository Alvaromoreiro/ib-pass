module.exports = function(gulp, plugins, config) {
    gulp.task('jsmin', function() {
        return gulp.src(config.target.jsminOri)
            .pipe(plugins.uglify().on('error', (e) => {console.log(e);}))
            // .pipe(rename({
            //     suffix: '.min'
            // }))
            .pipe(gulp.dest(config.target.dist.js));
    });
};
