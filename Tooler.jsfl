function arrageHandler(){
	var bitmapsFolderName = "bitmaps";
	var mcFolderName = "mcs";
	var dom = fl.getDocumentDOM();
	var currentLibrary = dom.library;
	createFolderByName(bitmapsFolderName);
	createFolderByName(mcFolderName);
	var a = currentLibrary.items;
	for(var i = 0;i<a.length;i++){
		var item = a[i];
		if(item.itemType == "bitmap"){
			currentLibrary.moveToFolder(bitmapsFolderName, item.name, true); 
		}else if(item.itemType=="movie clip"){
			currentLibrary.moveToFolder(mcFolderName, item.name, true); 
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
arrageHandler();
