var dom = fl.getDocumentDOM();
var lib = dom.library;
var frameName = "fl";
var documentPrefix = "";
var frameRate = 0.04;
var documentHeadStr = '<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>animations</key><dict>';
var documentBottomStr = '</dict></dict></plist>';

function getFrameNameLayer(){
	var currentLayers = dom.getTimeline().layers;
	for(var i = 0;i<currentLayers.length;i++){
		if(currentLayers[i].name==frameName){
			return currentLayers[i];
		}
	}
	return null;
}
function getAllFrameList(){
	documentPrefix = dom.name.replace(".fla","");
	frameRate = (1/dom.frameRate).toFixed(3);
	var frameLayer = getFrameNameLayer();
	if(frameLayer!=null){
		var frames = frameLayer.frames;
		var a = [];
		var b = [];
		var mcName = frames[0].name;
		a.push(mcName);
		b.push(1);
		var startIndex = 0;
		for(var i = 0,l = frames.length;i<l;i++){
			var frameName = frames[i].name;
			trace(frameName);
			if(frameName!=""&&frameName!=mcName){
				b[b.length-1] = startIndex;
				a.push(frameName);
				b.push(1);
				mcName = frameName;
				startIndex = 1;
			}else{
				startIndex++;
				if(i==l-1){
					b[b.length-1] = startIndex;
				}
			}
		}
		if(b.length!=a.length){
			trace("出了某问题了,找开发插件人员");
		}else{
			var fileString = documentHeadStr;
			for(var k =0;k<a.length;k++){
				var skillName = a[k];
				fileString+=createLaterString(a[k],b[k]);
			}
			fileString+=documentBottomStr;
		}
		
		trace("所有的动作:",a.join("-"),a.length);
		trace("对应的帧长:",b.join("-"),b.length);
		saveFile(fileString);
	}else{
		trace("没有帧标签图层fl");
	}
}
function createLaterString(skillName,len){
	var s = "";
	if(skillName.indexOf(",")>=0){
		var a = skillName.split(",");
		for(var i = 0;i<a.length;i++){
			s+=createSkillString(skillName,a[i],len);
		}
	}else{
		s+=createSkillString(skillName,skillName,len);
	}
	return s;
}
function createSkillString(skillName,skName,len){
	var s = '<key>'+skName+'</key><dict><key>delay</key><real>'+frameRate+'</real><key>loop</key><integer>1</integer><key>frames</key><array>';
	for(var i = 0;i<len;i++){
		s += '<string>'+documentPrefix+'/'+skillName+'_'+getNumString(i)+'</string>';
	}
	s+='</array></dict>';
	return s;
}
function getNumString(value){
	if(value<10){
		return "000"+value;
	}else if(value>=10&&value<100){
		return "00"+value;
	}else if(value>=100&&value<1000){
		return "0"+value;
	}else if(value>=1000&&value<10000){
		return ""+value;
	}
	return value;
}
function trace(){
	var arg = Array.prototype.slice.call(arguments);
	var str = arg.join(",");
	fl.trace(str);
}
fl.outputPanel.clear();
getAllFrameList();

function saveFile(fileString){
	var basePath = document.path.replace(document.name,"").replace(":","|").replace(/\\/g,"/");
	var URI = "file:///"+basePath+documentPrefix+"_animation.plist";
	if (FLfile.write(URI, fileString)) {
		trace(URI+"成功生成");
    	alert("成功生成");
	}
}