var dom = fl.getDocumentDOM();
var lib = dom.library;
var items = lib.items;
var folderName = "bitmaps";
if( ! lib.itemExists(folderName) ) lib.newFolder(folderName);
/*for(var i=0; i<lib.items.length; i++){
	var o = lib.items[i];
	if(o.itemType=="bitmap"){
		lib.moveToFolder(folderName, o.name);
	}
}*/
var folderTypes = new Array();
folderTypes['bitmaps'] = "bitmap";
folderTypes['mcs'] = "movie clip";
folderTypes['graphics'] = "graphic";
folderTypes['audio'] = "sound";
folderTypes['fonts'] = "font";
for(var type in folderTypes) {
	if(!lib.itemExists(type)){
		lib.newFolder(type);
	}
	for(var i=0; i<lib.items.length; i++){
		var o = lib.items[i];
		if(o.itemType==folderTypes[type]){
			lib.moveToFolder(type, o.name);
		}
	}
}
/*for(var type in folderTypes) {
	var folderName = type;
	var itemType = folderTypes[folderName];
	if(o.itemType==itemType){
		lib.moveToFolder(folderName, o.name);
	}
}*/
alert('this is an alert');
var success = confirm('Are you sure you want to do this?');
if (success) {
//do something
} else {
//do something else
}