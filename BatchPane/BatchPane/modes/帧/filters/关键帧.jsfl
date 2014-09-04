var filter=function(layerId,frameId,frameI,frame,frameArr){
	if(frame){
		return frame.startFrame==frameId;
	}
	return false;
}