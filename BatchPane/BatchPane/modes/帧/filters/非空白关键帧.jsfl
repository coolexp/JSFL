var filter=function(layerId,frameId,frameI,frame,frameArr){
	if(frame){
		if(frame.startFrame==frameId){
			return frame.elements.length>0;
		}
	}
	return false;
}