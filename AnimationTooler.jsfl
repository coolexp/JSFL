var dom;
var lib;
var textureLayerName = "t";
var nodeLayerName = "fl";
var prefix;
var basePath;
var EXPTooler = {};
var fileList;
var textureString = "<textures>{0}</textures>";
var xmlString = '<?xml version="1.0" encoding="UTF-8"?><root>{0}{1}</root>';
var frameString = '<frame num="{0}">{1}</frame>';
var nodeXMLString = '<nodes>{0}</nodes>';
var nodeString = '<node blood="" key="{0}" start="{1}" end="{2}" />';
var imageNum = 0;
/**
* 得到并制造Node XML节点字符串
*/
function getNodeXMLString(){
	var layer = getFrameNameLayer(nodeLayerName);
	var frames = layer.frames;
	var nodeList = [];
	var i = 0,l = 0;
	for(i = 0,l = frames.length;i<l;++i){
		var frameName = trimString(frames[i].name);
		var index = isNodeList(nodeList,frameName);
		if(index<0){
			if(frameName==""){
				nodeList[nodeList.length-1].end = i;
			}else{
				nodeList.push({"nodeName":frameName,"start":i});
			}
		}else{
			nodeList[nodeList.length-1].end = i-1;
		}
	}
	var tNodeString = "";
	for(i = 0,l = nodeList.length;i<l;++i){
		var node = nodeList[i];
		var b = nodeList[i].nodeName.split(",");
		for(var k = 0;k<b.length;k++){
			tNodeString+=formatString(nodeString,b[k],node.start,node.end);
		}
	}
	var laterString = formatString(nodeXMLString,tNodeString);
	return laterString;
}
/**
* 判断是否已经Push进Node节点数组了
*/
function isNodeList(arr,nodeName){
	for(var i = 0,l = arr.length;i<l;i++){
		if(arr[i].nodeName==nodeName){
			return i;
		}
	}
	return -1;
}
/**
* 去掉字符串左右的空格
*/
function trimString(val){
	 return val.replace(/(^\s*)|(\s*$)/g, "");  
}
/**
* 根据图层获取对应的图层对象
*/
function getFrameNameLayer(layerName){
	var currentLayers = dom.getTimeline().layers;
	for(var i = 0;i<currentLayers.length;i++){
		if(currentLayers[i].name==layerName){
			return currentLayers[i];
		}
	}
	return null;
}
/**
* 开始分析及产生的资料文件
*/
function startConvert(){
	fileList = [];
	imageNum = 0;
	var layer = getFrameNameLayer(textureLayerName);
	var frames = layer.frames;
	var currentStartFrame=-1;
	var txtString = "";
	var frameItemString;
	var i = 0,l = 0;
	for(i = 0,l = frames.length;i<l;i++){
		var starFrame = frames[i].startFrame;
		if(starFrame!=currentStartFrame){
			currentStartFrame = starFrame;
			var list = getElementsByFrame(frames[i]);
			frameItemString = getFrameInfo(frames[i],list,i);
		}
		txtString += formatString(frameString,i,frameItemString);
		
	}
	for(i=0,l = fileList.length;i<l;i++){
		exportFile(fileList[i]);
	}
	saveXMLFile(formatString(textureString,txtString),getNodeXMLString());
	trace("动画需要导出的文件个数:",fileList.length);
}
/**
* 保存XML信息文件
*/
function saveXMLFile(textureStr,nodeString){
	var URI = "file:///"+basePath+prefix+ "/"+prefix+".xml";
	var fileString = formatString(xmlString,textureStr,nodeString);
	if (FLfile.write(URI, fileString)) {
		trace(URI+"生成成功");
	}
}
/**
* 得到某帧的所有Element信息及过滤需要导出的图片文件
*/
function getElementsByFrame(frame){
	var list = [];
	var nelement = frame.elements.length;
	for( var element_index = 0; element_index < nelement; ++element_index ){
		var element = frame.elements[element_index];
		var lbName = element.libraryItem.name;
		var index = indexOfElement(fileList,lbName);
		if(index<0){
			var imageName = prefix+"-"+imageNum+".png";
			imageNum++;
			fileList.push({"ele":element,"imageName":imageName});
		}
		index = indexOfElement(fileList,lbName);
		var fileName = fileList[index].imageName;
		list.push({"ele":element,"imageName":fileName});
	}
	return list;
}
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
/**
* 导出图片文件
*/
function exportFile(elementObj){
	var element = elementObj.ele;
	var item = element.libraryItem;
	trace("exportFile:",elementObj.imageName);
	//var itemName = item.name.replace(/\//g,"_");
	var URI = "file:///"+basePath+prefix+ "/" + elementObj.imageName;
	item.allowSmoothing = true;
	item.compressionType = "lossless";
	item.exportToFile(URI);
}
/**
* 创建文件夹
*/
function createDocFolder(folderURI){
	if (FLfile.createFolder(folderURI)) {
		 trace("Created " + folderURI);
	}
}
/**
* 制造并生成Element节点XML信息
*/
function getImageItemInfo(element,imageName){
	var obj ={};
	obj.image = element.libraryItem.name.replace(/\//g,"_");
	var matrixString = "{0},{1},{2},{3},{4},{5}";
	obj.matrix = formatString(matrixString,element.matrix.a,element.matrix.b,element.matrix.c,element.matrix.d,element.matrix.tx,element.matrix.ty);
	obj.width = element.width;
	obj.height = element.height;
	obj.x = element.left;
	obj.y = element.top;
	obj.depth = element.depth;
	var item = '<item image="{0}" x="{4}" y="{5}" w="{1}" h="{2}" matrix="{3}" depth="{6}" libItem="{7}" />';
	return formatString(item,imageName,obj.width,obj.height,obj.matrix,obj.x,obj.y,obj.depth,obj.image);
}
/**
* 制造并生成Frame节点XML信息
*/
function getFrameInfo(frame,list){
	var frameString = "";
	for(var i = 0,l = list.length;i<l;++i){
		var ele = list[i].ele;
		var imageName = list[i].imageName;
		var elementString = getImageItemInfo(ele,imageName);
		frameString+=elementString;
	}
	return frameString;
}
/**
* var template = "{0}欢迎你在{1}上给{0}留言，交流看法";  
* var author = "Sloppy";  
* var site = "毅睿网络";  
* var msg = formatString(template, author, site);  
*/
function formatString(src){
	 if (arguments.length == 0) return null;
	 var args = Array.prototype.slice.call(arguments, 1);
	 return src.replace(/\{(\d+)\}/g, function(m, i){
	 	return args[i];
	 });    
}
/**
* 过滤需要导出的图片并得到对应的Index
*/
function indexOfElement(arr,itemName){
	for(var i = 0,l=arr.length;i<l;++i){
		var na = arr[i].ele.libraryItem.name;
		if(na==itemName){
			return i;
		}
	}
	return -1;
}

(function(){
 	fl.outputPanel.clear();
 	dom = fl.getDocumentDOM();
 	lib = dom.library;
 	basePath= document.path.replace(document.name,"").replace(":","|").replace(/\\/g,"/");
 	prefix = dom.name.replace(".fla","");
 	createDocFolder(basePath+prefix);
 	startConvert();
 	dom.save();
 	//dom.close();
 })();