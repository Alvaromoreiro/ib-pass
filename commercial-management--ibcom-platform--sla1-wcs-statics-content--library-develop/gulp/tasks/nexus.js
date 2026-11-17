const del = require('del');
const deployer = require('web-nexus-deployer');
const fs = require('fs');
const git = require('./git-fn.js');
const unzip = require('unzip');
const runSequence = require('run-sequence');
const tmpRelativetLocation = "./../tmp";
const tmpAbsoluteLocation = "./tmp";
const workingMainDirectoryRelative = "./../wcs-statics";
const workingMainDirectoryAbsolute = "./wcs-statics";
const request	= require('request');
const args = require('yargs').argv;
const confirm = require('inquirer-confirm');


const  getLastCommitId = (version)=>{
	return new Promise ((resolve,reject)=>{
		const options= {
			'url':`https://git.corp.iberia.es/api/v4/projects/221/repository/commits?ref_name=${encodeURIComponent('release/inte/'+version)}`,
			'headers':{'PRIVATE-TOKEN':'hpzCwy1qSBa8kFzpKkzr'}
		};
		request(options,(error,response)=>{
			if(error){
				console.error('No se ha podido obtener el código del último commit');
				reject();
			}else if(response.body){
				let body;
				try {
					body = JSON.parse(response.body);
					if(body[0] && typeof(body[0].id)==='string'){
						resolve(body[0].id);
					}else{
						reject();
					}
				} catch (error) {
					
				}
			}else{
				reject();
			}
		})
	});
}
const deleteFolderRecursive = function(path) {
	if( fs.existsSync(path) ) {
	  fs.readdirSync(path).forEach(function(file,index){
		var curPath = path + "/" + file;
		if(fs.lstatSync(curPath).isDirectory()) { // recurse
		  deleteFolderRecursive(curPath);
		} else { // delete file
		  fs.unlinkSync(curPath);
		}
	  });
	  fs.rmdirSync(path);
	}
  };

const wcsReleaseVersion =()=>{
	return JSON.parse(fs.readFileSync('./wcs-release-version.json', 'utf8'));
}

const changeDirectory = (locationPath)=>{	
	try {
	  process.chdir(locationPath);
	}
	catch (err) {
	  console.log('chdir: ' + err + 'Path:'+locationPath);
	}

}
const statusTask = (error, msg, done)=>{
if (error) {
	console.log(error.message)
	return process.exit(2)
} else {
	console.log(msg)
}
done();
}

const questionFunction = (callback)=>{
	console.log('----------------------------------------------------------------------------');
	console.log('Se ha interrumpido el proceso para permitir que se añadan elementos extra al zip')
	console.log('\tLos elementos que se deseen añadir han de incluirse en el directorio tmp/nexus');
	console.log('Seleccione Y o Yes para continuar');
	
	const question = '¿Se han añadido los ficheros al directorio?'
	confirm(question).then(()=>{callback();})
			.catch(()=>{questionFunction(callback)});

}




