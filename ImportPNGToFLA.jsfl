var dom;
var lib;
var basePath;
function createFLA(){
	dom =  fl.createDocument("timeline");
	lib = dom.library;
}
function selectFilesToImport(folderName){
	createFLA();
	//var folderURI = basePath = fl.browseForFolderURL("选择文件夹，稍后进行批量导入"); 
	var folderURI = basePath+"/"+folderName;
	var fileList=FLfile.listFolder(folderURI,"files");
	for(var i=0;i<fileList.length;i++){
		var fileName=fileList[i];
		trace("fileName",fileName);
		var ind=fileName.indexOf(".");
		if(ind<=0||ind==(fileName.length-1)) {
			continue;
		}
		var ext=fileName.substr(ind+1,fileName.length-ind);
                ext=ext.toLowerCase();
                //不是图片则略过
                if(ext!="png"){
			continue;
                }
		var shortName=fileName.substr(0,ind);
                var filePath=folderURI+"/"+fileName;
                fl.trace(filePath);
                //导入图片
                dom.importFile(filePath,true);
	}
	createSWFAndFLA(folderName);
}
function createSWFAndFLA(folderName){
	var fileURL =basePath+"/"+folderName+"/"+folderName+"_pngs";
	linkBitmap();
	dom.exportSWF(fileURL+".swf",true);
	fl.saveDocument(dom,fileURL+".fla");
	dom.close(false);
}
function trace(){
	var arg = Array.prototype.slice.call(arguments);
	var str = arg.join(",");
	fl.trace(str);
}
function listFoldersHandler(){
	var folderURI = basePath = fl.browseForFolderURL("选择文件夹，稍后进行批量导入");
	var fileList = FLfile.listFolder(folderURI, "directories");
	for(var i=0;i<fileList.length;i++){
		var folderName=fileList[i];
		selectFilesToImport(folderName);
	}
}
function linkBitmap(){
	var item;
	var lenLib = lib.items.length;
	for (i=0; i<lenLib; i++) {
		item = lib.items[i];
		if(item.itemType == "bitmap") {
			item.linkageExportForAS = true;
			item.linkageExportInFirstFrame = true;
			item.linkageBaseClass = "flash.display.BitmapData";
			var className = item.name.substr(0, item.name.lastIndexOf("."));
			className = "com.eray.swc.animation."+className.replace("/", ".");
			item.linkageClassName = className;
		}
	}
}
function clear(){
	fl.outputPanel.clear();
}
(function(){
	clear();
	listFoldersHandler();
	
 })();