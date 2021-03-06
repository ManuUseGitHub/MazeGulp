function breath() {
	return '           ';
}

function logFilePath(filePath) {
	return "'{0}'".format([chalk.cyan(filePath)]);
}

/**
 * @function
 * opens a tream on the help.md file and read all lines to the end. It will outpout the content
 * formated with colors to make more sens to the commun user.
 */
function logHelp() {
	var _data = (M.fs).readFileSync("help.md", "utf8");
	var reading = new classReading();
	reading.initialize(_data, 0);
	var match, line;

	var cpt = 0;

	console.log("\n\n");
	reading.readLines(function() {
		line = reading.line.replace(/\r?\n|\r/g, '');

		// reading the help.md file [MARKDOWN]
		// Titles are cyan
		if ((match = /^([\s]*[#]+.*)$/.exec(line))) {
			console.log(chalk.cyan(match[1]));

			// commands explanations see $ gulp helpMe +[void]+ effects ...
		} else if ((match = /^([\s]*)([$](?:[\s][^\s]+)+)([\s]{2,}.*|.*)$/.exec(line))) {
			console.log("{0}{1}{2}".format([chalk.grey(match[1]), match[2], chalk.green(match[3])]));

			// Commentq are green
		} else if ((match = /^([\s]*[>].*)$/.exec(line))) {
			console.log(chalk.green(match[1]));

			// Alternation between extensions (magenta) and regular text (grey) ... (2 extensions)
		} else if ((match = /^([\s]*)([\-]+[^\s,]+)([^\-.]*)((?:[\s][\-]+[^\s]+)+)([^\-.]*)((?:[.][^.\s]+)+|)([^\-.]*)((?:[.][^.\s]+)+|)(.*)$/.exec(line))) {
			console.log("{0}{1}{2}{3}{4}{5}{6}{7}{8}".format([chalk.grey(match[1]), match[2], chalk.grey(match[3]), match[4], chalk.grey(match[5]), chalk.magenta(match[6]), chalk.grey(match[7]), chalk.magenta(match[8]), chalk.grey(match[9])]));

			// Alternation between extensions (magenta) and regular text (grey) ... (1 extension)
		} else if ((match = /^([^\-]*)((?:[\-]+[^\s]+[\s]?)+)([\s]?.*)$/.exec(line))) {
			console.log("{0}{1}{2}".format([chalk.grey(match[1]), match[2], chalk.grey(match[3])]));

			// Reguar text are grey
		} else if (line.length > 0) {
			console.log(chalk.grey(line));

			// when two wite line are count, the dev wanted to put a real line feed
		} else if (++cpt % 3 == 2) {
			console.log(line);
		}

		/* Each time a line is not blank (no length), count it as a real line because the reading 
		process reeds line feeds as a lines which is not excpected*/
		if (line.length > 0) {
			cpt = 0;
		}
	});
}

/**
 * @deprecated not realy used right now
 * 
 * @function
 * Logs the error list obtained from the parameter in red
 * 
 * @param  {array[String]}
 */
function logErrorsOnTaskArgvs(errors) {
	if (errors.length > 0) {
		console.log("{0}\n{1}\n{2}\n{3}".format(chalk.red(errors.join('\n'))), [
            "WARNING \n\nYou may have made mistakes in shoosing wrong options.",
            "call the folowing command to have more info of what options are valid",
            "gulp --help"
        ]);
	}
}

function logProjectErrored(project) {
	// terminalCols
	gloupslog(" {0}  - SOMETHING IS WRONG \n".format([chalk.bgRed(' ' + project.project + ' ')]));
	gloupslog(" {0} {1}\n".format([logFilePath(project.path + '/config.mzg.json'), chalk.red(': MISMATCH')]));

	console.log(
		(getColoredParagraph(" The path to that folder does not match to an actual project root folder containing a config.mzg.json file.", chalk.bgRed)) +
		("\n\n {0}\n".format([chalk.bgWhite.black(' SOLUTION ')])) +
		('\n' + getColoredParagraph(" ", chalk.bgWhite.grey)) +
		(getColoredParagraph(" Check the path to see if there is no mistake and fix it in the project definition.", chalk.bgWhite.grey)) +
		('\n' + getColoredParagraph(" ", chalk.bgWhite.grey)) +
		(getColoredParagraph(" You can otherwise run the command to set up a configuration file at this path and also create nonexistent folders :", chalk.bgWhite.grey)) +
		('\n' + getColoredParagraph(" $ gulp scanProjects", chalk.bgWhite.black)) +
		(getColoredParagraph(" ", chalk.bgWhite.grey))
	);
}

function logStuffedSpaceOverflowing(message, alignement, chalkColor = null) {
	var deff = getStuffingObj();

	var lines = [];
	var line = [];
	var cpt = 0;
	var padding = deff.trailing_space_count + deff.leading_space_count;
	var max = process.stdout.columns - padding;

	do {
		if (cpt + 1 == message.length || line.length + padding > max) {

			// add the last char when it is not a return character
			if (cpt + 1 == message.length && message[cpt] != "\n"){
				line.push(message[cpt]);
			}

			var stuffObj = getStuffingObj();
			stuffObj.messages = line.join('');
			stuffObj.align = alignement;

			if (chalkColor)
				lines.push((chalkColor)(logStuffedSpaceMessageCore(stuffObj)));
			else
				lines.push(logStuffedSpaceMessageCore(stuffObj));
			
			// empty the line
			line = [];
			
			if(message[0] == " "){
				line.push(" "); 
			}

			// push the firt character of the new line else it disappear ...
			line.push(message[cpt]);

		} else {
			if (message[cpt] == "\n") {
				var left = max - line.length-1;
				var arr = " ".repeat(left).split(' ');
				
				arr.forEach(function(e){
					line.push(" ");	
				});
			} else {
				line.push(message[cpt]);
			}
		}
	}
	while (cpt++ < message.length);

	return lines.join('\n' + (0 < deff.leading_space_count ? ' '.repeat(deff.leading_space_count) : ''));

}

function logStuffedSpaceMessage(message, alignement) {

	var stuffObj = getStuffingObj();
	stuffObj.messages = message;
	stuffObj.align = alignement;

	return logStuffedSpaceMessageCore(stuffObj);
}

function logStuffedSpaceMessageCore(stuffObj) {

	var l = process.stdout.columns;

	normalizeStuffMessages(stuffObj);

	for (var i = 0, t = stuffObj.messages.length; i < t; ++i) {
		l -= stuffObj.messages[i].length;
	}

	l -= stuffObj.leading_space_count;
	l -= stuffObj.trailing_space_count;

	if (stuffObj.messages.length == 1) {
		return getSingleMessageStuffedSapceAligned(stuffObj, l);
	}
}

function getSingleMessageStuffedSapceAligned(stuffObj = getStuffingObj(), l) {
	//

	if (!stuffObj.align || !align().existingPosition(stuffObj.align)) {
		return stuffObj.messages[0];

	} else if (stuffObj.align) {
		if (stuffObj.align == align().left) {
			return stuffObj.messages[0] + " ".repeat(l);

		} else if (stuffObj.align == align().right) {
			return " ".repeat(l) + stuffObj.messages[0];

		} else if (stuffObj.align == align().center) {
			var hl = l / 2;
			var tl = l - hl;

			var r = (process.stdout.columns - l) % 2;
			return " ".repeat(hl) + stuffObj.messages[0] + " ".repeat(tl + r);

		}
	}
}

function getColoredParagraph(paragraph, chalkColor) {
	var tc = process.stdout.columns;
	return chalkColor(paragraph + Array(tc - paragraph.length % tc).join(' '));
}

function logProcessCompleteOnFile(files, realAction, process) {
	try {
		// run the process treatment
		var dStart = new Date();
		process();

		// logging the time elapsed
		var dResult = ms2Time(new Date() - dStart);

		if (files.length > 1) {
			console.log(forNowShortLog("{0} of these files:\n".format([realAction])));
			files.forEach(function(file) {
				console.log(logFilePath(file));
			});
			console.log();
			console.log(forNowShortLog("after {0}".format([chalk.magenta(dResult)])));
		} else {
			console.log(forNowShortLog("{0} {1} after {2}".format([logFilePath(files), realAction, chalk.magenta(dResult)])));
		}

	} catch (err) {

		//logging eventual errors
		console.log(chalk.red(err));
	}
}

function ms2Time(ms) {
	//https://stackoverflow.com/questions/1210701/compute-elapsed-time#16344621
	var secs, minutes, hours;

	hours =
		Math.floor((minutes = Math.floor((secs = Math.floor(((ms = Math.floor(ms % 1000)) / 1000) % 60)) % 60)) % 24);

	return [(hours ? hours + "h " : ""), (minutes ? minutes + "min " : ""), (secs ? secs + "sec " : ""), ms, "ms"].join("");
}

function dateComputed() {
	var date = new Date();

	var days = ["Mon", "Tues", "Wednes", "Thurth", "Fri", "Satur", "Sun"];
	return [days[date.getDay() - 1], "day,", [date.getMonth() + 1, date.getDate(), date.getFullYear()].join("-")].join("");
}

function twodigits(num) {
	return ("0" + num).slice(-2)
}

function shortDateComputed() {
	var date = new Date();

	return [twodigits(date.getMonth() + 1), twodigits(date.getDate()), date.getFullYear()].join("-");
}

function timeComputed() {
	var date = new Date();

	return [date.getHours(), date.getMinutes(), date.getSeconds()].join(":");
}

function forNowLongLog(fmt, messageComponents) {
	return "[{0}] {1}".format([chalk.gray(dateComputed()), fmt.format(messageComponents)]);
}

function forNowShortLog(fmt, messageComponents) {
	var transformed = fmt.format(messageComponents);
	return "[{0}] {1}".format([chalk.gray(timeComputed()), transformed]);
}

function logServiceActivatedPushed(purpose, projectName, addon) {
	if (config.verbose) {
		var match;

		if ((match = /^([^.]+)([.][^\s]*)([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose))) {
			console.log("{0}{1}{2}{3}{4}".format([chalk.grey(match[1]), chalk.magenta(match[2]), chalk.grey(match[3]), chalk.magenta(match[4]), chalk.grey(match[5])]));

		} else if ((match = /^([^.]+)([.][^\s]*)([^.]+)$/.exec(purpose))) {
			console.log("{0}{1}{2}".format([chalk.grey(match[1]), chalk.magenta(match[2]), chalk.grey(match[3])]));
		}

		console.log(" Watch :'{0}{1}'\n Dest. :'{2}{3}'".format([
            chalk.bgCyan(' ' + projectName + ' '), chalk.cyan('/' + addon.watch + ' '),
            chalk.bgCyan(' ' + projectName + ' '), chalk.cyan('/' + addon.dest + ' ')
        ]));

		var sourcemaps = addon.sourcemaps;
		if (sourcemaps !== undefined) {
			console.log(sourcemaps ? '         ' + chalk.bgGreen(" Sourcemaps ! ") : '');
		}
	}
}

/**
 * @function
 * Log what the task is designed for. to get the task name refere to RUNTASK section.
 * However the taskName can be obtained via "this.curentTask". After the name is got, 
 * this function will check a dictionnary and provide definitions regarding the key 
 * wich is te name obtained.
 * 
 * @see gulp.Gulp.prototype.__runTask ~ supports/mzg_runtask.js
 * @param  {string}
 */
function logTaskPurpose(taskName) {
	logTaskName(taskName);
	var tasks = {
		"setVars": "" +
			"  Sets configuration variables \n" +
			'  See the mapping file to set Gloups able to serve your projects here :\n' +
			'  > ' + logFilePath('custom/config.mzg.ini') + ':\n',
		"automin": "" +
			"  Will uglify .js files matching the folowing path(s):\n",
		"typescript": "" +
			"  Will compile .ts files matching the folowing path(s):\n",
		"coffeescript": "" +
			"  Will compile .coffee files matching the folowing path(s):\n",
		"autominCss": "" +
			"  Will compress .css files matching the folowing path(s):\n",
		"less": "" +
			"  Will process .less files matching the folowing path(s):\n",
		"sass": "" +
			"  Will process .sass files matching the folowing path(s):\n",
		"stylus": "" +
			"  Will process .styl files matching the folowing path(s):\n",
		"scanProjects": "" +
			"  Creates configuration file in every project root folder\n"
	};


	if (tasks[taskName]) {
		console.log(tasks[taskName]);
		logWatchList(taskName);
	} else {
		console.log(chalk.yellow("  no information provided \n"));
	}
}

function logWatchList(taskName) {

	var associations = {
		"automin": config.pathesToJs,
		"typescript": config.pathesToTs,
		"coffeescript": config.pathesToCoffee,
		"autominCss": config.pathesToStyle,
		"less": config.pathesToStyleLess,
		"sass": config.pathesToSass,
		"stylus": config.pathesToStylus
	};

	if (associations[taskName]) {
		var wl = watchListLight(associations[taskName]);

		wl.forEach(function(p, i) {
			console.log("    '{0}{1}'".format([chalk.bgCyan(' ' + p.project), chalk.cyan(p.watch + ' ')]));
		});
		console.log();
	}
}

function logTaskName(taskName) {
	console.log("\n {0}{1}\n".format(
        [chalk.bgWhite.black(' T:'), chalk.bgWhite.black(taskName + ' ')]
	));
}

function logTaskEndUgly(one_time) {
	console.log("      > which is uglyfied " + chalk.red("for performances"));
	if (one_time) {
		console.log("  once: " + chalk.red("not watching specific files") + "\n");
	} else {
		console.log();
	}
}

function logTaskEndBeauty(one_time) {
	console.log("      > which is beautifull " + chalk.red("for debugging") + "\n");
	if (one_time) {
		console.log("  once: " + chalk.red("not watching specific files") + "\n");
	} else {
		console.log();
	}
}

function gloupsHandlingPulseLogging(logObj) {

	// action string left and right trimed
	var action = logObj.action.replace(/^[\s]+/, '').replace(/[\s]+$/, '');

	var path = logObj.path;

	// adding a new action heading
	if (!glob_logging_obj[action]) {
		glob_logging_obj[action] = {};
	}

	// pushing the current file matching the heading
	if (!glob_logging_obj[action][path.replace(/'/, '')]) {
		glob_logging_obj[action][path.replace(/'/, '')] = true;
	}
}

function gloupslogSumerise() {

	Object.keys(glob_logging_obj).forEach(function(e, i) {

		if (i > 0) {
			logOrig('\n');
		}

		var filesAsList = Object.keys(glob_logging_obj[e]);

		// printing action heading
		logOrig(' Files labeled {0} ({1})\n'.format([
			chalk.bgRed(' ' + e + ' '),
			filesAsList.length
		]));

		// printing files matching the action heading
		filesAsList.sort(function(a, b) {
			return a.localeCompare(b);
		}).forEach(function(element, index) {
			logOrig(' ' + element);
		});
	});
}

function normalizeStuffMessages(stuffObj) {
	var messageIsArray = Array.isArray(stuffObj.messages);
	if (!messageIsArray) {
		stuffObj.messages = [stuffObj.messages];
	}
}

function getStuffingObj() {
	return {
		messages: ["Hello world"],
		leading_space_count: 1,
		trailing_space_count: 1,
		h_align: align().left
	};
}

function align() {
	return {
		right: "right",
		left: "left",
		center: "center",
		existingPosition: function(alignement) {
			return (
				alignement == this.right ? true :
				alignement == this.left ? true :
				alignement == this.center ? true :
				false
			);
		}
	}
}