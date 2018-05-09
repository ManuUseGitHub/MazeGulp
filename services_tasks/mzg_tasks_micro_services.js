function renameSuffixMin() {
	return (M.rename)({
		suffix: '.min'
	});
}

function cleanCssMinification() {
	return (M.cleanCSS)({
		'compatibility': 'ie8'
	});
}

function insertSignatureAfter(actionDone, thanksToModule) {
	return (M.insert).append("\n/* -- {0} with Gloups {1} | using {2} -- */".format([
        actionDone.replace(/[\s]+$/, ''), GLOUPS_VERSION, thanksToModule
    ]));
}

function autoprefix() {
	return (M.autoprefixer)({
		browsers: AUTOPREFIXER_BROWSERS,
		cascade: false
	});
}