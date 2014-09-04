var forEach=function(){
	
	fl.outputPanel.clear();
	
	if(fl.getDocumentDOM()){
	}else{
		fl.trace("请打开需要处理的 fla 文档。");
		return;
	}
	
	//过滤
	if(${selected}){
		var elementArr=fl.getDocumentDOM().selection.slice();
	}else{
		//获取批处理对象们
		var timeline=fl.getDocumentDOM().getTimeline();
		var elementArr=new Array();
		for(var layerId=0;layerId<timeline.layers.length;layerId++){
			var layer=timeline.layers[layerId];
			if(layer.visible&&!layer.locked){
				var frame=layer.frames[timeline.currentFrame];
				for(var elementId=0;elementId<frame.elements.length;elementId++){
					elementArr.push(frame.elements[elementId]);
				}
			}
		}
		//
	}
	${filter}
	if(filter){
		var elementId=elementArr.length;
		while(--elementId>=0){
			if(${filterRev}filter(elementArr[elementId],elementId,elementArr)){
			}else{
				elementArr.splice(elementId,1);
			}
		}
	}
	//
	
	//规则
	${rule}
	if(rule){
		elementArr.sort(rule);
	}
	if(${ruleRev}){
		elementArr.reverse();
	}
	//
	
	//执行
	fl.trace("\n批处理 "+elementArr.length+" 个 element：");
	${前期处理}
	var cmd=function(element,elementId,elementArr){
		${cmd}
	}
	for(var elementId=0;elementId<elementArr.length;elementId++){
		cmd(elementArr[elementId],elementId,elementArr);
	}
	${后期处理}
	fl.trace("批处理完成。\n");
	//
}