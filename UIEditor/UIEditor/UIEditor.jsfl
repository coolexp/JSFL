var UIEditor = {};
(function(){
	 UIEditor.apply = function(object, config, defaults) {
		if (defaults) {
			UIEditor.apply(object, defaults);
		}
		if (object && config && typeof config === 'object') {
			var i;
			for (i in config) {
				object[i] = config[i];
			}
		}
		return object;
	};
	var arr = [];
	UIEditor.trace = function(){
		var arg = Array.prototype.slice.call(arguments);
		var str = arg.join(",");
		fl.trace(str);
	}
	UIEditor.isRound = 1;
	UIEditor.getSelectComponentInfo = function(select){
		var selections;
		arr = [];
		if(select=="select"){
			var doc = fl.getDocumentDOM();
			selections = doc.selection;
			getComponentsInfo(selections,arr);
		}else{
			var dom = fl.getDocumentDOM();
			var time_line = dom.getTimeline();
			selections = getTimeLineElements(time_line);
			getComponentsInfo(selections,arr);
		}
		return JSON.stringify(arr);
	}
	UIEditor.logAllInfo = function(){
		var a = arr[0].children[4].children;
		for(var i = 0;i<a.length;i++){
			var prop = a[i];
			var output = "";
			output += outputPropVar(prop) + outputPropPos(prop) + outputPropSize(prop)+outPropTexture(prop);
			if(prop.class == "SimpleButton"&&prop.txt){
				UIEditor.traceObj(prop.txt);
			}
			UIEditor.trace(output);
		}
	};
	function getTimeLineElements(time_line){
		var list = [];
		var nlayer = time_line.layerCount;
		for( var layer_index = nlayer-1; layer_index >= 0; --layer_index ){
			var layer = time_line.layers[layer_index];
			var nframe = layer.frameCount;
			for( var frame_index = 0; frame_index < nframe; ++frame_index ){
				var frame = layer.frames[frame_index];
				var nelement = frame.elements.length;
				for( var element_index = 0; element_index < nelement; ++element_index ){
					var element = frame.elements[element_index];
					list.push(element);
				}
			}
		}
		return list;
	}
	function getElementInfo(ele){
		if(ele.elementType == "instance" || ele.elementType == "text"){
			var prop = {name:"instance", x:0, y:0, width:0, height:0, class:"DisplayObject"};
			prop.name = ele.name;
			prop.x = UIEditor.isRound==1?Math.round(ele.x):ele.x;
			prop.y = UIEditor.isRound==1?Math.round(ele.y):ele.y;
			prop.width = UIEditor.isRound==1?Math.round(ele.width):ele.width;
			prop.height = UIEditor.isRound==1?Math.round(ele.height):ele.height;
			if(ele.elementType == "text"){
				prop.class = "TextField";
				prop.filterobj = getFiltersObj(ele.filters);
				prop.txt = getTextValue(ele);
				//UIEditor.apply(prop,getTextValue(ele));
			}else{
				if(ele.instanceType == "symbol"){
					var libItem = ele.libraryItem;
					if(libItem.linkageExportForAS){
						prop.class = libItem.linkageClassName;
						if(prop.class.lastIndexOf(".")>-1){
							prop.class = prop.class.substring(prop.class.lastIndexOf(".")+1);
						}
					}else{
						prop.texture = libItem.name;
						switch(ele.symbolType){
							case "button":
								prop.class = "SimpleButton";
								prop.texturelist = getTextureList(ele);
								prop.txt = getButtonTxt(ele);
								prop.filterobj = getButtonFilter(ele);
								break;
							case "movie clip":
								prop.class = "Sprite";
								var scale9Grid = getScale9GridInfo(libItem);
								if(scale9Grid){
									prop.class = "ScaleBitmap";
									prop.scale9Grid = scale9Grid;
								}else{
									var mcType = isSIOrTBTN(ele);
									if(mcType=="si"){
										prop.class = "StateImage";
										prop.texturelist = getTextureList(ele);
									}else if(mcType=="tbtn"){
										prop.class = "ToggleButton";
										prop.texturelist = getTextureList(ele);
										prop.filterobj = getButtonFilter(ele);
									}else if(mcType=="cmc"){
										prop.class = "CLoading";
									}else{
										//rec;
										prop.children = [];
										var time_line = libItem.timeline;
										var selections = getTimeLineElements(time_line);
										getComponentsInfo(selections,prop.children);
										//UIEditor.trace(prop.children,ele.name);
									}
								}
								break;
							case "graphic":
								prop.class = "DisplayObject";
								break;
						}
					}
				}else if(ele.instanceType=="bitmap"){
					prop.class="Image";
					prop.texture = ele.libraryItem.name;
				}
			}
			return prop;
		}
	}
	function getComponentsInfo(selections,list){
		for(var i=0; i<selections.length; i++){
			var ele = selections[i];
			var prop = getElementInfo(ele);
			list.push(prop);
		}
	}
	function debugAllList(props){
		for(i=0; i<props.length; i++){		
			var prop = props[i];
			var output = "";
			output += outputPropVar(prop) + outputPropPos(prop) + outputPropSize(prop);
			if(prop.texture){
				output+=outPropTexture(prop);
			}
			strlist.push(output);
			if(prop.children){
				debugAllList(prop.children);
			}
		}
	}

	function traceArray(a){
		if(a){
			for(var i = 0;i<a.length;i++){
				UIEditor.traceObj(a[i]);
			}
		}else{
			UIEditor.trace("a is not array");
		}
	}
	function getScale9GridInfo(item){
		if (item.scalingGrid) {
			var grid = item.scalingGridRect;
			grid = {sx:grid.left, sy:grid.top, sw:grid.right-grid.left, sh:grid.bottom-grid.top};
			return grid;
		}
		return null;
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
	function isSIOrTBTN(element){
		var iType = "";
		var time_line = element.libraryItem.timeline;
		var nlayer = time_line.layerCount;
		for( var layer_index = nlayer-1; layer_index >= 0; --layer_index ){
			var layer = time_line.layers[layer_index];
			var nframe = layer.frameCount;
			if(nframe>20){
				iType="cmc";
				break;
			}else{
				var frame = layer.frames[0];
				if(frame.name=="si"){
					iType="si";
					break;
				}else if(frame.name=="tbtn"){
					iType="tbtn";
					break;
				}
			}
		}
		return iType;
	}
	function getTextureList(element){
		var list = [];
		var time_line = element.libraryItem.timeline;
		var nlayer = time_line.layerCount;
		for( var layer_index = nlayer-1; layer_index >= 0; --layer_index ){
			var layer = time_line.layers[layer_index];
			var nframe = layer.frameCount;
			for( var frame_index = 0; frame_index < nframe; ++frame_index ){
				var frame = layer.frames[frame_index];
				var nelement = frame.elements.length;
				for( var element_index = 0; element_index < nelement; ++element_index ){
					var ele = frame.elements[element_index];
					if(ele.instanceType=="bitmap"){
						list.push(ele.libraryItem.name);
					}
				}
			}
		}
		return list;
	}
	function getButtonTxt(element){
		var time_line = element.libraryItem.timeline;
		var layerIndex = time_line.findLayerIndex("txt");
		if(layerIndex!=null){
			var layer = time_line.layers[layerIndex];
			var frame = layer.frames[0];
			var ele = frame.elements[0];
			return getTextValue(ele);
		}
		return null;
	}
	function getButtonFilter(element){
		var time_line = element.libraryItem.timeline;
		var layerIndex = time_line.findLayerIndex("txt");
		if(layerIndex!=null){
			var layer = time_line.layers[layerIndex];
			var frame = layer.frames[0];
			var ele = frame.elements[0];
			return getFiltersObj(ele.filters);
		}
		return null;
	}
	function addFrameName(fileName,frameCount)
	{		
		var tl = fl.getDocumentDOM().getTimeline();
		var nlayer = tl.layerCount;
		fl.outputPanel.clear();
		for( var layer_index = nlayer-1; layer_index >= 0; --layer_index ){
			tl.layers[layer_index].frames[frameCount].name=fileName;
		}
		/* var index = tl.findLayerIndex("帧标签");
		 if(index == undefined)
		 {
				   tl.addNewLayer();
				   tl.layers[0].name="帧标签";
				   tl.layers[0].frames[0].actionScript = "stop();"
		 }
		 else
		 {
				   tl.setSelectedLayers(index[0], true);
		 }
		 fl.outputPanel.trace(frameCount);
		 tl.setSelectedFrames([0,frameCount,frameCount],true);
		 doc.selectNone();
		 tl.convertToBlankKeyframes(frameCount);
		 fileName = fileName.substring(0, fileName.lastIndexOf('.'));
		 tl.layers[0].frames[frameCount].name=fileName;
		 tl.layers[0].frames[frameCount].labelType="name";*/
	}
	function maxNum(n1,n2){
		return n1>n2?n1:n2;
	}
	function minNum(n1,n2){
		return n1>n2?n2:n1;
	}
	function outputPropVar(prop){
		var str = "";
		var instanceName = (prop.name=="")?("instance"):(prop.name);
		str += "private var " + instanceName + ":" + prop.class + " = new " + prop.class + "();\n"; 
		return str;
	}

	function outputPropPos(prop){
		var str = "";
		var instanceName = (prop.name=="")?("instance"):(prop.name);
		var posX = (true)?String(Math.round(prop.x)):prop.x;
		var posY = (true)?String(Math.round(prop.y)):prop.y;
		str += instanceName + ".x" + " = " + posX + ";\n";
		str += instanceName + ".y" + " = " + posY + ";\n";
		if(prop.texturelist&&prop.texturelist.length>0){
			str += instanceName + ".texturelist"+" = "+prop.texturelist.join(",")+";\n"
		}
		return str;
	}

	function outputPropSize(prop){
		var str = "";
		var instanceName = (prop.name=="")?("instance"):(prop.name);
		var sizeW = (true)?String(Math.round(prop.width)):prop.width;
		var sizeH = (true)?String(Math.round(prop.height)):prop.height;
		str += instanceName + ".width" + " = " + sizeW + ";\n";
		str += instanceName + ".height" + " = " + sizeH + ";\n";
		return str;
	}
	function outPropTexture(prop){
		var str = "";
		var instanceName = (prop.name=="")?("instance"):(prop.name);
		str += instanceName + ".texture" + " = " + prop.texture + ";\n";
		return str;
	}

	//-----debug function------
	UIEditor.traceObj = function(obj){
		fl.trace("------------");
		for(var prop in obj){
			fl.trace(prop + ": " + obj[prop]);
		}
		fl.trace("------------");
	}
 })();