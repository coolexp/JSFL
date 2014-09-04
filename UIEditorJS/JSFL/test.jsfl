var dom = fl.getDocumentDOM();
var time_line = dom.getTimeline();
var nlayer = time_line.layerCount;
for( var layer_index = nlayer-1; layer_index >= 0; --layer_index ){
		var layer = time_line.layers[layer_index];

		var nframe = layer.frameCount;
		
		for( var frame_index = 0; frame_index < nframe; ++frame_index ){
			var frame = layer.frames[frame_index];
			var nelement = frame.elements.length;
			for( var element_index = 0; element_index < nelement; ++element_index ){
				var element = frame.elements[element_index];
				element.name = "test";
				var obj = getTextValue(element);
				var filterObj = getFiltersObj(element.filters);
				traceObj(filterObj);
				/*if( element.libraryItem == null ){
					continue;
				}*/
				/*trace( "第" + layer_index + "层" + layer.name + ",第" + frame_index + "帧,第" + element_index + "个元素是:" + element.name
					  + "类型[" + element.libraryItem.itemType + "]将被转换成"
					   + "实例名" + element.libraryItem.name );*/
				//trace( "类型是:[" + element.libraryItem.itemType +"]将被转换成" + this.getElementUIType( element ) );
				//trace( "实例名:" + element.libraryItem.name );
				//var exml = this.convertElement( element );
				//parentxml.addChild( exml );
			}
		}
	}
function trace( str ){
	fl.outputPanel.trace( str );
}
function getFiltersObj(a){
	//gblur="1" gblurvalue="0x000000,1,2,2,20,1"
	if(a&&a.length>0){
		var obj = a[0];
		return obj;
		/*
		name:glowFilter,enabled: true,angle: 45,blurX: 2,blurY: 2,distance: 5,color: #000000,quality: low,strength: 1000,inner: false,knockout: false,hideObject: false
		*/
	}
	return null;
}
function traceObj(obj){
		fl.trace("------------");
		for(var prop in obj){
			fl.trace(prop + ": " + obj[prop]);
		}
		fl.trace("------------");
	}
function getTextValue(element){
		var obj = {};
		obj.orientation = element.orientation;
		obj.lineType = element.lineType;
		obj.characters = "";
		for(var i = 0;i<element.textRuns.length;i++){
			var txtRun = element.textRuns[i];
			obj.characters += txtRun.characters;
			var attrs = txtRun.textAttrs;
			obj.face = attrs.face;
			obj.size = attrs.size;
			obj.bold = attrs.bold;
			obj.italic = attrs.italic;
			obj.colour = attrs.fillColor;

		}
		return obj;
	}
/*fl.outputPanel.clear();
fl.getDocumentDOM().library.addItemToDocument({x:28.5, y:30},'bitmaps/close_all0.png');
fl.getDocumentDOM().library.selectItem('bitmaps/close_all0.png');
trace(fl.getDocumentDOM().library.items[0].getData("type"));*/