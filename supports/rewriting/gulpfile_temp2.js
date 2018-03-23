var argv=require("yargs").argv,autoprefixer=require("gulp-autoprefixer"),chalk=require("chalk"),cleanCSS=require("gulp-clean-css"),coffee=require("gulp-coffee"),concat=require("gulp-concat"),del=require("del"),fs=require("fs"),fssync=require("fs-sync"),gulp=require("gulp"),gutil=require("gulp-util"),insert=require("gulp-insert"),jshint=require("gulp-jshint"),jsValidate=require("gulp-jsvalidate"),less=require("gulp-less"),nop=require("gulp-nop"),path=require("path"),rename=require("gulp-rename"),sass=require("gulp-sass"),sourcemaps=require("gulp-sourcemaps"),through=require("through2"),ts=require("gulp-typescript"),uglify=require("gulp-uglify"),wait=require("gulp-wait"),config=getConfig(),SERVICES={d:"del",del:"autodel",mj:"minjs",minjs:"automin",ts:"typescript",c:"coffee",coffee:"coffeescript",l:"less",less:"less",s:"sass",sass:"sass",mc:"mincss",mincss:"autominCss",a:"all",all:"autodel automin typescript coffeescript less sass autominCss",st:"style",style:"less sass autominCss",jvs:"autodel automin",tps:"typescript",typescript:"autodel automin typescript",cof:"coffeescript",coffeescript:"autodel automin coffeescript"},PRESET_OPTIONS="all|style|js|typescript|coffeescript",SERVICES_OPTIONS="del|minjs|ts|coffee|less|sass|mincss",GLOUPS_OPTIONS=SERVICES_OPTIONS+"|"+PRESET_OPTIONS,GLOUPS_VERSION="4.5",JS_REGEX_FILE_PATH_PATTERN="^(?:((?:[^\\.]+|..)[\\x2F\\x5C])|)((?:([^\\.^\\x2F^\\x5C]+)(?:((?:[.](?!\\bmin\\b)(?:[^\\.]+))+|))(?:([.]min)([.]js)|([.]js))))$";gulp.task("default",["setParams"]),gulp.task("setVars",function(){for(p_path in setConfig(),config.verbose||logTaskPurpose(this.currentTask.name),config.projects){var e=config.projects[p_path];fssync.exists(e.path+"\\config.mzg.json")?(console.log(chalk.green(e.project)+" - OK"),e.checked&&setUpProjectWatchingPaths(e.path)):logProjectErrored(e)}config.verbose||console.log("\n["+chalk.gray(dateComputed())+"] CONFIGURATON PROCEEDED\n")}),gulp.task("setParams",function(){var e=this.seq.slice(-1)[0];if(/^default$/.test(e)){var s=tasksToRunOnArgvs();gulp.start(0<s.length?["setVars"].concat(s):[])}else if(/^serve$/.test(e)){s=tasksToRunOnArgvs();gulp.start(0<s.length?["setVars"].concat(s):[])}else if(/^rewrite$/.test(e)){var t=configurationOfRewriteOnArvs(),o=!/^ugly$/.test(t.uglyness),i=!/^multiple$/.test(t.times);logTaskName((o?"imBeauty":"imUgly")+(i?"AtOnce":"imBeauty")),mergingOnChanges(o,i),(o?logTaskEndBeauy:logTaskEndUgly)(i)}}),gulp.task("jshint",function(){return gulp.src(config.pathesToJs).pipe(jshint()).pipe(jshint.reporter("jshint-stylish"))}),gulp.task("helpMe",function(){logHelp()}),gulp.task("scanProjects",function(){logTaskPurpose(this.currentTask.name),setConfig(),config.projects.forEach(function(e){fssync.exists(e.path+"\\config.mzg.json")||(console.log("file :"+logFilePath(e.path+"\\config.mzg.json")+" does not exist ... creation very soon"),gulp.src("custom/config_model.json").pipe(rename("config.mzg.json")).pipe(gulp.dest(e.path)))})}),gulp.task("serviceMapping",function(){logTaskPurpose(this.currentTask.name),config.verbose=!0,gulp.start(["setVars"])}),gulp.task("serve",["setParams"]),gulp.task("automin",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToJs);gulp.watch(e,function(e){var s=new RegExp(JS_REGEX_FILE_PATH_PATTERN,"g").exec(e.path),t=function(){!/.*.min.js$/.test(e.path)&&s&&gulp.src(e.path).pipe(uglify()).pipe(rename({suffix:".min"})).pipe(gulp.dest(function(e){var s=getDestOfMatching(e.path,config.pathesToJs);return gutil.log("Compressed file version updated/created here :\n"+breath()+"> "+logFilePath(s)),s}))};s[5]+s[6]===".min.js"&&"added"===e.type?logProcessCompleteOnFile(s[2],"created",t):"deleted"!==e.type&&logProcessCompleteOnFile(s[2],"compressed",t)},jshint)}),gulp.task("autodel",function(e){logTaskPurpose(this.currentTask.name);var s=watchList(config.pathesToJs);gulp.watch(s,function(e){var s=new RegExp(JS_REGEX_FILE_PATH_PATTERN,"g").exec(e.path);if("deleted"===e.type&&s){logProcessCompleteOnFile(s[2].replace(/.js$/g,".min.js"),"deleted",function(){var t=getDestOfMatching(e.path,config.pathesToJs),o=(t+"/"+s[2]).replace(/.min.js$/g,".js").replace(/.js$/g,".min.js");fs.stat(o,function(e,s){e||del(o,{force:!0}),gutil.log("source folder here :\n"+breath()+"> "+logFilePath(t))})})}},jshint)}),gulp.task("mergeAllMinified",function(){gulp.watch(config.pathesToJs,function(){gulp.src(config.pathesToJs+"/scirpt/*.min.js").pipe(concat("js_stack.min.js")).pipe(uglify()).pipe(gulp.dest("../uglified"))})}),gulp.task("typescript",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToTs);gulp.watch(e,function(e){gulp.src(e.path).pipe(ts({noImplicitAny:!0,outFile:e.path+".js"})).pipe(gulp.dest(function(e){var s=getDestOfMatching(e.path,config.pathesToTs);return gutil.log("Compressed file version updated/created here :\n"+breath()+"> "+logFilePath(s)),s}))})});coffee=require("gulp-coffee");function getConfig(){return config||{verbose:!1,pathesToJs:[],pathesToTs:[],pathesToCoffee:[],pathesToStyle:[],pathesToStyleLess:[],pathesToSass:[],projects:[]}}function readJsonConfig(e){var s,t,o=fs.readFileSync(e,"utf8"),i=new classReading;i.initialize(o,0);var n=0,a=!0,r="",l=(s=/^(.*)(\.json)$/.exec(e))[1]+".temp"+s[2];fssync.write(l,"","utf8"),i.readLines(function(){t=i.getLine(),(a=s=/^(.*)\/\/.*$/g.exec(t))?r=s[1]:(a=s=/^(.*)\/\*$/g.exec(t))?(r=s[1],++n):(a=s=/^.*\*\/(.*)$/g.exec(t))?(r=s[1],--n):(a=0==n)&&(r=t),a&&(/^[\s]*$/g.test(r)||fs.appendFileSync(l,r+"\r\n","utf8"))});var c=fs.readFileSync(l,"utf8");return fssync.remove(l),JSON.parse(c)}function setConfig(){config.projects=readJsonConfig("custom/config.json").projects}function makePathesCoveringAllFilesFor(e,s,t,o){for(var i=s.addon,n=s.pathesToService,a=0,r=i.length;a<r;++a){i[a].watch=i[a].watch+t;i[a].watch,i[a].dest;0<a&&(o="[SAME-PURPOSE]"),logServiceActivatedPushed(o,e,i[a]),i[a].watch=e+"/"+i[a].watch,i[a].dest=e+"/"+i[a].dest,n=n.concat(i[a])}return config.verbose&&console.log(),n}function processConfigTargetProjects(e){var s=readJsonConfig(e+"/config.mzg.json");console.log("Activated Services for target project under the path [FOLDER]:"),console.log(logFilePath(e)+"\n"),config.pathesToJs=makePathesCoveringAllFilesFor(e,{pathesToService:config.pathesToJs,addon:s.minify_js},"/**.js","Compress .js files into .min.js files"),config.pathesToTs=makePathesCoveringAllFilesFor(e,{pathesToService:config.pathesToTs,addon:s.ts_to_js},"/**.ts","Compile .ts files into .js file"),config.pathesToCoffee=makePathesCoveringAllFilesFor(e,{pathesToService:config.pathesToCoffee,addon:s.coffee_to_js},"/**.coffee","Compile .coffee files into .js file"),config.pathesToStyle=makePathesCoveringAllFilesFor(e,{pathesToService:config.pathesToStyle,addon:s.minify_css},"/**.css","Compress .css files"),config.pathesToStyleLess=makePathesCoveringAllFilesFor(e,{pathesToService:config.pathesToStyleLess,addon:s.less},"/**.less","Compile .less files into .css files"),config.pathesToSass=makePathesCoveringAllFilesFor(e,{pathesToService:config.pathesToSass,addon:s.sass},"/**.scss","Compile .scss files into .css files")}function setUpProjectWatchingPaths(e){processConfigTargetProjects(e)}function getDestOfMatching(e,s){for(p_path in e=e.replace(/[\\]/g,"/"),s){var t=s[p_path],o=t.watch.replace(/[\\]/g,"/"),i=(t.dest.replace(/[\\]/g,"/"),new RegExp("^([^\\\\/*]+).([^\\*]+)([\\/]?[\\/*]+[\\/]?)(.*)$","g").exec(o)[2]);if(new RegExp("^.*(?:"+i+").*$","g").exec(e))return t.dest}return null}function watchList(e){var s=[];for(p_path in e){var t=e[p_path].watch;s.push(t)}return s}function translateAliassesInArgs(e,s){var t,o=[];return e.forEach(function(e){(t=/^-([^\-]+)$/.exec(e))?o.push("--"+s[t[1]]):o.push(e)}),o}function getSliceOfMatchingOptions(e,s){var t=0,o=0;try{e.forEach(function(e){if(!new RegExp("^--("+s+")$","g").test(e)){if(t!=o)throw{};t++}o++})}catch(e){}return e.slice(t,o)}function tasksToRunOnArgvs(){var s=[],t=[],e=0,o=getSliceOfMatchingOptions(translateAliassesInArgs(process.argv,SERVICES),GLOUPS_OPTIONS);for(service in o){try{service=/^[\-][\-]?([^\-]+)$/.exec(o[service])[1],new RegExp("^\\b("+PRESET_OPTIONS+")\\b$").test(service)?(checkPresetsOverdose(++e,service),s=SERVICES[service].split(" ")):s.push(SERVICES[service])}catch(e){if(t.push(e+" Error with option: "),/^GRAVE ERROR.*$/.test(e)){s=[];break}}e++}return logErrorsOnTaskArgvs(t),s}function checkPresetsOverdose(e,s){if(1<e)throw"GRAVE ERROR: Presets should be alone : "+s}function breath(){return"           "}function logFilePath(e){return"'"+chalk.cyan(e)+"'"}function logHelp(){var e,s,t=fs.readFileSync("help.md","utf8"),o=new classReading;o.initialize(t,0);var i=0;console.log("\n\n"),o.readLines(function(){s=o.getLine().replace(/\r?\n|\r/g,""),(e=/^([\s]*[#]+.*)$/.exec(s))?console.log(chalk.cyan(e[1])):(e=/^([\s]*)([$](?:[\s][^\s]+)+)([\s]{2,}.*|.*)$/.exec(s))?console.log(chalk.grey(e[1])+e[2]+chalk.green(e[3])):(e=/^([\s]*[>].*)$/.exec(s))?console.log(chalk.green(e[1])):(e=/^([\s]*)([\-]+[^\s,]+)([^\-.]*)((?:[\s][\-]+[^\s]+)+)([^\-.]*)((?:[.][^.\s]+)+|)([^\-.]*)((?:[.][^.\s]+)+|)(.*)$/.exec(s))?console.log(chalk.grey(e[1])+e[2]+chalk.grey(e[3])+e[4]+chalk.grey(e[5])+chalk.magenta(e[6])+chalk.grey(e[7])+chalk.magenta(e[8])+chalk.grey(e[9])):(e=/^([^\-]*)((?:[\-]+[^\s]+[\s]?)+)([\s]?.*)$/.exec(s))?console.log(chalk.grey(e[1])+e[2]+chalk.grey(e[3])):0<s.length?console.log(chalk.grey(s)):++i%3==2&&console.log(s),0<s.length&&(i=0)})}function logErrorsOnTaskArgvs(e){0<e.length&&(console.log(chalk.red(e.join("\n"))),console.log("WARNING \n\nYou may have made mistakes in shoosing wrong options"),console.log("call the folowing command to have more info of what options are valid"),console.log("gulp --help"))}function logProjectErrored(e){console.log(chalk.red(e.project)+" - SOMETING IS WRONG"),console.log(breath()+"this project seems to have no configuration .INI file defined"),console.log(breath()+logFilePath(e.path+"\\config.mzg.ini")+chalk.red(" : MISSING")),console.log("\n"+breath()+"SOLUTION:"),console.log(breath()+"run the command to setup projects local configuraitons:"),console.log(breath()+"> "+chalk.grey("$ gulp scanProjects"))}function logProcessCompleteOnFile(e,s,t){try{var o=new Date;t();var i=ms2Time(new Date-o);console.log(),gutil.log(logFilePath(e)+" "+s+" after"+chalk.magenta(i))}catch(e){console.log(chalk.red(e))}}function ms2Time(e){var s,t,o;return[(o=Math.floor((t=Math.floor((s=Math.floor((e=Math.floor(e%1e3))/1e3%60))%60))%24))?o+"h ":"",t?t+"min ":"",s?s+"sec ":"",e,"ms"].join("")}function dateComputed(){var e=new Date;return[["Mon","Tues","Wednes","Thirth","Fri","Satur","Sun"][e.getDay()-1],"day,",[e.getMonth()+1,e.getDate(),e.getFullYear()].join("-")].join("")}function timeComputed(){var e=new Date;return[e.getHours(),e.getMinutes(),e.getSeconds()].join(":")}function logServiceActivatedPushed(e,s,t){if(config.verbose){var o;(o=/^([^.]+)([.][^\s]*)([^.]+)([.][^\s]*)([^.]+)$/.exec(e))?console.log(chalk.grey(o[1])+chalk.magenta(o[2])+chalk.grey(o[3])+chalk.magenta(o[4])+chalk.grey(o[5])):(o=/^([^.]+)([.][^\s]*)([^.]+)$/.exec(e))&&console.log(chalk.grey(o[1])+chalk.magenta(o[2])+chalk.grey(o[3])),console.log("Watch :"+logFilePath("[..]/"+t.watch)+" - Dest. :"+logFilePath("[..]/"+t.dest));var i=t.sourcemaps;void 0!==i&&console.log(i?chalk.green("Sourcemaps !"):chalk.grey("no sourcemaps"))}}function logTaskPurpose(e){logTaskName(e);var s={setVars:"  Sets configuration variables \n  See the .INI file of project mapping to set Gloups ready to serve your projects here :\n  > "+logFilePath("custom/config.mzg.ini")+":\n",automin:"  Will uglify .js files matching the folowing path(s):\n",autodel:"  Delete "+logFilePath(".min.js orphan files")+" when "+logFilePath(".js files model")+" are deleted\n",typescript:"  Will compile .ts files matching the folowing path(s):\n",coffeescript:"  Will compile .coffee files matching the folowing path(s):\n",autominCss:"  Will compress .css files matching the folowing path(s):\n",less:"  Will compile .less files matching the folowing path(s):\n",sass:"  Will compile .sass files matching the folowing path(s):\n",scanProjects:"  Creates configuration file in every project root folder\n"};s[e]?(console.log(s[e]),logWatchList(e)):console.log(chalk.yellow("  no information provided \n"))}function logWatchList(e){var s={automin:config.pathesToJs,typescript:config.pathesToTs,coffeescript:config.pathesToCoffee,autominCss:config.pathesToStyle,less:config.pathesToStyleLess,sass:config.pathesToSass};s[e]&&(watchList(s[e]).forEach(function(e){console.log("    "+logFilePath(e))}),console.log())}function logTaskName(e){console.log("............................................................."),console.log("[Task] "+chalk.red(e)+":")}function logTaskEndUgly(e){console.log("      > which is uglyfied "+chalk.red("for performances")),e?console.log("  once: "+chalk.red("not watching specific files")+"\n"):console.log()}function logTaskEndBeauy(e){console.log("      > which is beautifull "+chalk.red("for debugging")+"\n"),e?console.log("  once: "+chalk.red("not watching specific files")+"\n"):console.log()}function classReading(){this.line,this.data,this.iter,this.stopped=!1,this.initialize=function(e,s){this.data=e,this.iter=s,this.line=[]},this.readLines=function(e){for(var s;!this.isStopped()&&(s=this.getNextChar());)/^[\n\r]$/g.test(s)||this.isEndReached()?(this.toLine(),e(this.getLine()),this.resetLine()):this.feed(s)},this.stop=function(){this.stopped=!0},this.isStopped=function(){return this.stopped},this.setIter=function(e){this.iter=e},this.setData=function(e){this.data=e},this.toLine=function(){this.line=this.line.join(""),this.line=this.line.replace(/^[\n\r]$/g,"")},this.resetLine=function(){this.line=[]},this.getIter=function(){return this.iter},this.getData=function(){return this.data},this.getLine=function(){return this.line},this.getNextChar=function(){return this.data[this.iter++]},this.isEndReached=function(){return!this.data[this.iter]},this.feed=function(e){this.line.push(e)}}gulp.task("coffeescript",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToCoffee);gulp.watch(e,function(e){gulp.src(e.path).pipe(coffee({bare:!0})).pipe(gulp.dest(function(e){var s=getDestOfMatching(e.path,config.pathesToCoffee);return gutil.log("Compiled file version updated/created here :\n"+breath()+"> "+logFilePath(s)),s}))})}),gulp.task("autominCss",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToStyle);gulp.watch(e,function(e){if(!/^(.*.min.css|.*.less)$/.test(e.path)&&/^.*.css$/.test(e.path)){logProcessCompleteOnFile(e.path,"compiled",function(){var s=getDestOfMatching(e.path,config.pathesToStyle);gulp.src(e.path).pipe(sourcemaps.init()).pipe(autoprefixer({browsers:["last 2 versions"],cascade:!1})).pipe(cleanCSS({compatibility:"ie8"})).pipe(rename({suffix:".min"})).pipe(insert.append("\n/* -- Compressed with Gloups|"+GLOUPS_VERSION+" using gulp-clean-css -- */")).pipe(sourcemaps.write("./")).pipe(gulp.dest(function(e){return gutil.log("Compressed file version updated/created here :\n"+breath()+"> "+logFilePath(s)),s}))})}})}),gulp.task("autoformatCss",function(){gulp.watch(config.pathesToStyleLess,function(e){/^(.*.min.css)$/.test(e.path)||(console.log("try"),gulp.src(e.path).pipe(cssbeautify({format:"beautify"})).pipe(gulp.dest(function(e){return e.base})),console.log("done"))})}),gulp.task("less",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToStyleLess);gulp.watch(e,function(e){if(/.*.less$/.test(e.path)){console.log("once !");logProcessCompleteOnFile(e.path,"compiled",function(){gulp.src(e.path).pipe(sourcemaps.init()).pipe(autoprefixer({browsers:["last 2 versions"],cascade:!1})).pipe(less({paths:[path.join(__dirname,"less","includes")]})).pipe(insert.append("\n/* -- Compiled with Gloups|"+GLOUPS_VERSION+" using gulp-less -- */")).pipe(sourcemaps.write("./")).pipe(gulp.dest(function(e){var s,t=getDestOfMatching(e.path,config.pathesToStyleLess);return s&&(gutil.log("Processed file version updated/created here :\n"+breath()+"> "+logFilePath(t)),s=!1),t}))})}})}),gulp.task("sass",function(){logTaskPurpose(this.currentTask.name);var e=watchList(config.pathesToSass);gulp.watch(e,function(e){if(/.*.scss$/.test(e.path)){logProcessCompleteOnFile(e.path,"compiled",function(){gulp.src(e.path).pipe(sourcemaps.init()).pipe(autoprefixer({browsers:["last 2 versions"],cascade:!1})).pipe(sass().on("error",sass.logError)).pipe(sourcemaps.write("./")).pipe(gulp.dest(function(e){var s=getDestOfMatching(e.path,config.pathesToSass);return gutil.log("Processed file version updated/created here :\n"+breath()+"> "+logFilePath(s)),s}))})}})}),gulp.task("removeWarVersion",function(){gulp.watch(config.pathesToWars,function(e){if(/^(.*.war)$/.test(e.path))try{s=e,t="",gulp.src(s.path).pipe(wait(1500)).pipe(rename(function(e){return t=/^(.*)(?:-[0-9]*.[0-9]*.*)$/g.exec(s.path),console.log(t[1]),t[1]+".war"})).pipe(gulp.dest(function(e){return e.base})),console.log(t),t,logProcessCompleteOnFile("","renamed",function(){})}catch(e){}var s,t})}),gulp.task("rewrite",["setParams","applyTemp","applyDist"]),gulp.Gulp.prototype.__runTask=gulp.Gulp.prototype._runTask,gulp.Gulp.prototype._runTask=function(e){this.currentTask=e,this.__runTask(e)};