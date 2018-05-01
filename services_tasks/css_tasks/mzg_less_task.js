gulp.task('less', function() {

	// ONLY VARIANT CONFIGURATION FOR COMPRESSION IS IN THIS OBJECT BELOW ... !
	var obj = {

		// says what modules gloups used to provide file compressions
		'module': 'gulp-less',

		// defines what files extension are allowed to be processed
		'rules': [/.*.less$/],

		// the pipe part that will be wrapped for sourcemapping and transitivity (here none)
		'mainPipe': (M.lazyPipe)()
			.pipe(function() {
				return (M.less)({
					paths: [(M.path).join(__dirname, 'less', 'includes')]
				});
			})
			.pipe(autoprefix)
			.pipe((M.stylefmt)),

		// tells how to handle importation within preprocessed/precompiled files
		'realTargetsFunction': function(filePath, matchingEntry) {
			return [filePath];
		}
	};

	// PROCESS WITH THE VARIANT CONFIGURATION
	runTaskProcessForPrecompiledFiles(this, config.pathesToStyleLess, obj);
});