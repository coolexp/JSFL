//lib.addNewItem('movie clip',"mymc/start");//bitmaps/acceleration0.png,bitmaps/acceleration1.png
var UIEditor = {};
UIEditor.num = 0;
UIEditor.MOVIE_CLIP = "movie clip";
UIEditor.getAllElements = function(){
	var dom = fl.getDocumentDOM();
	var time_line = dom.getTimeline();
	var nlayer = time_line.layerCount;
	var a = [];
	for( var layer_index = nlayer-1; layer_index >= 0; --layer_index ){
		var layer = time_line.layers[layer_index];

		var nframe = layer.frameCount;
		
		for( var frame_index = 0; frame_index < nframe; ++frame_index ){
			var frame = layer.frames[frame_index];
			
			var nelement = frame.elements.length;
			for( var element_index = 0; element_index < nelement; ++element_index ){
				var element = frame.elements[element_index];
				var obj = {name:"",x:0,y:0,ele:null};
				if(element.name==""){
					UIEidtor.num++;
					element.name = "element_"+UIEditor.num;
				}
				obj.name = element.name;
				obj.x = element.x;
				obj.y = element.y;
				obj.width = element.width;
				obj.height = element.height;
				obj.ele = element;
				obj.layerIndex = layer_index;
				obj.frameIndex = frame_index;
				obj.eleIndex = element_index;
				a.push(obj);
			}
		}
	}
	return a;
};
UIEditor.createItemToLib = function(t,path,mcname){
	var lib = fl.getDocumentDOM().library;
	if(t==UIEidtor.MOVIE_CLIP){
		UIEditor.createMC(path,mcname);
	}
};
UIEditor.createMC = function(path,mcname,alignstr){
	if(alignstr==null){
		alignstr="top left";
	}
	var lib = fl.getDocumentDOM().library;
	lib.addNewItem('movie clip',"tempmc");
	if (lib.getItemProperty('linkageImportForRS') == true) {
		lib.setItemProperty('linkageImportForRS', false);
	}
	else {
		lib.setItemProperty('linkageExportForAS', false);
		lib.setItemProperty('linkageExportForRS', false);
	}

	fl.getDocumentDOM().library.addItemToDocument({x:0, y:0});
	fl.getDocumentDOM().convertToSymbol('movie clip', mcname, alignstr);
	var lib = fl.getDocumentDOM().library;
	if (lib.getItemProperty('linkageImportForRS') == true) {
		lib.setItemProperty('linkageImportForRS', false);
	}
	else {
		lib.setItemProperty('linkageExportForAS', false);
		lib.setItemProperty('linkageExportForRS', false);
	}
	lib.setItemProperty('scalingGrid',  false);
	lib.deleteItem("tempmc");
	fl.getDocumentDOM().exitEditMode();
	fl.getDocumentDOM().library.moveToFolder(path);
	fl.getDocumentDOM().setSelectionRect({left:-1, top:-1, right:1, bottom:1}, true, true);
	fl.getDocumentDOM().deleteSelection();
};
UIEditor.editLibItem = function(path,texturelist){
	fl.getDocumentDOM().library.selectItem(path);
	fl.getDocumentDOM().library.editItem();
	for(var i = 0;i<texturelist.length;i++){
		fl.getDocumentDOM().library.selectItem(texturelist[i]);
		fl.getDocumentDOM().library.addItemToDocument({x:0, y:0});
		fl.getDocumentDOM().getTimeline().insertBlankKeyframe();
	}
	fl.getDocumentDOM().getTimeline().clearFrames();
	fl.getDocumentDOM().exitEditMode();
};
UIEditor.addItemToScene = function(path,rec){
	fl.getDocumentDOM().library.selectItem(path);
	fl.getDocumentDOM().library.addItemToDocument({x:rec.x, y:rec.y});
}
UIEditor.addTxt = function(obj){
	fl.getDocumentDOM().addNewText({left:0,top:0,right:100,bottom:50});
	fl.getDocumentDOM().setTextString(obj.text);
};
UIEditor.formatTxt = function(){

};
UIEditor.addTxt({text:"出发了"});
//UIEditor.createItemToLib('movie clip',"mymc","start");
//UIEditor.editLibItem("mymc/start",["bitmaps/acceleration0.png","bitmaps/acceleration1.png"]);
//UIEditor.addItemToScene("mymc/start",{x:100,y:100});
