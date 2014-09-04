var dom;
var lib;
var ExpJSFLTooler = {};
function traceObj(obj){
	for(var prop in obj){
		trace(prop + ": " + obj[prop]);
	}
}
function trace(obj){
	var arg = Array.prototype.slice.call(arguments);
	var str = arg.join(",");
	fl.trace(str);
}
function clear(){
	fl.outputPanel.clear();
}
 	
function formatString(src){
	if (arguments.length == 0) return null;
	var args = Array.prototype.slice.call(arguments, 1);
	return src.replace(/\{(\d+)\}/g, function(m, i){
		return args[i];
	});    
}
ExpJSFLTooler.getConfigPath = function(){
	trace(fl.configDirectory);
}
function arrangeLib(){
	clear();
	dom = fl.getDocumentDOM();
 	lib = dom.library;
 	var str = "测试{0},欢迎{1}";
 	trace(formatString(str,"函数","Sloppy"));
}
function runScript(val){
	var URI = "file:///"+fl.configDirectory.replace(":","|").replace(/\\/g,"/")+"WindowSWF/ExpFlashTooler/"+val;
	fl.runScript(URI, 'testFunct', 10, 1);
}