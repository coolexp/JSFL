flash.trace(
	"frame="+frame+
	",layerId="+layerId+
	",frameId="+frameId+
	",frameI="+frameI//顺序遍历，经常会对一些需要增删帧的操作造成问题，所以这里默认是倒序遍历
);