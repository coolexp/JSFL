//[Flash提供的js API并没有可以获取当前编辑元件的方法, 确保在库中选中当前编辑的元件] 选中图片, 运行该脚本, 会把图片根据该元件的scale9Grid打散成9个部分, 并各自成组.
//tamt 2009.11.12 ver0.1
//TODO:Flash提供的js API并没有可以获取当前编辑元件的方法.

var curItem;
var rect = {l:4, r:4, t:2, b:2};//{left:0, right:0, top:0, bottom:0};
var items = fl.getDocumentDOM().library.getSelectedItems();
for(var i=0; i<items.length; i++){
    curItem = items[0];
    if(curItem.scalingGrid){
        rect.l = curItem.scalingGridRect.left;
        rect.r = curItem.scalingGridRect.right;
        rect.t = curItem.scalingGridRect.top;
        rect.b = curItem.scalingGridRect.bottom;

        //traceObj(rect);

        var doc = fl.getDocumentDOM();
        var imgItem = doc.selection[0];
        if(imgItem.instanceType == "bitmap"){
            doc.breakApart();

            //左上角打组
            doc.setSelectionRect({left:-500, right:rect.l, top:-500, bottom:rect.t}, true, false);
            doc.group();
            //右上角打组
            doc.setSelectionRect({left:rect.r, right:1000, top:-500, bottom:rect.t}, true, false);
            doc.group();
            //右下角打组
            doc.setSelectionRect({left:rect.r, right:1000, top:rect.b, bottom:1000}, true, false);
            doc.group();
            //左下角打组
            doc.setSelectionRect({left:-500, right:rect.l, top:rect.b, bottom:1000}, true, false);
            doc.group();
            //中间部分打组
            doc.setSelectionRect({left:rect.l, right:rect.r, top:rect.t, bottom:rect.b}, true, false);
            doc.group();
            //左边部分打组
            doc.setSelectionRect({left:-500, right:rect.l, top:rect.t, bottom:rect.b}, true, false);
            doc.group();
            //右边部分打组
            doc.setSelectionRect({left:rect.r, right:1000, top:rect.t, bottom:rect.b}, true, false);
            doc.group();
            //上边部分打组
            doc.setSelectionRect({left:rect.l, right:rect.r, top:-500, bottom:rect.t}, true, false);
            doc.group();
            //下边部分打组
            doc.setSelectionRect({left:rect.l, right:rect.r, top:rect.b, bottom:1000}, true, false);
            doc.group();
        }else{
            alert('please select a bitmap.');
        }
    }
}

//debug function
function traceObj(obj){
    fl.trace("------------");
    for(var prop in obj){
        fl.trace(prop + ": " + obj[prop]);
    }
    fl.trace("------------");
}