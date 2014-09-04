fl.outputPanel.clear();
var dom = fl.createDocument();
var resourcePath=fl.browseForFolderURL("请选择素材路径：");
var swfPath=fl.browseForFolderURL("请选择生成swf文件的路径：");
fl.trace(resourcePath);
var lib=dom.library;
var bitmapFolder="图素";
var mcFolder="导出类";
analyseFolder(resourcePath,"/bitmaps");
dom.exportSWF(swfPath+"/resourceLib.swf",true);
fl.saveDocument(dom,swfPath+"/resourceLib.fla");
dom.close(false);

function analyseFolder(folderPath,libFolder)
{
        var fileList=FLfile.listFolder(folderPath,"files");
        for(var i=0;i<fileList.length;i++)
        {
                var fileName=fileList[i];
                var ind=fileName.indexOf(".");
                //如果没有后缀或后缀不正确则略过
                if(ind<=0||ind==(fileName.length-1))
                {
                        continue;
                }
                //后缀
                var ext=fileName.substr(ind+1,fileName.length-ind);
                ext=ext.toLowerCase();
                //不是图片则略过
                if(ext!="bmp"&&ext!="gif"&&ext!="jpg"&&ext!="jpeg"&&ext!="png")
                {
                        continue;
                }
                //不要后缀的文件名
                shortName=fileName.substr(0,ind);
                var filePath=folderPath+"/"+fileName;
                //fl.trace(filePath);
                //导入图片
                dom.importFile(filePath,true);
                //选择项
                lib.selectItem(fileName);
                //放到舞台上
                lib.addItemToDocument({x:0,y:0});
                dom.selectAll();
                dom.convertToSymbol("movie clip",shortName,"top left");
                lib.selectItem(shortName);
                lib.setItemProperty("linkageImportForRS",false);
                lib.setItemProperty("linkageExportForAS",true);
                lib.setItemProperty("linkageExportForRS",false);
                lib.setItemProperty("linkageExportInFirstFrame",true);
                lib.setItemProperty("linkageIdentifier",shortName);
                dom.selectAll();
                dom.deleteSelection();
                var f=libFolder;
                lib.newFolder(bitmapFolder+f);
                lib.newFolder(mcFolder+f);
                lib.moveToFolder(bitmapFolder+f,fileName);
                lib.moveToFolder(mcFolder+f,shortName);       
        }       
        //子文件夹
        var folderList=FLfile.listFolder(folderPath,"directories");
        for(var j=0;j<folderList.length;j++)
        {
                analyseFolder(folderPath+"/"+folderList[j],libFolder+"/"+folderList[j]);
        }
}