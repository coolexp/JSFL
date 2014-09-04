var rule=function(item1,item2){
	if(item1.name&&item2.name){
		var name1=item1.name.toLowerCase();
		var name2=item2.name.toLowerCase();
		if(name1<name2){
			return -1;
		}
		if(name1>name2){
			return 1;
		}
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