var rule=function(element1,element2){
	if(element1.name&&element2.name){
		var name1=element1.name.toLowerCase();
		var name2=element2.name.toLowerCase();
		if(name1<name2){
			return -1;
		}
		if(name1>name2){
			return 1;
		}
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