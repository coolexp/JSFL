fl.outputPanel.clear();
var folderURI = fl.browseForFolderURL("选择模型文件夹，稍后进行批量转化");
var folderContents = FLfile.listFolder(folderURI,"files");

var fileName ;
for each(var o in folderContents){
	if(o.indexOf('.xml')>=0) {
		fileName = folderURI+'/'+o;
		openXML(fileName);
		fl.trace(fileName);
	}
}
function openXML(xmlURL){
	var xmlStr = FLfile.read(xmlURL);
	xmlStr = xmlStr.substring(xmlStr.indexOf("-->")+3);
	var xml = XML(xmlStr);
	if(xml.nodes.children().length()>0){
		fl.trace("ss");
	}
}
