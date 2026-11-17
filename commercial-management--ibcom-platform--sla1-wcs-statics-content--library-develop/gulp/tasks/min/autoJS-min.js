module.exports = (gulp, plugins, config)=>{
    gulp.task('autoJSmin',()=>{
        console.log(`[${new Date().toLocaleTimeString()}] Establecido escuchador de cambios js en ./dev/js`)
        gulp.watch(config.target.js,(el)=>{
            let path = el.path;
            let fileName = path.substring(path.lastIndexOf('\\')+1);
            console.log(`[${new Date().toLocaleTimeString()}] Cambio detectado en ${fileName}`);
            gulp.src('./dev/js/'+fileName).pipe(gulp.dest(config.target.WCSjsFolder));
            gulp.src('./dev/js/'+fileName).pipe(plugins.uglify())
                       .pipe(gulp.dest(config.target.dist.js))
                        .pipe(gulp.dest(config.target.dist.WCSjsFolder));


            console.log(`[${new Date().toLocaleTimeString()}] Minificado archivo ${fileName}`);
        })
    })
}