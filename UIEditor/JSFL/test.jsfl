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
/*fl.outputPanel.clear();
fl.getDocumentDOM().library.addItemToDocument({x:28.5, y:30},'bitmaps/close_all0.png');
fl.getDocumentDOM().library.selectItem('bitmaps/close_all0.png');
trace(fl.getDocumentDOM().library.items[0].getData("type"));*/