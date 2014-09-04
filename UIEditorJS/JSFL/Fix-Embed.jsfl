function fix_embed(doc){
	
	var library=doc.library;
	var items=library.items;
	var items_length=items.length;
	for( var i = 0; i < items_length; i++){
		var item=items[i];
		
		//if library item is a movieclip
		if(item.itemType=='movie clip'){
			var timeline=item.timeline;
			
			var layers=timeline.layers;
			var layers_length=layers.length;
			for(var j = 0; j < layers_length; j++){
				var layer=layers[j];
				
				var frames=layer.frames;
				var frames_length=frames.length;
				for(var k = 0 ; k < frames_length ; k++){
					var frame = frames[k];
					
					var elements=frame.elements;
					var elements_length=elements.length;
					for(var l = 0 ; l < elements_length ; l++){
						var element = elements[l];
						if(element.elementType=='text'){
							if(element.textType!='static'){
								
								//uppercase |  lowercase | numerals | ponctuation | basic latin
								element.embedRanges='1|2|3|4|5';
								
								//some accentuation, you can alter this at your will to add or remove characters
								element.embeddedCharacters='âÂáÁêÊéÉíÍóÓúÚãÃõÕçÇüÜöÖàÀôÔ°¹²³£¢$¬ªºÄäËëïïöÖüÜ–';
								
							}
						}
					}
				}
			}
		}
	}
}

//fix embed from current document
fix_embed(fl.getDocumentDOM());