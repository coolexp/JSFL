var lib = fl.getDocumentDOM().library;
lib.addNewItem('movie clip',"mymc/start");
if (lib.getItemProperty('linkageImportForRS') == true) {
	lib.setItemProperty('linkageImportForRS', false);
}
else {
	lib.setItemProperty('linkageExportForAS', false);
}
fl.getDocumentDOM().library.selectItem('mymc/start');
fl.getDocumentDOM().library.editItem();
fl.getDocumentDOM().library.selectItem('bitmaps/acceleration0.png');
fl.getDocumentDOM().library.addItemToDocument({x:0, y:-3});
fl.getDocumentDOM().exitEditMode();

fl.getDocumentDOM().library.selectItem('mymc/start');
fl.getDocumentDOM().library.addItemToDocument({x:320, y:260});



