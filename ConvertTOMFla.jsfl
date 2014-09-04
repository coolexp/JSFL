var dom;
var lib;
var SOP = {};
var startIndex;
var skillName = "label";
var documentPrefix="";
var DOCWIDTH = 0;
var DOCHEIGHT = 0;
var FRAMERATE = 36;
var timeLime;
var BG;
var documentHeadStr = '<?xml version="1.0" encoding="UTF-8"?><root>';
var documentBottomStr = '</root>';
var basePath="";
var KEYNAMELIST = ["wait","move"];
function openDoc(path){
	dom =fl.openDocument(path);
	timeLime = dom.getTimeline();
	DOCWIDTH = dom.width;
	DOCHEIGHT = dom.height;
	lib = dom.library;
	FRAMERATE = dom.frameRate;
	startIndex = 0;
	documentPrefix = dom.name.replace(".fla","");
	BG =dom.backgroundColor;
	convert();
	dom.close(false);
}
function convert(){
	var checkLayer = checkLayers();
	if(!checkLayer){
		alert("当前Fla的层不对");
	}else{
		var layer = getLayerByIndex(0);
		if(layer.name!=skillName){
			alert("没有名为label的层，并必须在第一层");
		}else{
			var layerContent = getLayerByIndex(1);
			if(layer.frames.length!=layerContent.frames.length){
				alert("两图层的帧数不相等");
			}else{
				startConvert();
			}
		}
	}
}
function createFolder(path){
	if(FLfile.createFolder(path)) {
   		
	}else {
  	  
	}
}
function startConvert(){
	var basePath = document.path.replace(document.name,"").replace(":","|").replace(/\\/g,"/");
	var URIFOLDER = "file:///"+basePath+documentPrefix;
	createFolder(URIFOLDER);
	
	var a = [];
	var i = 0,l = 0;
	var layer = getLayerByIndex(0);
	var frames = layer.frames;
	if(frames.length<0){
		alert("没有帧可以转换");
	}else{
		var startFrameName = frames[0].name;
		var obj = {};
		obj.name = trim(startFrameName);
		obj.start = 0;
		a.push(obj);
		for(i = 0,l = frames.length;i<l;i++){
			var frameName = frames[i].name;
			obj.end = i;
			if(frameName!=startFrameName){
				if(frameName!=""){
					obj = {};
					startFrameName = frameName;
					obj.name = trim(startFrameName);
					obj.start = i;
					a.push(obj);
				}
			}
		}
		a = resetArray(a);
		trace(a.join("-"),a.length);
		var fileString = documentHeadStr;
		for(i = 0,l = a.length;i<l;++i){
			var obj = a[i];
			var na = obj.name.replace(/\,/g,"-");
			trace(obj.name,obj.start,obj.end);
			timeLime.setSelectedLayers(1);
			trace("select frames:",obj.start,obj.end);
			timeLime.setSelectedFrames(obj.start,obj.end);
			timeLime.copyFrames();
			na = trim(na);
			createAndSaveDOC(documentPrefix,URIFOLDER,na);
			fileString+=splitName(obj.name);
		}
		fileString+=documentBottomStr;
		createOriginalNode(documentPrefix,URIFOLDER,fileString);
	}
}
function resetArray(a){
	var b = [];
	for(var i = 0;i<a.length;i++){
		var o = a[i];
		if(o.name == "wait"||o.name=="move"){
			b.push(o);	
		}
	}
	return b;
}
function splitName(na){
	var a = na.split(",");
	var val = "";
	for(var i = 0,l = a.length;i<l;++i){
		val+='<node cls="'+na.replace(/\,/g,"-")+'" name="'+a[i]+'" />'
	}
	return val;
}
function createAndSaveDOC(prefix,URI,fileName){
	var FILEURI = URI+"/"+prefix+"_"+fileName;
	var doc =  fl.createDocument("timeline");
	doc.frameRate = FRAMERATE;
	doc.width = DOCWIDTH;
	doc.height = DOCHEIGHT;
	doc.backgroundColor = BG;
	doc.getTimeline().setSelectedLayers(0);
	doc.getTimeline().pasteFrames()
	fl.saveDocument(doc,FILEURI+".fla");
	doc.exportSWF(FILEURI+".swf",true);
	fl.closeDocument(doc);
}
function createOriginalNode(prefix,URI,val){
	var FILEURI = URI+"/"+prefix+"_"+"node.xml.dat";
	if (FLfile.write(FILEURI, val)) {
		trace(FILEURI+"成功生成");
	}
}
function getLayerByIndex(index){
	var currentLayers = dom.getTimeline().layers;
	return currentLayers[index];
}
function checkLayers(){
	var currentLayers = dom.getTimeline().layers;
	if(currentLayers.length!=2){
		return false;
	}
	return true;
}
function trace(){
	var arg = Array.prototype.slice.call(arguments);
	var str = arg.join(",");
	fl.trace(str);
}
function clear(){
	fl.outputPanel.clear();
}
function trim(val){
	 return val.replace(/(^\s*)|(\s*$)/g, "");  
}
function listFoldersHandler(){
	var folderURI  = basePath = fl.browseForFolderURL("选择文件夹，稍后Convert FLA");
	var fileList = FLfile.listFolder(folderURI, "files");
	for(var i=0;i<fileList.length;i++){
		var fileName=fileList[i];
		trace("fileName",fileName);
		var ind=fileName.indexOf(".");
		if(ind<=0||ind==(fileName.length-1)) {
			continue;
		}
		var ext=fileName.substr(ind+1,fileName.length-ind);
                ext=ext.toLowerCase();
                //不是fla则略过
                if(ext!="fla"){
			continue;
                }
		openDoc(basePath+"/"+fileName);
	}
}
(function(){
	clear();
 	listFoldersHandler();
 })()