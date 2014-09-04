var resURI = fl.browseForFolderURL("Select the folder where the FLA files are located");
var outURI = fl.browseForFolderURL("Select the folder where all images should be exported as *.PNG");
var resFiles = FLfile.listFolder(resURI+"/*.fla", "files");
fl.outputPanel.clear();

function convert2png(){
	for(var i = 0;i<resFiles.length;i++) {
		
		var doc = fl.openDocument(resURI + '/' + resFiles[i]);
		var folderName = document.name.split('.')[0];
		var fileURI = outURI + "/" + folderName;
		
		var items = doc.library.items;	
		
		FLfile.createFolder(fileURI);
		for (i = 0; i < items.length; i++)
		{
		     if(items[i].itemType == "bitmap")
		     {
			fl.trace("输出文件=>" + fileURI + "/" +items[i].name);
			items[i].allowSmoothing = true;
			items[i].compressionType = "lossless";
		   
			//输出文件
			items[i].exportToFile(fileURI + "/" + items[i].name + ".png" );
		     }
		}
		alert("输出完毕，关闭文件，请勿保存");
		doc.close();
	}
}
convert2png();