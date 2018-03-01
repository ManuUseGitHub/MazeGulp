var argv=require("yargs").argv,chalk=require("chalk"),cleanCSS=require("gulp-clean-css"),coffee=require("gulp-coffee"),concat=require("gulp-concat"),copy=require("gulp-copy"),del=require("del"),fs=require("fs"),fssync=require("fs-sync"),glob=require("glob"),gulp=require("gulp"),gutil=require("gulp-util"),jshint=require("gulp-jshint"),jsValidate=require("gulp-jsvalidate"),less=require("gulp-less"),nop=require("gulp-nop"),path=require("path"),rename=require("gulp-rename"),runSequence=require("run-sequence"),sass=require("gulp-sass"),ts=require("gulp-typescript"),uglify=require("gulp-uglify"),wait=require("gulp-wait"),config=getConfig(),services={w:"wars",wars:"removeWarVersion",d:"del",del:"autodel",mj:"minjs",minjs:"automin",ts:"typescript",c:"coffee",coffee:"coffeescript",l:"less",less:"less",s:"sass",sass:"sass",mc:"mincss",mincss:"autominCss",a:"all",all:"autodel automin typescript coffeescript less sass autominCss",st:"style",style:"less sass autominCss",jvs:"autodel automin",tps:"typescript",typescript:"autodel automin typescript",cof:"coffeescript",coffeescript:"autodel automin coffeescript"},presetsRegex=/^\b(all|style|js|typescript|coffeescript)\b$/,jsRegexFilePathPattern="^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";gulp.task("default",["setParams"]),gulp.task("setVars",function(){for(p_path in setConfig(),config.verbose||logTaskPurpose(this.currentTask.name),config.projects){var e=config.projects[p_path];fssync.exists(e.path+"\\config.mzg.ini")?(console.log(chalk.green(e.project)+" - OK"),"*"==e.checked&&setUpProjectWatchingPaths(e.path)):logProjectErrored(e)}config.verbose||console.log("\n["+chalk.gray(dateComputed())+"] CONFIGURATON PROCEEDED\n")}),gulp.task("setParams",function(){var e=this.seq.slice(-1)[0];if(/^default$/.test(e)){var t=tasksToRunOnArgvs();gulp.start(t.length>0?["setVars"].concat(t):[])}else if(/^serve$/.test(e)){t=tasksToRunOnArgvs();gulp.start(t.length>0?["setVars"].concat(t):[])}else if(/^rewrite$/.test(e)){var s=configurationOfRewriteOnArvs(),o=!/^ugly$/.test(s.uglyness),n=!/^multiple$/.test(s.times);logTaskName((o?"imBeauty":"imUgly")+(n?"AtOnce":"imBeauty")),mergingOnChanges(o,n),(o?logTaskEndBeauy:logTaskEndUgly)(n)}}),gulp.task("jshint",function(){return gulp.src(config.pathesToJs).pipe(jshint()).pipe(jshint.reporter("jshint-stylish"))}),gulp.task("helpMe",function(){logHelp()}),gulp.task("scanProjects",function(){logTaskPurpose(this.currentTask.name),setConfig(),config.projects.forEach(function(e){fssync.exists(e.path+"\\config.mzg.ini")||(console.log("file :"+logFilePath(e.path+"\\config.mzg.ini")+" does not exist ... creation very soon"),gulp.src("custom/config_model.ini").pipe(rename("config.mzg.ini")).pipe(gulp.dest(e.path)))})}),gulp.task("serviceMapping",function(){logTaskPurpose(this.currentTask.name),config.verbose=!0,gulp.start(["setVars"])}),gulp.task("serve",["setParams"]),gulp.task("automin",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToJs);gulp.watch(e,function(e){var t=new RegExp(jsRegexFilePathPattern,"g").exec(e.path),s=function(){!/.*.min.js$/.test(e.path)&&t&&gulp.src(e.path).pipe(uglify()).pipe(rename({suffix:".min"})).pipe(gulp.dest(function(e){var t=getDestOfMatching(e.path,config.pathesToJs);return gutil.log("Compressed file version updated/created here :\n"+breath()+"> '"+chalk.cyan(t)+"'"),t}))};t[5]+t[6]===".min.js"&&"added"===e.type?logProcessCompleteOnFile(t[2],"created",s):"deleted"!==e.type&&logProcessCompleteOnFile(t[2],"compressed",s)},jshint)}),gulp.task("autodel",function(e){logTaskPurpose(this.currentTask.name);var t=watchList(config.pathesToJs);gulp.watch(t,function(e){var t=new RegExp(jsRegexFilePathPattern,"g").exec(e.path);if("deleted"===e.type&&t){logProcessCompleteOnFile(t[2].replace(/.js$/g,".min.js"),"deleted",function(){var s=getDestOfMatching(e.path,config.pathesToJs),o=(s+"/"+t[2]).replace(/.min.js$/g,".js").replace(/.js$/g,".min.js");fs.stat(o,function(e,t){e||del(o,{force:!0}),gutil.log("source folder here :\n"+breath()+"> '"+chalk.cyan(s)+"'")})})}},jshint)}),gulp.task("mergeAllMinified",function(){gulp.watch(config.pathesToJs,function(){gulp.src(config.pathesToJs+"/scirpt/*.min.js").pipe(concat("js_stack.min.js")).pipe(uglify()).pipe(gulp.dest("../uglified"))})}),gulp.task("typescript",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToTs);gulp.watch(e,function(e){gulp.src(e.path).pipe(ts({noImplicitAny:!0,outFile:e.path+".js"})).pipe(gulp.dest(function(e){var t=getDestOfMatching(e.path,config.pathesToTs);return gutil.log("Compressed file version updated/created here :\n"+breath()+"> '"+chalk.cyan(t)+"'"),t}))})});coffee=require("gulp-coffee");function getConfig(){return config||{verbose:!1,pathesToJs:[],pathesToTs:[],pathesToCoffee:[],pathesToStyle:[],pathesToStyleLess:[],pathesToWars:[],pathesToSass:[],projects:[]}}function setConfig(){var e,t,s=fs.readFileSync("custom/config.ini","utf8"),o=new classReading;o.initialize(s,0),o.readLines(function(){(e=/^(.*)=.*$/g.exec(o.getLine()))&&(t=e[1]),/^Projects_paths$/.test(t)&&/^\[$/g.test(o.getLine())&&pushProjectIntoConfigViaReading(o,t)})}function pushProjectIntoConfigViaReading(e,t){var s=new classReading;s.initialize(e.getData(),e.getIter());var o,n=/^.*\[(.*),"(.*)",(.*)\],?$/g;s.readLines(function(){var i=s.getLine();(o=n.exec(i))&&"Projects_paths"==t&&config.projects.push({project:o[1],path:o[2],checked:o[3]}),/^]$/g.test(s.getLine())&&(s.stop(),e.setIter(s.getIter()))})}function processConfigTargetProjects(e,t,s){var o,n=new classReading;n.initialize(t.getData(),t.getIter()),n.readLines(function(){var i,a,c=n.getLine();(o=/^.*\["(.*)","(.*)"\].*$/g.exec(c))&&("minify_js"==s?(i={where:config.pathesToJs,purpose:"Compress .js files into .min.js files"},a="/**/*.js"):"ts_to_js"==s?(i={where:config.pathesToTs,purpose:"Compile .ts files into .js File"},a="/**/*.coffee"):"coffee_to_js"==s?(i={where:config.pathesToCoffee,purpose:"Compile .coffee files into .js File"},a="/**/*.coffee"):"minify_css"==s?(i={where:config.pathesToStyle,purpose:"Compress .css files"},a="/**/*.css"):"less"==s?(i={where:config.pathesToStyleLess,purpose:"Compile .less files into .css files"},a="/**/*.less"):"sass"==s?(i={where:config.pathesToSass,purpose:"Compile .scss files into .css files"},a="/**/*.scss"):"war"==s&&(i={where:config.pathesToWars,purpose:"Rename .WAR files"},a="/**/*.war"),pushNewEntryFor({project:e,pathes:o,subpathToExtention:a},i));/^]$/g.test(n.getLine())&&(n.stop(),t.setIter(n.getIter()))})}function setUpProjectWatchingPaths(e){var t,s,o=fs.readFileSync(e+"/config.mzg.ini","utf8"),n=new classReading;n.initialize(o,0);n.readLines(function(){(t=/^(.*)=.*$/g.exec(n.getLine()))&&(s=t[1]),/^(minify_js|ts_to_js|coffee_to_js|minify_css|less|sass)$/.test(s)&&/^\[$/g.test(n.getLine())&&processConfigTargetProjects(e,n,s)})}function pushNewEntryFor(e,t){var s,o=e.project,n=e.pathes,i=e.subpathToExtention,a=t.purpose;(t.where.push({source:o+"\\"+n[1]+i,dest:o+"\\"+n[2]}),config.verbose)&&((s=/^([^.]+)([.][^\s]*)([^.]+)([.][^\s]*)([^.]+)$/.exec(a))?console.log("pushing entry for [Purpose] "+chalk.grey(s[1])+chalk.magenta(s[2])+chalk.grey(s[3])+chalk.magenta(s[4])+chalk.grey(s[5])):(s=/^([^.]+)([.][^\s]*)([^.]+)$/.exec(a))&&console.log("pushing entry for [Purpose] "+chalk.grey(s[1])+chalk.magenta(s[2])+chalk.grey(s[3])),console.log("Watch : '"+chalk.cyan(o+"\\"+n[1]+i)+"'"),console.log("Dest. : '"+chalk.cyan(o+"\\"+n[2])+"'\n"))}function getDestOfMatching(e,t){for(p_path in e=e.replace(/[\\]/g,"/"),t){var s=t[p_path],o=s.source.replace(/[\\]/g,"/"),n=(s.dest.replace(/[\\]/g,"/"),new RegExp("^([^\\\\/*]+).([^\\*]+)([\\/]?[\\/*]+[\\/]?)(.*)$","g").exec(o)[2]);if(new RegExp("^.*(?:"+n+").*$","g").exec(e))return s.dest}return null}function watchList(e){var t=[];for(p_path in e){var s=e[p_path].source;t.push(s)}return t}function tasksToRunOnArgvs(){var e=[],t=[],s=0,o="?",n=process.argv.slice(3,process.argv.length);for(serv in n){try{var i=/^([\-][\-]?)([^\-]+)$/.exec(n[serv]);checkWellForming(i,o=i[2]),o=convertAliasToFullNameOption(i,o),i&&(matchOption=o)&&pushMatchingOption(e=checkPresetsOverdose(e,s),matchOption)}catch(s){if(t.push(s+" Error with option: "),/^GRAVE ERROR.*$/.test(s)){e=[];break}}s++}return logErrorsOnTaskArgvs(t),e}function checkWellForming(e,t){if(e[1].length>2)throw errors=[],"GRAVE ERROR: argument malformed"}function convertAliasToFullNameOption(e,t){return 1==e[1].length&&(t=services[t]),t}function checkPresetsOverdose(e,t){if(presetsRegex.test(matchOption)&&(e=services[matchOption].split(" "),t>0))throw"GRAVE ERROR: Presets should be alone : "+matchOption;return console.log(e),e}function pushMatchingOption(e,t){if(!presetsRegex.test(t)){if(!services[t])throw"GRAVE ERROR: unknown option or preset or alias : -"+t+" or --"+t;e.push(services[t])}}function breath(){return"           "}function logFilePath(e){return"'"+chalk.cyan(e)+"'"}function logHelp(){var e,t,s=fs.readFileSync("help.md","utf8"),o=new classReading;o.initialize(s,0);var n=0;console.log("\n\n"),o.readLines(function(){t=o.getLine().replace(/\r?\n|\r/g,""),(e=/^([\s]*[#]+.*)$/.exec(t))?console.log(chalk.cyan(e[1])):(e=/^([\s]*)([$](?:[\s][^\s]+)+)([\s]{2,}.*|.*)$/.exec(t))?console.log(chalk.grey(e[1])+e[2]+chalk.green(e[3])):(e=/^([\s]*[>].*)$/.exec(t))?console.log(chalk.green(e[1])):(e=/^([\s]*)([\-]+[^\s,]+)([^\-.]*)((?:[\s][\-]+[^\s]+)+)([^\-.]*)((?:[.][^.\s]+)+|)([^\-.]*)((?:[.][^.\s]+)+|)(.*)$/.exec(t))?console.log(chalk.grey(e[1])+e[2]+chalk.grey(e[3])+e[4]+chalk.grey(e[5])+chalk.magenta(e[6])+chalk.grey(e[7])+chalk.magenta(e[8])+chalk.grey(e[9])):(e=/^([^\-]*)((?:[\-]+[^\s]+[\s]?)+)([\s]?.*)$/.exec(t))?console.log(chalk.grey(e[1])+e[2]+chalk.grey(e[3])):t.length>0?console.log(chalk.grey(t)):++n%3==2&&console.log(t),t.length>0&&(n=0)})}function logErrorsOnTaskArgvs(e){e.length>0&&(console.log(chalk.red(e.join("\n"))),console.log("WARNING \n\nYou may have made mistakes in shoosing wrong options"),console.log("call the folowing command to have more info of what options are valid"),console.log("gulp --help"))}function logProjectErrored(e){console.log(chalk.red(e.project)+" - SOMETING IS WRONG"),console.log(breath()+"this project seems to have no configuration .INI file defined"),console.log(breath()+logFilePath(e.path+"\\config.mzg.ini")+chalk.red(" : MISSING")),console.log("\n"+breath()+"SOLUTION:"),console.log(breath()+"run the command to setup projects local configuraitons:"),console.log(breath()+"> "+chalk.grey("$ gulp scanProjects"))}function logProcessCompleteOnFile(e,t,s){try{var o=new Date;s();var n=ms2Time(new Date-o);console.log(),gutil.log("'"+chalk.cyan(e)+"' "+t+" after"+chalk.magenta(n))}catch(e){console.log(chalk.red(e))}}function ms2Time(e){var t,s,o;return[(o=Math.floor((s=Math.floor((t=Math.floor((e=Math.floor(e%1e3))/1e3%60))%60))%24))?o+"h ":"",s?s+"min ":"",t?t+"sec ":"",e,"ms"].join("")}function dateComputed(){var e=new Date;return[["Mon","Tues","Wednes","Thirth","Fri","Satur","Sun"][e.getDay()-1],"day,",[e.getMonth()+1,e.getDate(),e.getFullYear()].join("-")].join("")}function timeComputed(){var e=new Date;return[e.getHours(),e.getMinutes(),e.getSeconds()].join(":")}function logTaskPurpose(e){switch(logTaskName(e),e){case"setVars":console.log("  Sets configuration variables"),console.log("  See the .INI file of project mapping to set MazeGulp ready to serve your projects here :"),console.log("  > "+logFilePath("custom/config.mzg.ini")+":\n");break;case"automin":console.log("  Will uglify .js files matching the folowing path(s):\n"),logWatchList(config.pathesToJs);break;case"autodel":console.log("  Delete "+logFilePath(".min.js orphan files")+" when "+logFilePath(".js files model")+" are deleted\n");break;case"typescript":console.log("  Will compile .ts files matching the folowing path(s):\n"),logWatchList(config.pathesToTs);break;case"coffeescript":console.log("  Will compile .coffee files matching the folowing path(s):\n"),logWatchList(config.pathesToCoffee);break;case"autominCss":console.log("  Will compress .css files matching the folowing path(s):\n"),logWatchList(config.pathesToStyle);break;case"less":console.log("  Will compile .less files matching the folowing path(s):\n"),logWatchList(config.pathesToStyleLess);break;case"sass":console.log("  Will compile .sass files matching the folowing path(s):\n"),logWatchList(config.pathesToSass);break;case"scanProjects":console.log("  Creates .INI configuration files in your project root folder need to make MazeGulp able to serve\n");break;default:console.log("  Task unknown: "+e+"\n")}}function logWatchList(e){watchList(e).forEach(function(e){console.log("    '"+chalk.cyan(e)+"'")}),console.log()}function logTaskName(e){console.log("............................................................."),console.log("[Task] "+chalk.red(e)+":")}function logTaskEndUgly(e){console.log("      > which is uglyfied "+chalk.red("for performances")),e?console.log("  once: "+chalk.red("not watching specific files")+"\n"):console.log()}function logTaskEndBeauy(e){console.log("      > which is beautifull "+chalk.red("for debugging")+"\n"),e?console.log("  once: "+chalk.red("not watching specific files")+"\n"):console.log()}function classReading(){this.line,this.data,this.iter,this.stopped=!1,this.initialize=function(e,t){this.data=e,this.iter=t,this.line=[]},this.readLines=function(e){for(var t;!this.isStopped()&&(t=this.getNextChar());)/^[\n\r]$/g.test(t)||this.isEndReached()?(this.toLine(),e(this.getLine()),this.resetLine()):this.feed(t)},this.stop=function(){this.stopped=!0},this.isStopped=function(){return this.stopped},this.setIter=function(e){this.iter=e},this.setData=function(e){this.data=e},this.toLine=function(){this.line=this.line.join(""),this.line=this.line.replace(/^[\n\r]$/g,"")},this.resetLine=function(){this.line=[]},this.getIter=function(){return this.iter},this.getData=function(){return this.data},this.getLine=function(){return this.line},this.getNextChar=function(){return this.data[this.iter++]},this.isEndReached=function(){return!this.data[this.iter]},this.feed=function(e){this.line.push(e)}}gulp.task("coffeescript",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToCoffee);gulp.watch(e,function(e){gulp.src(e.path).pipe(coffee({bare:!0})).pipe(gulp.dest(function(e){var t=getDestOfMatching(e.path,config.pathesToCoffee);return gutil.log("Compiled file version updated/created here :\n"+breath()+"> '"+chalk.cyan(t)+"'"),t}))})}),gulp.task("autominCss",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToStyle);gulp.watch(e,function(e){if(!/^(.*.min.css|.*.less)$/.test(e.path)&&/^.*.css$/.test(e.path)){logProcessCompleteOnFile(e.path,"compiled",function(){gulp.src(e.path).pipe(cleanCSS({compatibility:"ie8"})).pipe(rename({suffix:".min"})).pipe(gulp.dest(function(e){var t=getDestOfMatching(e.path,config.pathesToStyle);return gutil.log("Compressed file version updated/created here :\n"+breath()+"> '"+chalk.cyan(t)+"'"),t}))})}})}),gulp.task("autoformatCss",function(){gulp.watch(config.pathesToStyleLess,function(e){/^(.*.min.css)$/.test(e.path)||(console.log("try"),gulp.src(e.path).pipe(cssbeautify({format:"beautify"})).pipe(gulp.dest(function(e){return e.base})),console.log("done"))})}),gulp.task("less",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToStyleLess);gulp.watch(e,function(e){if(/.*.less$/.test(e.path)){logProcessCompleteOnFile(e.path,"compiled",function(){gulp.src(e.path).pipe(less({paths:[path.join(__dirname,"less","includes")]})).pipe(gulp.dest(function(e){var t=getDestOfMatching(e.path,config.pathesToStyleLess);return gutil.log("Processed file version updated/created here :\n"+breath()+"> '"+chalk.cyan(t)+"'"),t}))})}})}),gulp.task("sass",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToSass);gulp.watch(e,function(e){if(/.*.scss$/.test(e.path)){logProcessCompleteOnFile(e.path,"compiled",function(){gulp.src(e.path).pipe(sass().on("error",sass.logError)).pipe(gulp.dest(function(e){var t=getDestOfMatching(e.path,config.pathesToSass);return gutil.log("Processed file version updated/created here :\n"+breath()+"> '"+chalk.cyan(t)+"'"),t}))})}})}),gulp.task("removeWarVersion",function(){gulp.watch(config.pathesToWars,function(e){if(/^(.*.war)$/.test(e.path))try{t=e,s="",gulp.src(t.path).pipe(wait(1500)).pipe(rename(function(e){return s=/^(.*)(?:-[0-9]*.[0-9]*.*)$/g.exec(t.path),console.log(s[1]),s[1]+".war"})).pipe(gulp.dest(function(e){return e.base})),console.log(s),s,logProcessCompleteOnFile("","renamed",function(){})}catch(e){}var t,s})}),gulp.task("rewrite",["setParams","applyTemp","applyDist"]),gulp.Gulp.prototype.__runTask=gulp.Gulp.prototype._runTask,gulp.Gulp.prototype._runTask=function(e){this.currentTask=e,this.__runTask(e)};