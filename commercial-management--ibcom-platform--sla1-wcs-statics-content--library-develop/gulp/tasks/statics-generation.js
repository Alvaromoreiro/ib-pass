var runSequence = require('run-sequence');
module.exports = function(gulp, plugins, config) {
	
    
	gulp.task('statics-generation', function (done) {

        console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
		console.log("Starting the Statics Generation Process this includes the following steps:");
		console.log("1-. ['jsconcat', 'sass']");
		console.log("2-. ['webpack']");
		console.log("3-. ['staticsCSS', 'staticsJS']");
		console.log("4-. ['htmlmin', 'cssmin', 'jsmin']");
		console.log("5-. ['custom-css-dist', 'custom-js-dist']");
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        /*runSequence(
            'jsconcat',
            'sass',
			'staticsCSS',
			'staticsJS',
			'htmlmin',
			'cssmin',
			'jsmin',
			'cssmin',
            'custom-css-dist',
            'jsmin',
			'custom-js-dist',
            function (error) {
                statusTask(error, 'START STATICS-GENERATION SUCCESSFULLY', done);
            }
        )*/
		runSequence(
			['delete-generated-files'],
      ['jsconcat','js-components'],
			[ 'sass', 'sass-components'],
			['webpack'],
			['statics'],
			['fonts-min'],
			['cssmin','css-components-min'],
			['jsmin', 'js-components-min'],
      ['custom-css-dist', 'custom-js-dist', 'statics-components-min'],
            function (error) {
                statusTask(error, 'Finishing statics-generation succesfully', done);
            }
        )

    });
	gulp.task('statics-generation-dev', function(done) {
		return runSequence(
				['delete-generated-files-dev'],
				['jsconcat','js-components'],
				['sass', 'sass-components'],
				['webpack'],
				['statics'],
							function (error) {
									statusTask(error, 'Finishing statics-generation succesfully', done);
							}
      );
	});

	gulp.task('custom-css-dist', function () {
			return gulp.src(config.target.dist.cssAll)
            .pipe(gulp.dest(config.target.dist.WCScssFolder));
		
    });

	gulp.task('custom-js-dist',function(){
		        return gulp.src(config.target.dist.staticsJSElements)
            .pipe(gulp.dest(config.target.dist.WCSjsFolder));
		
	});
	
	
	
	
	
	/* function changeDirectory(locationPath){	
		try {
		  process.chdir(locationPath);
		}
		catch (err) {
		  console.log('chdir: ' + err + 'Path:'+locationPath);
		}

	}*/
	function statusTask(error, msg, done) {
    if (error) {
        console.log(error.message)
        return process.exit(2)
    } else {
        console.log(msg)
    }
    done();
	}

};