module.exports = function(gulp, plugins, config, functions) {
	var directory = config.target.dist.WCSmainmin;
	
	/**
	 * @name prepare-statics-nexus
	 * @param addFiles=true stops proccess to manually add any file to tmp/nexus folder
	 */

	gulp.task('prepare-statics-nexus', function (done) {
        let versionRelease = wcsReleaseVersion()['release-version'];
		let versionRollback = wcsReleaseVersion()['rollback-version'];
        if (!versionRelease || !versionRollback) {
            console.log('Please specify the release and rollback version in wcs-release-version.json');
            process.exit(1)
		}
		const taskSequence = (typeof(args.addFiles)==='string' && args.addFiles.toLowerCase()==='true')?'addFiles':'default';
		const taskToExecute = 
			{default: ['del-temp-dir','create-temp-dir','download-branch','unzip-downloaded-branch','update-deploy-json','move-filesToDeploy-nexus','generate-nexus-zip','nexus-deploy','del-temp-dir'],
			 addFiles: ['del-temp-dir','create-temp-dir','download-branch','unzip-downloaded-branch','update-deploy-json','move-filesToDeploy-nexus','add-Files-Interruption','generate-nexus-zip','nexus-deploy','del-temp-dir']} ; 
		
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
		console.log("Remember this process expect a branch in GIT: release/inte/"+versionRelease);
		console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        runSequence(...taskToExecute[taskSequence],
            function (error) {
                statusTask(error, 'START RELEASE SUCCESSFULLY: ' + versionRelease, done);
            }
        )

    });

	gulp.task('download-branch',function(cb){
		changeDirectory(workingMainDirectoryRelative);
		const version = wcsReleaseVersion()['release-version'];
		changeDirectory(tmpRelativetLocation);
		const file = fs.createWriteStream('wcs_statics-'+version+'.zip'); 
		const options= {
						'url':`https://git.corp.iberia.es/api/v4/projects/221/repository/archive.zip?sha=${encodeURIComponent('release/inte/'+version)}`,
						'headers':{'PRIVATE-TOKEN':'hpzCwy1qSBa8kFzpKkzr'}
					};
		request(options).pipe(file)
			.on('finish',()=>{
				file.close();
				cb();
			}
				)
			.on('error',()=>{
				console.error("Error al descargar archivo");
				changeDirectory("./..");
				process.exit();
			})		
	});
	gulp.task('unzip-downloaded-branch', function(cb){
		changeDirectory(workingMainDirectoryRelative);
		const version = wcsReleaseVersion()['release-version'];
		changeDirectory(tmpRelativetLocation);
		if(fs.existsSync('wcs_statics-'+version+'.zip')){
			const zipfile = fs.createReadStream('wcs_statics-'+version+'.zip');
			zipfile.pipe(unzip.Extract({path:tmpRelativetLocation}))
				.on('close',()=>{
					cb();
				})
				.on('error',()=>{
					console.error("Error al descomprimir fichero");
					changeDirectory("./..");
					process.exit();
				})
		}else{
			console.error("Error al descomprimir fichero - Archivo no existente");
			changeDirectory("./..");
			process.exit();
		}
	});

	gulp.task('update-deploy-json', function (cb){
		changeDirectory(workingMainDirectoryRelative);		
		const deployJson = wcsReleaseVersion();
		changeDirectory(tmpRelativetLocation);
		getLastCommitId(deployJson['release-version'])
		 .then((id)=>{
			 deployJson.lastCommitID=id;
			 if(!fs.existsSync('./nexus')){
				 fs.mkdirSync('./nexus');
			 }
			 fs.writeFileSync('./nexus/wcs-release-version.json',JSON.stringify(deployJson));
			 cb();
		 })
		 .catch(()=>{
			 console.error('No se ha podido actualizar wcs-release-version');
			 process.exit();
		 })
	});	

	gulp.task('move-filesToDeploy-nexus',function(cb){
		changeDirectory(workingMainDirectoryRelative);
		changeDirectory(tmpRelativetLocation+'/nexus');
		try{
			const releaseData = wcsReleaseVersion(); //De la carpeta nexus
			changeDirectory('./..');

			return gulp.src(`./wcs-statics-release-inte-${releaseData['release-version']}-${releaseData['lastCommitID']}/dist/wcs_statics/**`)
					.pipe(gulp.dest('./nexus'));
			

		}catch(error){
			console.error(error);
			process.exit();
		}

	});

	gulp.task('add-Files-Interruption',function(cb){
		questionFunction(cb);
	});

	


	gulp.task('generate-nexus-zip',  function(cb){
		changeDirectory(workingMainDirectoryRelative);
		changeDirectory(tmpRelativetLocation+'/nexus');
		try{
			const releaseData =  wcsReleaseVersion();
			changeDirectory('./..');
			return gulp.src(`./nexus/**`)
						.pipe(plugins.zip(`wcs_statics-${releaseData['release-version']}.zip`))
							.pipe(gulp.dest('./nexus'));
		}catch(error){
			console.error(error)
			console.error('No se ha podido generar el zip');
			process.exit();
		}
		
		
		
	});

	gulp.task('nexus-deploy',  function(cb) {
		changeDirectory(workingMainDirectoryRelative);
		changeDirectory(tmpRelativetLocation+'/nexus');
		const version = wcsReleaseVersion()['release-version'];
		changeDirectory('./..');
        if (version != undefined){
			
			info = config.nexus;
			info.version = version;
			info.artifact = `./nexus/wcs_statics-${version}.zip`;
		}
        deployer.deploy(info, function (err) {
            if (err) {
				console.log(err);
				process.exit()
            }
            cb();
        })
    });


	gulp.task('create-temp-dir',function(cb){
		
		if (!fs.existsSync(tmpRelativetLocation)) {
			fs.mkdirSync(tmpRelativetLocation);
			cb();
        }else{
			console.log('No se ha creado directorio ya que puede existir')
			cb();
		}

	});
	
	gulp.task('del-temp-dir',function(cb){
		changeDirectory('./..')
		deleteFolderRecursive(tmpAbsoluteLocation);
		changeDirectory(workingMainDirectoryAbsolute)
		cb();

	});


};
