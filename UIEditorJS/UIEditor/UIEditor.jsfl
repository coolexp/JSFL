var UIEditor = {};
UIEditor.MOVIE_CLIP = "movie clip";
UIEditor.BUTTON = "button";
UIEditor.IMAGE = "image";
UIEditor.SCALE9GRID = "scale9grid";
UIEditor.STATEIMAGE = "si";
UIEditor.TOGGLEBUTTON = "tbtn";
UIEditor.TEXT = "text";
UIEditor.TEXT_LAYERNA = "txt";
UIEditor.TEMPMC = "tempmc";
UIEditor.PGB= "pgb";
UIEditor.currentStep = -1;
UIEditor.moduleObj = null;
UIEditor.isReady = false;
UIEditor.BTN = "btn";
UIEditor.list = [];
UIEditor.QUENE = [];
(function(){
	UIEditor.isRound = 1;
	var arr = [];
	var selection = null;
	var index = 0;
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
	UIEditor.trace = function(){
		var arg = Array.prototype.slice.call(arguments);
		var str = arg.join(",");
		fl.trace(str);
	}
	UIEditor.getSelectComponentInfo = function(select){
		fl.outputPanel.clear();
		var selections;
		arr = [];
		if(select=="select"){
			var doc = fl.getDocumentDOM();
			selections = doc.selection;
			var a = [];
			for(var i = 0;i<selections.length;i++){
				var eleObj = {"ele":selections[i],"depth":selections[i].depth};
				a.push(eleObj);
			}
			getComponentsInfo(a,arr);
		}else{
			var dom = fl.getDocumentDOM();
			var time_line = dom.getTimeline();
			//selections = getTimeLineElements(time_line);
			selections = getDomTimeELemenets();
			getComponentsInfo(selections,arr);
		}
		var str = JSON.stringify(arr);
		//UIEditor.trace(str);
		return str;
	}
	function getDomTimeELemenets(){
		var list = [];
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
					var eleObj = {"ele":element,"depth":element.depth};
					list.push(eleObj);
				}
			}
		}
		dom.exitEditMode();
		return list;
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
	UIEditor.createUI = function(mStr){
		fl.outputPanel.clear();
		this.moduleObj = JSON.parse(mStr);
		this.list = [];
		if(this.moduleObj){
			createTempMC();
			var a = this.moduleObj.data;
			this.getChildren(a);
			delAllEle();
			UIEditor.trace("list: ",this.list.length);
		}
	};
	
	UIEditor.loop = function(){
		if(this.currentStep==-1){
			var fatherMCName = this.moduleObj.moduleName;
			this.initFatherMC(fatherMCName);
			this.currentStep++;
			return 0;
		}
		if(this.currentStep<this.list.length){
			var obj = this.list[this.currentStep];
			this.createOneItem(obj);
			//UIEditor.trace("currentStep obj: ",obj.key);
			this.currentStep++;
			return 0;
		}else{
			this.list = [];
			this.isReady = true;
			this.currentStep = -1;
		}
		return 1;//结束
	};
	//生成低级容器
	UIEditor.initFatherMC = function(fatherMCName){
		var obj = {"libItemName":"mcs/"+fatherMCName,"type":"rec"};
		this.createOneItem(obj);
	};
	UIEditor.getChildren = function(a){
		for(var i = 0;i<a.length;i++){
			var obj = a[i];
			this.getAllList(obj);
			if(obj.children&&obj.children.length>0){
				UIEditor.getChildren(obj.children);
			}
		}
	}
	
	UIEditor.getAllList = function(obj){
		this.list.push(obj);
	};
	UIEditor.reset = function(){
		this.isReady = false;
		this.QUENE = [];
		this.list = [];
		this.currentStep = -1;
		this.moduleObj = null;
	};
	UIEditor.createUIWin = function(){
		if(this.isReady){
			var fatherMCName = this.moduleObj.moduleName;
			var pt = {x:this.moduleObj.x,y:this.moduleObj.y};
			this.QUENE = [];
			var mcName = "mcs/"+fatherMCName;
			fl.getDocumentDOM().library.selectItem(mcName);
			fl.getDocumentDOM().library.addItemToDocument(pt);
			resetPos(pt);
			var a = this.moduleObj.data;
			/*this.QUENE.push(a);
			this.getInitQuene(a);
			this.QUENE.reverse();*/
			this.initChildren(a,pt);
		}else{
			alert("请先生成必需的控件");
		}
		moduleObj = null;
		this.isReady = false;
	};
	UIEditor.setElementName = function(na){
		var doc = fl.getDocumentDOM();
		selections = doc.selection;
		if(selections.length>0){
			var ele = selections[0];
			ele.name = na;
		}
	}
	UIEditor.createOneItem = function(obj){
		var type = this.getItemType(obj.type);
		var lib = fl.getDocumentDOM().library;
		var itemExit;
		if(type==UIEditor.MOVIE_CLIP){
			itemExit = lib.itemExists(obj.libItemName);
			if(!itemExit){
				this.createAnMC(obj,type);
			}
		}else if(type==UIEditor.BTN||type==UIEditor.TOGGLEBUTTON){
			itemExit = lib.itemExists(obj.libItemName);
			if(!itemExit){
				this.createAnMC(obj,type);
				this.trace(type,obj.libItemName);
			}
		}else if(type==UIEditor.SCALE9GRID){
			if(obj.scale9GridVO!=null){
				itemExit = lib.itemExists(obj.libItemName);
				if(!itemExit){
					UIEditor.createAnScaleMC(obj);
				}
			}
		}else if(type==UIEditor.IMAGE){
			itemExit = lib.itemExists(obj.libItemName);
			if(!itemExit){
				this.createAnImage(obj);
			}
		}
	};
	UIEditor.createAnMC = function(obj,type){
		var li = obj.libItemName.split("/");
		var path = li[0];
		var mcname = li[1];
		this.createCustomMC(path,mcname,true,"mc");
		if(obj.statelist&&obj.statelist.length>0){
			this.editLibItem(obj,obj.textureList);
		}
		delAllEle();
	};
	UIEditor.createCustomMC = function(path,mcname,isUseTemp,type){
		var alignstr="top left";
		var doc = fl.getDocumentDOM();
		var lib = doc.library;
		if(isUseTemp){
			lib.addItemToDocument({x:0, y:0},UIEditor.TEMPMC);
		}
		if(this.getSelections()<=0){
			UIEditor.trace(mcname+"不存在");
		}
		doc.convertToSymbol(UIEditor.MOVIE_CLIP, mcname, alignstr);
		if (lib.getItemProperty('linkageImportForRS') == true) {
			lib.setItemProperty('linkageImportForRS', false);
		}else {
			lib.setItemProperty('linkageExportForAS', false);
			lib.setItemProperty('linkageExportForRS', false);
		}
		lib.setItemProperty('scalingGrid',  false);
		doc.enterEditMode('inPlace');
		renameLayers(0,UIEditor.COMPS_LAYER_NA);
		if(type==UIEditor.TOGGLEBUTTON){
			fl.getDocumentDOM().getTimeline().layers[0].frames[0].name = "tbtn";
		}else if(type==UIEditor.BTN){
			fl.getDocumentDOM().getTimeline().layers[0].frames[0].name = "btn";
		}
		if(!lib.itemExists(path)){
			lib.newFolder(path);
		}
		lib.selectItem(mcname);
		lib.moveToFolder(path);
		if(isUseTemp){
			delAllEle();
		}
		doc.exitEditMode();
	}
	UIEditor.createAnScaleMC = function(obj){
		var li = obj.libItemName.split("/");
		var path = li[0];
		var mcname = li[1];
		unselectAll();
		var doc = fl.getDocumentDOM();
		var lib = doc.library;
		lib.addItemToDocument({x:0,y:0},"bitmaps/"+obj.name+this.getImageTypeStr(obj));
		resetPos({x:0,y:0});
		if(this.getSelections()<=0){
			UIEditor.trace(obj.libItemName+"不存在");
		}
		doc.convertToSymbol(UIEditor.MOVIE_CLIP, mcname, "top left");
		if (lib.getItemProperty('linkageImportForRS') == true) {
			lib.setItemProperty('linkageImportForRS', false);
		}
		else {
			lib.setItemProperty('linkageExportForAS', false);
			lib.setItemProperty('linkageExportForRS', false);
		}
		lib.setItemProperty('scalingGrid',  true);
		doc.enterEditMode('inPlace');
		renameLayers(0,UIEditor.COMPS_LAYER_NA);
		/*var selItems = fl.getDocumentDOM().library.getSelectedItems();
		var dStr = obj.scale9GridVO.sx+","+obj.scale9GridVO.sy+","+obj.scale9GridVO.sw+","+obj.scale9GridVO.sh;
		selItems[0].addData("scaledata", "string", dStr);*/
		//BitmapSlice9Grid.run({x:obj.scale9GridVO.sx, y:obj.scale9GridVO.sy, width:obj.scale9GridVO.sw, height:obj.scale9GridVO.sh});
		UIEditor.trace("生成",obj.libItemName);
		setGridHandler({x:obj.scale9GridVO.sx, y:obj.scale9GridVO.sy, width:obj.scale9GridVO.sw, height:obj.scale9GridVO.sh});
		doc.exitEditMode();
		if(!lib.itemExists(path)){
			lib.newFolder(path);
		}
		lib.selectItem(mcname);
		fl.getDocumentDOM().library.moveToFolder(path);
		delAllEle();
	}
	UIEditor.createAnButton = function(obj){
		var li = obj.libItemName.split("/");
		var path = li[0];
		var btnName = li[1];
		var doc = fl.getDocumentDOM();
		var lib = doc.library;
		lib.addItemToDocument({x:0, y:0},UIEditor.TEMPMC);
		if(this.getSelections()<=0){
			UIEditor.trace(obj.libItemName+"不存在");
		}
		doc.convertToSymbol(UIEditor.BUTTON, btnName, "top left");
		if (lib.getItemProperty('linkageImportForRS') == true) {
			lib.setItemProperty('linkageImportForRS', false);
		}
		else {
			lib.setItemProperty('linkageExportForAS', false);
			lib.setItemProperty('linkageExportForRS', false);
		}
		lib.setItemProperty('scalingGrid',  false);
		doc.enterEditMode('inPlace');
		renameLayers(0,UIEditor.COMPS_LAYER_NA);
		if(!lib.itemExists(path)){
			lib.newFolder(path);
		}
		lib.selectItem(btnName);
		lib.moveToFolder(path);
		delAllEle();
		doc.exitEditMode();
		this.editLibItem(obj,obj.textureList);
		delAllEle();
	}
	UIEditor.getInitQuene = function(a){
		for(var i = 0;i<a.length;i++){
			var obj = a[i];
			if(obj.children&&obj.children.length>0){
				this.QUENE.push(obj.children);
			}
		}
	};
	UIEditor.loopInitUI = function(){
		
	};
	UIEditor.createAnImage = function(obj){
		var li = obj.libItemName.split("/");
		var path = li[0];
		var mcname = li[1];
		var doc = fl.getDocumentDOM();
		var lib = doc.library;
		lib.addItemToDocument({x:0,y:0},"bitmaps/"+obj.name+this.getImageTypeStr(obj));
		resetPos({x:0,y:0});
		if(this.getSelections()<=0){
			UIEditor.trace(obj.libItemName+"不存在");
		}
		doc.convertToSymbol(UIEditor.MOVIE_CLIP, mcname, "top left");
		if (lib.getItemProperty('linkageImportForRS') == true) {
			lib.setItemProperty('linkageImportForRS', false);
		}
		else {
			lib.setItemProperty('linkageExportForAS', false);
			lib.setItemProperty('linkageExportForRS', false);
		}
		lib.setItemProperty('scalingGrid',  false);
		doc.enterEditMode('inPlace');
		renameLayers(0,UIEditor.COMPS_LAYER_NA);
		doc.getTimeline().layers[0].frames[0].name = "image";
		doc.exitEditMode();
		if(!lib.itemExists(path)){
			lib.newFolder(path);
		}
		lib.selectItem(mcname);
		fl.getDocumentDOM().library.moveToFolder(path);
		delAllEle();
	};
	UIEditor.initChildren = function(a,fatherPt){
		fl.getDocumentDOM().enterEditMode('inPlace');
		var doc = fl.getDocumentDOM();
		var lib = doc.library;
		for(var i = 0;i<a.length;i++){
			var obj = a[i];
			var type = this.getItemType(obj.type);
			var li;
			var xList = obj.x.split(",");
			var yList = obj.y.split(",");
			for(var j = 0;j<xList.length;j++){
				var pt = {x:parseInt(xList[j]),y:parseInt(yList[j])};
				if(type==UIEditor.IMAGE){
					selectLayerNa(UIEditor.COMPS_LAYER_NA);
					fl.getDocumentDOM().library.addItemToDocument(pt,obj.libItemName);
					resetPos(pt);
				}else if(type==UIEditor.TEXT&&obj.textDataVO!=null){
					selectLayerNa(UIEditor.TEXT_LAYERNA);
					this.createTxt(obj,obj.textDataVO.characters,pt);
				}else if(type==UIEditor.SCALE9GRID){
					fl.getDocumentDOM().library.addItemToDocument(pt,obj.libItemName);
					resetSize(obj,pt);
				}else if(type==UIEditor.MOVIE_CLIP){
					fl.getDocumentDOM().library.addItemToDocument(pt,obj.libItemName);
					resetPos(pt);
					UIEditor.trace("obj.libItemName",obj.libItemName);
					if(obj.textDataVO!=null){
						this.addTxtToObj(obj.libItemName,obj);
					}
				}else if(type==UIEditor.BTN||type==UIEditor.TOGGLEBUTTON){
					if(!lib.itemExists("mcs/"+obj.key+obj.name)){
						fl.getDocumentDOM().library.addItemToDocument({x:0,y:0},obj.libItemName);
						this.setElementName(obj.key);
						this.createCustomMC("mcs",obj.key+obj.name,false,type);
						if(obj.textDataVO!=null){
							this.addTxtToObj(obj.libItemName,obj);
						}
					}else{
						fl.getDocumentDOM().library.addItemToDocument(pt,"mcs/"+obj.key+obj.name);
					}
					resetPos(pt);
				}
				this.toggleShowItem(obj);
				this.setElementName(obj.key);
				if(j==0){
					if(obj.children&&obj.children.length>0){
						UIEditor.initChildren(obj.children,pt);
					}
				}
			}
			
		}
		fl.getDocumentDOM().exitEditMode();
		if(fatherPt){
			//alert("sss");
			//resetPos(fatherPt);
		}
	};
	
	UIEditor.toggleShowItem = function(obj){
		if(obj.visible&&obj.visible==1){
			var doc = fl.getDocumentDOM();
			selections = doc.selection;
			if(selections.length>0){
				var ele = selections[0];
				fl.getDocumentDOM().setElementProperty('visible', false)
			}
		}
	};
	function createTextureList(stateList,na){
		var a = stateList.split(",");
		for(var i = 0;i<a.length;i++){
			if(parseInt(a[i])<10&&a.length>=10){
				a[i]="0"+a[i];
			}
			a[i] = "bitmaps/"+na+a[i]+".png";
		}
		return a;
	}
	UIEditor.getSelections = function(){
		var doc = fl.getDocumentDOM();
		var selections = doc.selection;
		return selections.length;
	};
	UIEditor.COMPS_LAYER_NA = "comps";
	UIEditor.createScale9GridMC = function(obj,pt){
		var li = obj.libItemName.split("/");
		var path = li[0];
		var mcname = li[1];
		unselectAll();
		fl.getDocumentDOM().library.addItemToDocument({x:0,y:0},"bitmaps/"+obj.name+this.getImageTypeStr(obj));
		resetPos({x:0,y:0});
		if(this.getSelections()<=0){
			UIEditor.trace(obj.libItemName+"不存在");
		}
		fl.getDocumentDOM().convertToSymbol(UIEditor.MOVIE_CLIP, mcname, "top left");
		var lib = fl.getDocumentDOM().library;
		if (lib.getItemProperty('linkageImportForRS') == true) {
			lib.setItemProperty('linkageImportForRS', false);
		}
		else {
			lib.setItemProperty('linkageExportForAS', false);
			lib.setItemProperty('linkageExportForRS', false);
		}
		lib.setItemProperty('scalingGrid',  true);
		fl.getDocumentDOM().enterEditMode('inPlace');
		renameLayers(0,UIEditor.COMPS_LAYER_NA);
		/*var selItems = fl.getDocumentDOM().library.getSelectedItems();
		var dStr = obj.scale9GridVO.sx+","+obj.scale9GridVO.sy+","+obj.scale9GridVO.sw+","+obj.scale9GridVO.sh;
		selItems[0].addData("scaledata", "string", dStr);*/
		//BitmapSlice9Grid.run({x:obj.scale9GridVO.sx, y:obj.scale9GridVO.sy, width:obj.scale9GridVO.sw, height:obj.scale9GridVO.sh});
		UIEditor.trace("生成",obj.libItemName);
		setGridHandler({x:obj.scale9GridVO.sx, y:obj.scale9GridVO.sy, width:obj.scale9GridVO.sw, height:obj.scale9GridVO.sh});
		fl.getDocumentDOM().exitEditMode();
		if(!lib.itemExists(path)){
			lib.newFolder(path);
		}
		lib.selectItem(mcname);
		fl.getDocumentDOM().library.moveToFolder(path);
		resetSize(obj,pt);
	}
	UIEditor.getImageTypeStr = function(obj){
		if(obj.tf&&obj.tf==1){
			return ".jpg";
		}
		return ".png";
	};
	UIEditor.addTxtToObj = function(path,obj){
		//fl.getDocumentDOM().library.selectItem(path);
		//fl.getDocumentDOM().library.editItem();
		fl.getDocumentDOM().enterEditMode('inPlace');
		selectLayerNa(UIEditor.TEXT_LAYERNA);
		var pt = {x:0,y:0};
		this.createTxt(obj,obj.textDataVO.characters,pt);
		fl.getDocumentDOM().exitEditMode();
	}
	
	function selectLayerNa(layerName){
		var txtLayerIndex = getLayerIndexByName(layerName);
		if(txtLayerIndex==-1){
			addNewLayer(layerName);
		}else{
			fl.getDocumentDOM().getTimeline().setSelectedLayers(txtLayerIndex, true);
		}
	}
	function addNewLayer(layerName){
		fl.getDocumentDOM().getTimeline().addNewLayer(layerName);
	}
	function unselectAll(){
		fl.getDocumentDOM().selectAll();
		fl.getDocumentDOM().selectNone();
	}
	UIEditor.addImage = function(obj,pt){
		unselectAll();
		//UIEditor.traceObj(obj);
		fl.getDocumentDOM().library.addItemToDocument(pt,obj.libItemName);
		resetSize(obj,pt,getCurrentSelectObj());
	};
	function getCurrentSelectObj(){
		var doc = fl.getDocumentDOM();
		var selections = doc.selection;
		if(selections.length>0){
			var ele = selections[0];
			return {w:ele.width,h:ele.height};
		}
		return null;
	}
	function resetPos(pt){
		UIEditor.traceObj(pt);
		var theSelectionArray = fl.getDocumentDOM().selection;
		for(var i=0;i<theSelectionArray.length;i++){
			var element = theSelectionArray[i];
			element.x = pt.x;
			element.y = pt.y;
			//fl.getDocumentDOM().setSelectionBounds({left:pt.x, top:pt.y, right:(element.width+pt.x), bottom:(element.height+pt.y)});
		}
	}
	function resetSize(obj,pt,customWH){
		if(customWH==null){
			fl.getDocumentDOM().setSelectionBounds({left:pt.x, top:pt.y, right:(obj.w+pt.x), bottom:(obj.h+pt.y)});
		}else{
			fl.getDocumentDOM().setSelectionBounds({left:pt.x, top:pt.y, right:(customWH.w+pt.x), bottom:(customWH.h+pt.y)});
		}
	}
	function hasSelection(){
		var theSelectionArray = fl.getDocumentDOM().selection;
		if(theSelectionArray&&theSelectionArray.length>0){
			return true;
		}
		return false;
	}
	UIEditor.getItemType = function(type){
		var str = UIEditor.MOVIE_CLIP;
		if(type=="image"){
			return UIEditor.IMAGE;
		}else if(type=="rec"){
			return UIEditor.MOVIE_CLIP;
		}else if(type=="scaleimage"){
			return UIEditor.SCALE9GRID;
		}else if(type=="tbtn"){
			return UIEditor.TOGGLEBUTTON;
		}else if(type=="btn"){
			return UIEditor.BTN;
		}else if(type=="si"){
			return UIEditor.MOVIE_CLIP;
		}else if(type=="text"){
			return UIEditor.TEXT;
		}else if(type=="fill"){
			return UIEditor.IMAGE;
		}else if(type=="pgb"){
			return UIEditor.MOVIE_CLIP;
		}
		return str;
	};
	UIEditor.createItemToLib = function(t,path,itemName,pt,obj){
		var alignstr="top left";
		if(t==UIEditor.MOVIE_CLIP){
			UIEditor.createMC(path,itemName,alignstr,pt,obj);
		}else if(t==UIEditor.BUTTON){
			UIEditor.createButton(path,itemName,pt);
		}
	};
	UIEditor.createButton = function(path,btnName,pt){
		fl.getDocumentDOM().library.addItemToDocument({x:pt.x, y:pt.y},UIEditor.TEMPMC);
		if(this.getSelections()<=0){
			UIEditor.trace(obj.libItemName+"不存在");
		}
		fl.getDocumentDOM().convertToSymbol(UIEditor.BUTTON, btnName, "top left");
		var lib = fl.getDocumentDOM().library;
		if (lib.getItemProperty('linkageImportForRS') == true) {
			lib.setItemProperty('linkageImportForRS', false);
		}
		else {
			lib.setItemProperty('linkageExportForAS', false);
			lib.setItemProperty('linkageExportForRS', false);
		}
		lib.setItemProperty('scalingGrid',  false);
		fl.getDocumentDOM().enterEditMode('inPlace');
		renameLayers(0,UIEditor.COMPS_LAYER_NA);
		if(!lib.itemExists(path)){
			lib.newFolder(path);
		}
		lib.selectItem(btnName);
		fl.getDocumentDOM().library.moveToFolder(path);
		delAllEle();
		fl.getDocumentDOM().exitEditMode();
	};
	function delAllEle(){
		fl.getDocumentDOM().selectAll();
		var isSelect = hasSelection();
		if(isSelect){
			fl.getDocumentDOM().deleteSelection();
		}
	}
	UIEditor.createTxt = function(obj,txt,pt){
		var doc = fl.getDocumentDOM();
		unselectAll();
		doc.addNewText({left:pt.x,top:pt.y,right:pt.x+obj.w,bottom:pt.y+obj.h});
		//UIEditor.traceObj({left:pt.x,top:pt.y,right:pt.x+obj.w,bottom:pt.y+obj.h});
		resetSize(obj,pt);
		doc.setTextString(txt);
		UIEditor.traceObj(obj.textDataVO);
		updateTxtInfo(obj.textDataVO);
		setFilter(obj.filterDataVO);
	};
	function updateTxtInfo(obj){
		if(obj){
			var doc = fl.getDocumentDOM();
			doc.setElementTextAttr("fillColor", obj.colour);
			doc.setElementTextAttr("bold", obj.bold);
			doc.setElementTextAttr("size", obj.size);
			doc.setElementTextAttr("face", obj.face);
			UIEditor.trace(obj.face,"face");
			doc.setElementTextAttr("italic", obj.italic);
			doc.selection[0].lineType = obj.lineType;
		}
	}
	function setFilter(obj){
		if(obj){
			var doc = fl.getDocumentDOM();
			doc.addFilter(obj.name);
			UIEditor.traceObj(obj);
			var myFilters = doc.getFilters(); 
			for (i=0; i < myFilters.length; i++) {
				if (myFilters[i].name == obj.name){
					myFilters[i].blurX = obj.blurX;
					myFilters[i].blurY = obj.blurY; 
					myFilters[i].color = obj.color; 
					myFilters[i].strength  = obj.strength*100; 
					myFilters[i].quality  = obj.quality; 
					myFilters[i].angle  = obj.angle; 
				}
			}
			fl.getDocumentDOM().setFilters(myFilters);
		}
	}
	function createTempMC(){
		var itemExit = fl.getDocumentDOM().library.itemExists(UIEditor.TEMPMC);
		if(!itemExit){
			var lib = fl.getDocumentDOM().library;
			lib.addNewItem(UIEditor.MOVIE_CLIP,UIEditor.TEMPMC);
			if (lib.getItemProperty('linkageImportForRS') == true) {
				lib.setItemProperty('linkageImportForRS', false);
			}
			else {
				lib.setItemProperty('linkageExportForAS', false);
				lib.setItemProperty('linkageExportForRS', false);
			}
			fl.getDocumentDOM().exitEditMode();
		}
	}
	UIEditor.createMC = function(path,mcname,alignstr,pt,obj){
		if(alignstr==null){
			alignstr="top left";
		}
		fl.getDocumentDOM().library.addItemToDocument({x:pt.x, y:pt.y},UIEditor.TEMPMC);
		if(this.getSelections()<=0){
			UIEditor.trace(obj.libItemName+"不存在");
		}
		fl.getDocumentDOM().convertToSymbol(UIEditor.MOVIE_CLIP, mcname, alignstr);
		var lib = fl.getDocumentDOM().library;
		if (lib.getItemProperty('linkageImportForRS') == true) {
			lib.setItemProperty('linkageImportForRS', false);
		}
		else {
			lib.setItemProperty('linkageExportForAS', false);
			lib.setItemProperty('linkageExportForRS', false);
		}
		lib.setItemProperty('scalingGrid',  false);
		fl.getDocumentDOM().enterEditMode('inPlace');
		renameLayers(0,UIEditor.COMPS_LAYER_NA);
		if(!lib.itemExists(path)){
			lib.newFolder(path);
		}
		lib.selectItem(mcname);
		fl.getDocumentDOM().library.moveToFolder(path);
		delAllEle();
		fl.getDocumentDOM().exitEditMode();
		resetPos(pt);
	};
	UIEditor.editLibItem = function(obj,texturelist){
		//fl.getDocumentDOM().library.selectItem(path);
		//fl.getDocumentDOM().library.editItem();
		fl.getDocumentDOM().enterEditMode('inPlace');
		selectLayerNa(UIEditor.COMPS_LAYER_NA);
		for(var i = 0;i<texturelist.length;i++){
			fl.getDocumentDOM().selectAll();
			fl.getDocumentDOM().selectNone();
			if(i==0){
				if(obj.type==UIEditor.STATEIMAGE){
					fl.getDocumentDOM().getTimeline().layers[0].frames[0].name = "si";
				}else if(obj.type==UIEditor.TOGGLEBUTTON){
					fl.getDocumentDOM().getTimeline().layers[0].frames[0].name = "tbtn";
				}else if(obj.type==UIEditor.BTN){
					fl.getDocumentDOM().getTimeline().layers[0].frames[0].name = "btn";
				}
			}
			UIEditor.trace("texturelist[i] ",texturelist[i]);
			fl.getDocumentDOM().library.selectItem(texturelist[i]);
			fl.getDocumentDOM().library.addItemToDocument({x:0, y:0});
			resetPos({x:0, y:0});
			if(i<texturelist.length-1){
				fl.getDocumentDOM().getTimeline().insertBlankKeyframe();
			}
		}
		fl.getDocumentDOM().exitEditMode();
	};
	UIEditor.addItemToScene = function(path,rec){
		fl.getDocumentDOM().library.selectItem(path);
		fl.getDocumentDOM().library.addItemToDocument({x:rec.x, y:rec.y});
	}
	function renameLayers(index,na){
		var currentLayers = fl.getDocumentDOM().getTimeline().layers;
		if(currentLayers.length<=0){
			addNewLayer(na);
		}else{
			var layer = currentLayers[index];
			layer.name = na;
		}
	}
	function getLayerIndexByName(na){
		var currentLayers = fl.getDocumentDOM().getTimeline().layers;
		for(var i = 0;i<currentLayers.length;i++){
			var layer = currentLayers[i];
			if(layer.name==na){
				return i;
			}
		}
		return -1;
	}
	function getTimeLineElements(ele){
		var list = [];
		if(ele.instanceType != "symbol")
		{
			return list;
		}
		var libItem = ele.libraryItem;
		var dom = fl.getDocumentDOM();
		dom.library.editItem(libItem.name);
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
					var eleObj = {"ele":element,"depth":element.depth};
					list.push(eleObj);
				}
			}
		}
		dom.exitEditMode();
		return list;
	}
	//查到一个对象下的对象数据
	function getElementsByLayerNameAndFrames(element,layerName,frameId){
		var time_line = element.libraryItem.timeline;
		var layerIndex = time_line.findLayerIndex(layerName);
		if(layerIndex!=null){
			var layer = time_line.layers[layerIndex];
			var frame = layer.frames[frameId];
			var eles = frame.elements;
			return eles;
		}
		return null;
	}
	
	function getElementInfo(ele){
		var eles;
		var element;
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
				prop.vb = 0;
				//UIEditor.apply(prop,getTextValue(ele));
			}else{
				if(ele.instanceType == "symbol"){
					var libItem = ele.libraryItem;
					prop.vb = getVBStr(ele);
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
										eles = getElementsByLayerNameAndFrames(ele,"comps",0);
										if(eles&&eles.length>0){
											element = eles[0];
											prop.texture = element.libraryItem.name;
											prop.texturelist = getTextureList(element);
										}
										prop.txt = getButtonTxt(ele);
										prop.filterobj = getButtonFilter(ele);
										
									}else if(mcType=="btn"){
										prop.class = "SimpleButton";
										eles = getElementsByLayerNameAndFrames(ele,"comps",0);
										if(eles&&eles.length>0){
											element = eles[0];
											prop.texture = element.libraryItem.name;
											prop.texturelist = getTextureList(element);
										}
										prop.txt = getButtonTxt(ele);
										prop.filterobj = getButtonFilter(ele);
									}else if(mcType=="cmc"){
										prop.class = "CLoading";
									}else if(mcType=="image"){
										prop.class = "Image";
										//prop.texture
									}else{
										//rec;
										prop.children = [];
										//var time_line = libItem.timeline;
										var selections = getTimeLineElements(ele);
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
	function getVBStr(ele){
		var vb = ele.visible;
		if(!vb){
			return 1;
		}
		return 0;
	}
	function getComponentsInfo(selections,list){
		for(var i=0; i<selections.length; i++){
			var eleObj = selections[i];
			var ele = eleObj["ele"];
			var prop = getElementInfo(ele);
			prop.depth = Math.round(eleObj["depth"]);
			//UIEditor.trace("ddepth"+" : "+prop.depth);
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

	UIEditor.traceArray = function(a){
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
			obj.align = attrs.alignment;
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
				}else if(frame.name=="image"){
					iType="image";
					break;
				}else if(frame.name=="btn"){
					iType="btn";
					break;
				}
			}
		}
		return iType;
	}
	function getTextureList(element,isInner){
		var list = [];
		var time_line;
		if(!isInner){
			time_line = element.libraryItem.timeline;
		}else{
			var eles = getElementsByLayerNameAndFrames(element,"comps",0);
			if(eles&&eles.length>0){
				var ele = eles[0];
				time_line = ele.libraryItem.timeline;
			}else{
				return list;
			}
		}
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
		UIEditor.trace("------------");
		var isA = this.isArray(obj);
		if(isA){
			UIEditor.traceArray(obj);
		}else{
			for(var prop in obj){
				isA = this.isArray(obj[prop]);
				if(isA){
					UIEditor.trace(prop + ": ");
					UIEditor.traceArray(obj[prop]);
				}else{
					UIEditor.trace(prop + ": " + obj[prop]);
				}
				
			}
		}
		UIEditor.trace("------------");
	};
	UIEditor.isArray = function(value){
		return Object.prototype.toString.call(value) === '[object Array]';
	};
	function setGridHandler(grid){
		var doc = fl.getDocumentDOM();
		var lib = doc.library;
		var timeline = doc.getTimeline();
		var selectedFrames = doc.getTimeline().getSelectedFrames();
		if (selectedFrames.length != 3) {
			alert('Only a single keyframe should be selected before running this command.');
			return false;
		}
		var selectedItems = doc.selection;
		selection = selectedItems[0];
		var layer = doc.getTimeline().layers[selectedFrames[0]];
		var frame = layer.frames[selectedFrames[1]];
		lib.setItemProperty('scalingGrid', true);
		lib.setItemProperty('scalingGridRect', {left:grid.x, top:grid.y, right:grid.x+grid.width, bottom:grid.y+grid.height});
		var bmp = selection.libraryItem;
		var name = bmp.name;
		if (name.indexOf(".") > 0) { name = name.substr(0,name.indexOf(".")); }
		if (name.indexOf("/") > 0) { name = name.substr(name.lastIndexOf("/")+1); }
		var sliceLayer = null;
		var bmpLayer = null;
		var index;
		
		
		// check if our selection is already on an existing _bmp layer:
		if (layer.name.substr(-4) == "_bmp") {
			bmpLayer = layer;
			name = layer.name.substr(0,layer.name.length-4);
		}
		
		// check if the slice layer already exists:
		var sliceLayerIndexes = timeline.findLayerIndex(name+"_slices");
		if (sliceLayerIndexes != null && sliceLayerIndexes.length > 0) {
			sliceLayer = timeline.layers[sliceLayerIndexes[0]];
		}
		
		// create or rename bmpLayer if needed:
		if (bmpLayer == null) {
			// create a bmpLayer if there are other elements on the current layer.
			if (frame.elements.length > 1) {
				// create new layer:
				doc.clipCut();
				if (sliceLayer) { timeline.setSelectedLayers(sliceLayerIndexes[0]); }
				index = timeline.addNewLayer(name+"_bmp","guide",true);
				bmpLayer = timeline.layers[index];
				doc.clipPaste(true);
			} else {
				// rename the current layer:
				layer.name = name+"_bmp";
				bmpLayer = layer;
			}
		}
		
		// set up bmpLayer properties:
		bmpLayer.visible = false; // hidden
		bmpLayer.layerType = "guide"; // avoid compiling it into the SWF
		
		if (sliceLayer) {
			// sliceLayer already exists, clear old slices:
			if (selectSlices(sliceLayer)) { document.deleteSelection(); }
		} else {
			// create new sliceLayer below the bmpLayer:
			index = timeline.addNewLayer(name+"_slices","normal",false);
			sliceLayer = timeline.layers[index];
		}
		
		// ensure the sliceLayer is selected:
		timeline.setSelectedLayers(timeline.findLayerIndex(sliceLayer.name)[0]);
		
		// find the original size and path of the library bitmap
		var bmpWidth = selection.hPixels;
		var bmpHeight = selection.vPixels;
		var bmpPath = bmp.name;
		
		// do the slicing:
		var srcRect = {x:selection.x, y:selection.y, width:selection.width, height:selection.height};
		
		var cols = [grid.x-10000, grid.x, grid.x+grid.width, 10000, grid.width, 10000];
		var rows = [grid.y-10000, grid.y, grid.y+grid.height, 10000, grid.height, 10000];
		for (var row=0; row<3; row++) {
			for (var col=0; col<3; col++) {
				var targetRect = getIntersection(srcRect, {x:cols[col], y:rows[row], width:cols[col+3], height:rows[row+3]});
				drawRect(bmpPath, bmpWidth, bmpHeight, srcRect, targetRect);
			}
		}
		
		selectSlices(sliceLayer);
	}
	function selectSlices(sliceLayer) {
		var elements = sliceLayer.frames[0].elements;
		var s = [];
		for (var i=0; i<elements.length; i++) {
			// only remove rectangle primitives, in case there are other items on the layer:
			if (elements[i].elementType == "shape" && elements[i].isRectangleObject) {
				s.push(elements[i]);
			}
		}
		if (s.length > 0) {
			document.selection = s;
		}
		return s.length > 0;
	}
	function drawRect(bmpPath, bmpWidth, bmpHeight, srcRect, targetRect) {
		if (targetRect == null) { return; }
		var doc = fl.getDocumentDOM();
		var fill = doc.getCustomFill();
		fill.style = "bitmap";
		fill.bitmapIsClipped = false;
		fill.bitmapPath = bmpPath;
		var matrix = selection.matrix;
		matrix.tx = srcRect.x;
		matrix.ty = srcRect.y;
		matrix.a = srcRect.width/(bmpWidth/20); // 20 seems to be a magic number for calculating the matrix.
		matrix.d = srcRect.height/(bmpHeight/20);
		matrix.b = matrix.c = 0;
		fill.matrix = matrix;
		doc.setCustomFill(fill);
		doc.addNewPrimitiveRectangle({left:targetRect.x, top:targetRect.y, right:targetRect.x+targetRect.width, bottom:targetRect.y+targetRect.height},0,false,true);
	}
	function getIntersection(rect1, rect2) {
		var x = max(rect1.x, rect2.x);
		var y = max(rect1.y, rect2.y);
		var r = min(rect1.x+rect1.width, rect2.x+rect2.width);
		var b = min(rect1.y+rect1.height, rect2.y+rect2.height);
		if (r > x && b > y) {
			return {x:x, y:y, width:r-x, height:b-y}
		}
		return null;
	}

	function max(num1, num2) {
		return (num1 > num2) ? num1 : num2;
	}
	function min(num1, num2) {
		return (num1 < num2) ? num1 : num2;
	}
 })();