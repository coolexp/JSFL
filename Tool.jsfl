var TEXTURE_ATLAS = "TextureAtlas";
var SUB_TEXTURE = "SubTexture";
var A_NAME = "name";
var AT = "@";
var A_WIDTH = "width";
var A_HEIGHT = "height";
var A_PIVOT_X = "pX";
var A_PIVOT_Y = "pY";
var helpPoint = {x:0, y:0};
var MOVIE_CLIP = "movie clip";
var A_X = "x";
var A_Y = "y";
function formatNumber(_num, _retain){
	_retain = _retain || 100;
	return Math.round(_num * _retain) / 100;
}
var Tool = {};
Tool.list = [];
Tool.getAllElements =function(){
	Tool.list = [];
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
				Tool.list.push(element);
			}
		}
	}
};
Tool.resetAllEleToOriginalPT = function (){
	Tool.getAllElements();
	var a = Tool.list;
	for(var i = 0;i<a.length;i++){
		var ele = a[i];
		ele.x = 0;
		ele.y = 0;
	}
};
Tool.getLayerFrameInfo = function(indexNum){
	var dom = fl.getDocumentDOM();
	var time_line = dom.getTimeline();
	var nlayer = time_line.layerCount;
	if(indexNum==null){
		indexNum=0;
	}
	var layer = time_line.layers[indexNum];
	var nframe = layer.frameCount;
	var frameName="";
	var infoList = [];
	for( var frame_index = 0; frame_index < nframe; ++frame_index ){
		var frame = layer.frames[frame_index];
		if(frame.name!=frameName){
			frameName = frame.name;
			if(infoList.length>0){
				infoList[infoList.length-1].to = frame_index-1;
			}
			var obj = {key:frameName,from:frame_index};
			infoList.push(obj);
		}
	}
	if(infoList.length>0){
		infoList[infoList.length-1].to = nframe;
	}
	this.traceObj(infoList);
};
Tool.trace = function(){
	var arg = Array.prototype.slice.call(arguments);
	var str = arg.join(",");
	fl.trace(str);
};
Tool.isArray = function(value){
	return Object.prototype.toString.call(value) === '[object Array]';
};
Tool.traceObj = function(obj){
	this.trace("------------");
	var isA = this.isArray(obj);
	if(isA){
		this.traceArray(obj);
	}else{
		for(var prop in obj){
			this.trace(prop + ": " + obj[prop]);
		}
	}
	this.trace("------------");
}
Tool.traceArray = function(a){
	for(var i = 0;i<a.length;i++){
		var obj = a[i];
		this.traceObj(obj);
	}
};
Tool.clear = function(){
	var currentDom = fl.getDocumentDOM();
	var _timeline = currentDom.getTimeline();
	_timeline.currentLayer = 0;
	_timeline.removeFrames(0, _timeline.frameCount);
	_timeline.insertBlankKeyframe(0);
	_timeline.insertBlankKeyframe(1);
}
Tool.addTextureToSWFItem = function(_textureName, _isLast){
	var currentDom = fl.getDocumentDOM();
	var currentLibrary = currentDom.library;
	var _item = currentLibrary.items[currentLibrary.findItemIndex(_textureName)];
	if(!_item){
		return false;
	}
	
	var _timeline = currentDom.getTimeline();
	
	_timeline.currentFrame = 0;
	helpPoint.x = helpPoint.y = 0;
	var _putSuccess;
	var _tryTimes = 0;
	do{
		_putSuccess = currentLibrary.addItemToDocument(helpPoint, _textureName);
		_tryTimes ++;
	}while(!_putSuccess && _tryTimes < 5);
	if(!_putSuccess){
		trace("内存不足导致放置贴图失败！请尝试重新导入。");
		return false;
	}
	
	_symbol = currentDom.selection[0];
	if(_symbol.symbolType != MOVIE_CLIP){
		_symbol.symbolType = MOVIE_CLIP;
	}
	var _subTextureXML = <{SUB_TEXTURE} {A_NAME} = {_textureName}/>;
	_subTextureXML[AT + A_PIVOT_X] = formatNumber(_symbol.x - _symbol.left);
	_subTextureXML[AT + A_PIVOT_Y] = formatNumber(_symbol.y - _symbol.top);
	_subTextureXML[AT + A_WIDTH] = Math.ceil(_symbol.width);
	_subTextureXML[AT + A_HEIGHT] = Math.ceil(_symbol.height);
	
	if(_isLast){
		_timeline.removeFrames(1, 1);
	}else{
		_timeline.currentFrame = 1;
	}
	return _subTextureXML.toXMLString();
}
Tool.getAllElement = function(itemName){
	var currentDom = fl.getDocumentDOM();
	var currentLibrary = currentDom.library;
	var _textureItem = currentLibrary.items[currentLibrary.findItemIndex(itemName)];
	var _timeline = _textureItem.timeline;
	_timeline.currentFrame = 0;
	var xml = <{TEXTURE_ATLAS}/>;
	var index = 0;
	var a = _textureItem.timeline.layers[0].frames[0].elements;
	for each(var _texture in a){
		if(_texture.elementType=="instance"){
			if(_texture.libraryItem.itemType=="movie clip"){
				var isLast = false;
				index++;
				if(index==a.length){
					isLast = true;
				}else{
					isLast = false;
				}
				var str = this.addTextureToSWFItem(_texture.libraryItem.name,isLast);
				var textureXML = XML(str);
				xml.appendChild(textureXML);
				_texture.x += Number(textureXML[AT + A_X]) - _texture.left;
				_texture.y += Number(textureXML[AT + A_Y]) - _texture.top;
				textureXML[AT + A_X] = _texture.x;
				textureXML[AT + A_Y] = _texture.y;
			}
		}
		
	}
	this.clear();
	currentDom.selectAll();
	currentDom.selectNone();
	fl.trace(xml.toXMLString());
}
Tool.getAllElement("textureSWFItem");
//Tool.resetAllEleToOriginalPT();
Tool.getLayerFrameInfo();