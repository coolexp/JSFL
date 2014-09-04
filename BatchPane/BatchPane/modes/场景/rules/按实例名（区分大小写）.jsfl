var rule=function(element1,element2){
	if(element1.name&&element2.name){
		if(element1.name<element2.name){
			return -1;
		}
		if(element2.name<element1.name){
			return 1;
		}
		return 0;
	}
	if(element1.name){
		return 1;
	}
	if(element2.name){
		return -1;
	}
	return 0;
}