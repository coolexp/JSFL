
function createAnTempMC(){
	var itemExit = lib.itemExists(tempMC);
	if(!itemExit){
		lib.addNewItem(MOVIECLIP,tempMC);
		if (lib.getItemProperty('linkageImportForRS') == true) {
			lib.setItemProperty('linkageImportForRS', false);
		}
		else {
			lib.setItemProperty('linkageExportForAS', false);
			lib.setItemProperty('linkageExportForRS', false);
		}
		fl.getDocumentDOM().exitEditMode();
	}
}
function selectFrames(start,end){
	fl.getDocumentDOM().getTimeline().setSelectedFrames(start, end);
}
function f(index,na){
	var currentLayers = fl.getDocumentDOM().getTimeline().layers;
	if(currentLayers.length<=0){
		addNewLayer(na);
	}else{
		var layer = currentLayers[index];
		layer.name = na;
	}
}
function addNewLayer(layerName){
	fl.getDocumentDOM().getTimeline().addNewLayer(layerName);
}
function delAllEle(){
	fl.getDocumentDOM().selectAll();
	var isSelect = hasSelection();
	if(isSelect){
		fl.getDocumentDOM().deleteSelection();
	}
}
function hasSelection(){
	var theSelectionArray = fl.getDocumentDOM().selection;
	if(theSelectionArray&&theSelectionArray.length>0){
		return true;
	}
	return false;
}
function getSelections(){
	var doc = fl.getDocumentDOM();
	var selections = doc.selection;
	return selections.length;
}
function  createMC(path,mcname,alignstr,isPasteFrame,a){
	//delAllEle();
	dom.library.addItemToDocument({x:0,y:0},tempMC);
	dom.convertToSymbol(MOVIECLIP, mcname, "top left");
	var lib = fl.getDocumentDOM().library;
	if (lib.getItemProperty('linkageImportForRS') == true) {
		lib.setItemProperty('linkageImportForRS', true);
	}
	else {
		lib.setItemProperty('linkageImportForRS', false);
		lib.setItemProperty('linkageExportInFirstFrame ', false);
	}
	lib.setItemProperty('scalingGrid',  false);
	dom.enterEditMode('inPlace');
	dom.getTimeline().setSelectedLayers(0);
	dom.getTimeline().deleteLayer();
	if(isPasteFrame){
		if(a!=null){
			dom.getTimeline().pasteLayers();
			dom.getTimeline().setSelectedLayers(1);
			dom.getTimeline().deleteLayer();
			var start = a[0];
			var end = a[1];
			dom.getTimeline().copyFrames(start,end);
			dom.getTimeline().setSelectedLayers(0);
			dom.getTimeline().deleteLayer();
			dom.getTimeline().pasteFrames(0);
		}else{
			dom.getTimeline().pasteLayers();
			deleOldLayer();
		}
	}
	//renameLayers(0,comps);
	if(!lib.itemExists(path)){
		lib.newFolder(path);
	}
	lib.selectItem(mcname);
	dom.library.moveToFolder(path);
	dom.exitEditMode();
}
function deleOldLayer(){
	var currentLayers = fl.getDocumentDOM().getTimeline().layers;
	dom.getTimeline().setSelectedLayers(currentLayers.length-1);
	dom.getTimeline().deleteLayer();
}
function getLayerByIndex(index){
	var currentLayers = fl.getDocumentDOM().getTimeline().layers;
	return currentLayers[index];
}
function getSelectFrameIndex(){
	var index = 0;
	dom.getTimeline().setSelectedLayers(index);
	var layer = getLayerByIndex(index);
	var frames = layer.frames;
	var a = [];
	a.push(startIndex);
	trace("frames.length "+frames.length);
	if(startIndex<frames.length){
		mcName = frames[startIndex].name;
	}else{
		trace("转换结束");
		startIndex = 0;
		return a;
	}
	for(var i = startIndex,l = frames.length;i<l;i++){
		var frameName = frames[i].name;
		if(frameName!=mcName){
			if(a.length==1){
				var index = i;
				if(i==frames.length-1){
					index = i+1;
				}
				a.push(index);
				startIndex = i;
				break;
			}
		}
	}
	return a;
}
function arrageHandler(){
	var bitmapsFolderName = "bitmaps";
	var dom = fl.getDocumentDOM();
	var currentLibrary = dom.library;
	createFolderByName(bitmapsFolderName);
	var a = currentLibrary.items;
	for(var i = 0;i<a.length;i++){
		var item = a[i];
		if(item.itemType == "bitmap"){
			currentLibrary.moveToFolder(bitmapsFolderName, item.name, true);
		}
	}
}
function deleMCS(){
	var dom = fl.getDocumentDOM();
	var currentLibrary = dom.library;
	var a = currentLibrary.items;
	for(var i = 0;i<a.length;i++){
		var item = a[i];
		if(item.itemType == "movie clip"){
			dom.library.deleteItem(item.name);
		}
	}
}
function createFolderByName(foldeName){
	var dom = fl.getDocumentDOM();
	var currentLibrary = dom.library;
	var isExitBitmapsFolder = (currentLibrary.itemExists(foldeName));
	if(!isExitBitmapsFolder){
		currentLibrary.newFolder(foldeName);
	}
}
function startNewMC(a,isAll,newMCName){
	if(isAll){
		dom.getTimeline().setSelectedLayers(0);
		dom.getTimeline().setSelectedLayers(1,false);
		fl.getDocumentDOM().getTimeline().copyLayers();
		//dom.getTimeline().selectAllFrames();
		//dom.getTimeline().copyFrames();
		createMC("mcs","eray_all",null,true,null);
	}else{
		var start = a[0];
		var end = a[1];
		dom.getTimeline().setSelectedLayers(1);
		fl.getDocumentDOM().getTimeline().copyLayers();
		//dom.getTimeline().copyFrames(start,end);
		createMC("mcs","eray_"+newMCName,null,true,a);
	}

}
function trace(){
	var arg = Array.prototype.slice.call(arguments);
	var str = arg.join(",");
	fl.trace(str);
}
function clear(){
	fl.outputPanel.clear();
}
function convertToMC(){
	var a = getSelectFrameIndex();
	trace("mcName: "+mcName+" : "+a);
	if(a.length==2){
		var listMc = mcName.split(",");
		for(var i = 0;i<listMc.length;i++){
			startNewMC(a,false,listMc[i]);
			dom.deleteSelection();
		}
		convertToMC();
	}else{
		startNewMC(null,true);
		dom.deleteSelection();
		deleteLayers();
		reLinkHandler();
		dom.publish();
	}
}
function deleteLayers(){
	var currentLayers = dom.getTimeline().layers;
	for(var i = 0;i<currentLayers.length;i++){
		dom.getTimeline().deleteLayer(0);
	}
}
function unlockLayers(){
	var currentLayers = dom.getTimeline().layers;
	for(var i = 0;i<currentLayers.length;i++){
		var layer = currentLayers[i];
		fl.trace(layer.name);
		layer.locked = false;
	}
}
function reLinkHandler(){
	clear();
	var lib = dom.library;
	var lenLib = lib.items.length;
	var item;
	for (i=0; i<lenLib; i++) {
		item = lib.items[i];
		if(item.itemType == "movie clip") {
			if(item.name=="tempmc"){

			}else{
				item.linkageExportForAS = true;
				item.linkageExportInFirstFrame = true;
				item.linkageBaseClass = "flash.display.MovieClip";
				var className = item.name.substr(0, item.name.lastIndexOf("."));
				className = className.replace("/", ".");
				item.linkageClassName = className;
			}

		}
	}
	delTem();
}
function delTem(){
	var lib = dom.library;
	var lenLib = lib.items.length;
	var item;
	for (i=0; i<lenLib; i++) {
		item = lib.items[i];
		if(item.itemType == "movie clip") {
			if(item.name=="tempmc"){
				dom.library.selectItem(item.name);
				dom.library.deleteItem();
				return;
			}
		}
	}
}
var dom;
var lib;
var tempMC = "tempmc";
var MOVIECLIP = "movie clip";
var comps = "comps";
var startIndex = 0;
var mcName = "";
function init(){
	dom =fl.getDocumentDOM();
	lib = dom.library;
	tempMC = "tempmc";
	startIndex = 0;
	mcName = "";
}
function selectFolder(){
	fl.outputPanel.clear();
	var folderURI = fl.browseForFolderURL("选择模型文件夹，稍后进行批量转化");
	var folderContents = FLfile.listFolder(folderURI,"files");
	var saveDir = "file:///D:/saveFolder/";  //转化后保存目录
	if( FLfile.exists(saveDir)==false ){
		FLfile.createFolder(saveDir);
	}
	try{
	 var fileName ;
	 for each(var o in folderContents){
	  if(o.indexOf('fla')>=0) {
	   fileName = folderURI+'/'+o;
	   openFLATOConvert(fileName);
	   trace(fileName);
	  }
	 }
	}catch(e){
	 alert("部分fla文件有异常"+e);
	}
	delHTMLHandler(FLfile.listFolder(folderURI,"files"),folderURI);
}
function delHTMLHandler(folderContents,folderURI){
	try{
		 var fileName ;
		 for each(var o in folderContents){
			 if(o.indexOf('.html')>=0) {
				fileName = folderURI+'/'+o;
				FLfile.remove(fileName);
			 }
		 }
	}catch(e){
		alert("部分fla文件有异常"+e);
	}
}
function openFLATOConvert(fileUrl){
	var doc = fl.openDocument(fileUrl);
	fl.outputPanel.trace(doc.name);
	packageOneItem();
	fl.saveAll();
	fl.closeDocument(doc,false);
	//FLfile.remove(fileUrl);
}
function packageOneItem(){
	init();
	unlockLayers();
	clear();
	deleMCS();
	createAnTempMC();
	arrageHandler();
	convertToMC();
}
packageOneItem()
/*selectFolder();*/
