var forEach=function(){
	
	fl.outputPanel.clear();
	
	if(fl.getDocumentDOM()){
	}else{
		fl.trace("请打开需要处理的 fla 文档。");
		return;
	}
	
	//过滤
	if(${selected}){
		//获取批处理对象们
		var itemArr=fl.getDocumentDOM().library.getSelectedItems();
		//
	}else{
		//获取批处理对象们
		var itemArr=fl.getDocumentDOM().library.items.slice();
		//
	}
	${filter}
	if(filter){
		var itemId=itemArr.length;
		while(--itemId>=0){
			if(${filterRev}filter(itemArr[itemId],itemId,itemArr)){
			}else{
				itemArr.splice(itemId,1);
			}
		}
	}
	//
	
	//规则
	${rule}
	if(rule){
		itemArr.sort(rule);
	}
	if(${ruleRev}){
		itemArr.reverse();
	}
	//
	
	//执行
	fl.trace("\n批处理 "+itemArr.length+" 个 item：");
	${前期处理}
	var cmd=function(item,itemId,itemArr){
		${cmd}
	}
	for(var itemId=0;itemId<itemArr.length;itemId++){
		cmd(itemArr[itemId],itemId,itemArr);
	}
	${后期处理}
	fl.trace("批处理完成。\n");
	//
}