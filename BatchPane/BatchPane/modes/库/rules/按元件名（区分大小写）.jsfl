var rule=function(item1,item2){
	if(item1.name&&item2.name){
		if(item1.name<item2.name){
			return -1;
		}
		if(item2.name<item1.name){
			return 1;
		}
		return 0;
	}
	if(item1.name){
		return 1;
	}
	if(item2.name){
		return -1;
	}
	return 0;
}