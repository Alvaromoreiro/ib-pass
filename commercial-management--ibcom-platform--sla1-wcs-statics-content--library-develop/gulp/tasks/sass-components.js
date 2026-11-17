module.exports = function(gulp, plugins, config, functions) {
    gulp.task('sass-components', function(e) {
        return gulp.src(config.target.sassComponents)
            .pipe(plugins.plumber({ errorHandler: function(err){
                    return functions.errorHandler(gulp, plugins, config, err, this);
                }
            }))
			.pipe(plugins.changed(config.target.componentsFolder))
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.sass())
            // .pipe(plugins.autoprefixer({
            //     browsers: ['last 3 versions'],
            //     cascade: false
            // }))
            //.pipe(plugins.pixrem()) Descomentar para poder utilizar rem con ie8
            .pipe(plugins.sourcemaps.write())
			.pipe(plugins.rename(function (path) {
				path.dirname = path.basename;
			}))
            .pipe(gulp.dest(config.target.componentsFolder))
			// .pipe(gulp.dest(config.target.cssComponentsFolder + (plugins.name).replace(plugins.name.substr(0,plugins.name.length - 4))))
            .pipe(plugins.browserSync.stream());
    });
};
