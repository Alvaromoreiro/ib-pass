var main = 'dev/',
	dist = 'dist/';

module.exports = {
	tasks: './gulp/tasks',
	buildTask: './gulp/tasks/build',
	minTask: './gulp/tasks/min',
	otherTasks: './gulp/tasks/other',
	screenFolder: './gulp/screenshots',
	main: main,
	dist: dist,
	WCSmain: 'dev/wcs_statics/',
	reports: 'reports/',
	lintReports: 'reports/lint/',
	nexus: {
		groupId: 'com.ib.front',
		artifactId: 'wcs-statics',
		packaging: 'zip',
		auth: {
			username: 'jmontero',
			password: 'EVERIS.jmontero'
		},
		pomDir:'./tmp/pom',
		url: 'http://nexus.corp.iberia.es/repository/releases',
		quiet: true,
		insecure: true
	},
	statics: {
		'repository': 'git@git.corp.iberia.es:ib-web/wcs-statics.git'
	},
	target: {
		pug: [main + 'pug/*.pug','!pug/ibe-components'],
		pugWatch: [main + 'pug/**/*.pug','!pug/ibe-components'],
		pugFolder: main + 'pug/',
		pugComponents: main + 'pug/ibe-components/**/*.pug',
		html: main + '*.html',
		sass: main + 'scss/*.scss',
		sassWatch: main + 'scss/**/*.scss',
		sassComponents: main + 'scss/ibe-components/*.scss',
		css: ['!dev/css/fonts/icons/**/*', main + 'css/**/*.css'],
		fontsFiles: ['!dev/css/fonts/icons/**/*', main + 'css/fonts/**/'],
		cssAll: main + 'css/**/*',
		cssFolder: main + 'css/',
		cssComponentsFolder: main + 'ibe-components/**/*.css',
		componentsFolder: main + 'ibe-components/',
		js: ['!dev/js/components/**/*', '!dev/js/dev/**/*', '!dev/js/lib/**/*', main + 'js/**/*.js'],
		jsComponentsFolder: main + 'ibe-components/**/*.js',
		img: main + 'images/**/*',
		bower: main + 'bower_components/**/*',
		cloudFolder: 'C:/Users/x/Dropbox/Public/pruebas',
		WCScssFolder: main + 'wcs_statics/css/',
		WCSjsFolder: main + 'wcs_statics/js/',
		WCSimgFolder: main + 'wcs_statics/images/',
		WCScomponentsFolder: main + 'wcs_statics/ibe-components/',
		WCSfontsFolder: main + 'wcs_statics/css/fonts/',
		staticsJSElements: ['./dev/js/inte-modules/build/**/','./dev/js/front-build/**/','./dev/js/inte-legacy-build/**/'],
		jsminOri: ['!dev/js/components/**/*', '!dev/js/ibe-components/**/*' , '!dev/js/inte-modules/*.js', '!dev/js/inte-modules/ibe-modules/**/*.js', '!dev/js/dev/**/*', '!dev/js/lib/**/*', main + 'js/**/*.js'],
		compiledFilesFolders:['dev/js/inte-modules/build/**', 'dev/wcs_statics/**', 'dist/css/**', 'dist/js**', 'dist/wcs_statics/**', 'dist/ibe-components/**'],
		compiledFilesFoldersDev:['dev/js/inte-modules/build/**', 'dev/wcs_statics/**'],
		dist: {
			html: dist + '*.html',
			css: dist + 'css/',
			cssAll: dist + 'css/**/*',
			fontsFolder: dist + 'css/fonts/',
			componentsFolder: dist + 'ibe-components/',
			js: dist + 'js/',
			staticsJSElements: ['./dist/js/inte-modules/build/**/','./dist/js/front-build/**/','./dist/js/inte-legacy-build/**/'],
			img: dist + 'images/',
			bower: dist + 'bower_components/',
			WCSmainmin: dist + 'wcs_statics/',
			WCScssFolder: dist + 'wcs_statics/css/',
			WCSjsFolder: dist + 'wcs_statics/js/',
			WCSimgFolder: dist + 'wcs_statics/images/',
			WCScomponentsFolder: dist + 'wcs_statics/ibe-components/',
			WCSfontsFolder: dist + 'wcs_statics/css/fonts/'
		}
	}
};
