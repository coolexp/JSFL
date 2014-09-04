var forEach=function(){
	
	fl.outputPanel.clear();
	
	if(fl.getDocumentDOM()){
	}else{
		fl.trace("请打开需要处理的 fla 文档。");
		return;
	}
	
	//获取批处理对象们
	var timeline=fl.getDocumentDOM().getTimeline();
	var frameArr=new Array();
	//过滤
	if(${selected}){
		var selectedFrameIdArr=timeline.getSelectedFrames();
		for(var id=0;id<selectedFrameIdArr.length;id+=3){
			var layer=timeline.layers[selectedFrameIdArr[id]];
			for(var frameId=selectedFrameIdArr[id+1];frameId<selectedFrameIdArr[id+2];frameId++){
				frameArr.push([selectedFrameIdArr[id],frameId]);
			}
		}
	}else{
		for(var layerId=0;layerId<timeline.layers.length;layerId++){
			var layer=timeline.layers[layerId];
			for(var frameId=0;frameId<layer.frames.length;frameId++){
				frameArr.push([layerId,frameId]);
			}
		}
	}
	//fl.trace("frameArr="+frameArr);
	${filter}
	if(filter){
		var frameI=frameArr.length;
		while(--frameI>=0){
			var layerId=frameArr[frameI][0];
			var frameId=frameArr[frameI][1];
			var frame=timeline.layers[layerId].frames[frameId];
			if(${filterRev}filter(layerId,frameId,frameI,frame,frameArr)){
			}else{
				frameArr.splice(frameI,1);
			}
		}
	}
	//fl.trace("frameArr="+frameArr);
	//
	
	//规则
	${rule}
	if(rule){
		frameArr.sort(rule);
	}
	if(${ruleRev}){
		frameArr.reverse();
	}
	//
	
	//执行
	fl.trace("\n批处理 "+frameArr.length+" 个 frame：");
	${前期处理}
	var cmd=function(frame,layerId,frameId,frameI,frameArr){
		//timeline.currentLayer=layerId;
		//timeline.currFrame=frameId;
		${cmd}
	}
	
	//1 顺序遍历，经常会对一些需要增删帧的操作造成问题
	//for(var frameI=0;frameI<frameArr.length;frameI++){
		
	//2 倒序遍历
	var frameI=frameArr.length;
	while(--frameI>=0){
	
	//
		var layerId=frameArr[frameI][0];
		var frameId=frameArr[frameI][1];
		var frame=timeline.layers[layerId].frames[frameId];
		//fl.trace("layerId="+layerId+",frameId="+frameId+",frame="+frame);
		cmd(frame,layerId,frameId,frameI,frameArr);
	}
	${后期处理}
	fl.trace("批处理完成。\n");
	//
}