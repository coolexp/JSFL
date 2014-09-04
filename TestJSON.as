package
{
	import com.coolexp.uieditor.ItemDataVO;
	
	import flash.display.Bitmap;
	import flash.display.BitmapData;
	import flash.display.Loader;
	import flash.display.MovieClip;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.net.URLLoader;
	import flash.net.URLLoaderDataFormat;
	import flash.net.URLRequest;
	import flash.system.LoaderContext;
	import flash.utils.ByteArray;
	
	import zero.swf.SWF;
	import zero.swf.Tag;
	import zero.swf.TagTypes;
	import zero.swf.tagBodys.DefineSprite;
	import zero.swf.tagBodys.FrameLabel_;
	import zero.swf.tagBodys.PlaceObject2;
	import zero.swf.tagBodys.PlaceObject3;
	import zero.swf.tagBodys.RemoveObject2;
	import zero.swf.utils.DefineObjs;
	
	[SWF(width="800",height="600")]
	public class TestJSON extends Sprite
	{
		private var str:String = '[{"name":"ShipMC","x":0,"y":2,"width":713,"height":572,"class":"Sprite","texture":"mcs/haidaochuan","children":[{"name":"title","x":193,"y":0,"width":300,"height":50,"class":"Sprite","texture":"MovieClip/shipTitle","children":[{"name":"","x":0,"y":0,"width":300,"height":50,"class":"Image","texture":"bitmaps/shipTitle.png"}]},{"name":"all_Panel_Background","x":0,"y":11,"width":686,"height":561,"class":"ScaleBitmap","texture":"mcs/background"},{"name":"closeBtn_close_all_btn","x":656,"y":22,"width":57,"height":60,"class":"SimpleButton","texture":"MovieClip/closeBtn","texturelist":["bitmaps/close_all0.png","bitmaps/close_all1.png","bitmaps/close_all2.png","bitmaps/close_all0.png"],"txt":null},{"name":"data_rec","x":59,"y":72,"width":212,"height":458,"class":"Sprite","texture":"mcs/data_rec","children":[{"name":"","x":0,"y":0,"width":212,"height":458,"class":"Sprite","texture":"mcs/dataImage","children":[{"name":"","x":0,"y":0,"width":212,"height":458,"class":"Image","texture":"bitmaps/dataImage.png"}]},{"name":"dataText0","x":59,"y":131,"width":127,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"00000000000","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffffff"},{"name":"dataText1","x":59,"y":159,"width":127,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"00000000000","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffffff"},{"name":"dataText2","x":59,"y":187,"width":127,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"00000000000","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffffff"},{"name":"dataText3","x":59,"y":214,"width":127,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"00000000000","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffffff"},{"name":"dataText4","x":59,"y":335,"width":127,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"00000000000","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffff00"},{"name":"dataText5","x":59,"y":363,"width":127,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"00000000000","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffff00"},{"name":"dataText6","x":59,"y":390,"width":127,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"00000000000","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffff00"},{"name":"dataText7","x":59,"y":418,"width":127,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"00000000000","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffff00"}]},{"name":"detail_rec","x":271,"y":72,"width":385,"height":470,"class":"Sprite","texture":"mcs/shipView_rec","children":[{"name":"","x":0,"y":0,"width":385,"height":470,"class":"ScaleBitmap","texture":"mcs/insideBox"},{"name":"imgView","x":10,"y":10,"width":364,"height":290,"class":"Sprite","texture":"mcs/imgView","children":[{"name":"","x":0,"y":0,"width":364,"height":290,"class":"Image","texture":"bitmaps/imageShip.png"}]},{"name":"shipStar_rec","x":10,"y":10,"width":354,"height":39,"class":"Sprite","texture":"mcs/shipStar_rec","children":[{"name":"star0","x":0,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star1","x":35,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star2","x":70,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star3","x":105,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star4","x":139,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star5","x":174,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star6","x":209,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star7","x":244,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star8","x":279,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]},{"name":"star9","x":314,"y":0,"width":40,"height":39,"class":"ToggleButton","texture":"mcs/shipStar","texturelist":["bitmaps/starShip0.png","bitmaps/starShip1.png","bitmaps/starShip2.png"]}]},{"name":"nameShip","x":42,"y":249,"width":193,"height":43,"class":"Sprite","texture":"mcs/nameShip","children":[{"name":"","x":0,"y":0,"width":193,"height":43,"class":"ScaleBitmap","texture":"mcs/nameBg"},{"name":"nameTxt","x":74,"y":15,"width":100,"height":17,"class":"TextField","orientation":"horizontal","lineType":"multiline","characters":"海盗船","face":"_sans","size":12,"bold":false,"italic":false,"colour":"#ffffff"}]},{"name":"huanhuaBtn","x":266,"y":248,"width":104,"height":44,"class":"SimpleButton","texture":"MovieClip/huanhuaBtn","texturelist":["bitmaps/red_General_Button0.png","bitmaps/red_General_Button1.png","bitmaps/red_General_Button2.png","bitmaps/red_General_Button3.png"],"txt":{"orientation":"horizontal","lineType":"multiline","characters":"幻 化","face":"_sans","size":16,"bold":false,"italic":false,"colour":"#ffffff"}},{"name":"","x":10,"y":425,"width":360,"height":37,"class":"TextField","orientation":"horizontal","lineType":"single line","characters":"改造海盗船可以增加海盗船经验以及提升星级，升满10星则可以幻化新的海盗船。","face":"_sans","size":14,"bold":false,"italic":false,"colour":"#ffffff"},{"name":"gaoji","x":271,"y":332,"width":72,"height":74,"class":"SimpleButton","texture":"MovieClip/gaoji","texturelist":["bitmaps/advancedReform0.png","bitmaps/advancedReform1.png","bitmaps/advancedReform2.png","bitmaps/advancedReform3.png"],"txt":null},{"name":"jinbi","x":153,"y":332,"width":68,"height":74,"class":"SimpleButton","texture":"MovieClip/jinbi","texturelist":["bitmaps/goldReform0.png","bitmaps/goldReform1.png","bitmaps/goldReform2.png","bitmaps/goldReform3.png"],"txt":null},{"name":"putong","x":34,"y":332,"width":67,"height":74,"class":"SimpleButton","texture":"MovieClip/putong","texturelist":["bitmaps/ordinaryReform0.png","bitmaps/ordinaryReform1.png","bitmaps/ordinaryReform2.png","bitmaps/ordinaryReform3.png"],"txt":null}]}]}]';
		private var loader:Loader;
		public function TestJSON()
		{
//			var obj:Array = JSON.parse(str) as Array;
//			var xml:XML = <rec>
//				</rec>;
//			parseList(obj,xml);
//			trace(xml.toXMLString());
			loader = new Loader();
			//addChild(loader);
			initLoader();
		}
		private var _clip:MovieClip;
		private var _bitmap:Bitmap;
		public function get clip():MovieClip{
			return (this._clip);
		}
		protected function completeLoaderHandler(event:Event):void
		{
			// TODO Auto-generated method stub
			loader.contentLoaderInfo.removeEventListener(Event.COMPLETE,completeLoaderHandler);
			var libsObj:Object = loader.contentLoaderInfo.content;
			loader.unloadAndStop();
			if ((libsObj is Bitmap)){
				this._bitmap = (libsObj as Bitmap);
			} else {
				this._clip = (libsObj.getChildAt(0) as MovieClip);
			};
			addChild(bitmap);
		}
		public function get bitmap():Bitmap{
			if (((!(this._bitmap)) && (this.clip))){
				this.clip.gotoAndStop(1);
				this._bitmap = new Bitmap();
				this._bitmap.bitmapData = new BitmapData(510, 280, true, 0xFF00FF);
				this._bitmap.bitmapData.draw(this.clip);
				this.clip.gotoAndStop(this.clip.totalFrames);
			};
			return (this._bitmap);
		}
		private var xml:XML=<TextureAtlas name="Dragon" width="512" height="512">
					 <SubTexture name="parts/beardR" pX="0" pY="0" width="68" height="18" x="291" y="233"/>
					 <SubTexture name="parts/beardL" pX="54" pY="4" width="60" height="18" x="229" y="221"/>
					 <SubTexture name="parts/handR" pX="0" pY="0" width="49" height="29" x="82" y="240"/>
					 <SubTexture name="parts/armR" pX="0" pY="0" width="23" height="39" x="465" y="160"/>
					 <SubTexture name="parts/armUpperR" pX="12" pY="28" width="80" height="47" x="0" y="199"/>
					 <SubTexture name="parts/legR" pX="0" pY="0" width="90" height="116" x="401" y="0"/>
					 <SubTexture name="parts/tail" pX="0" pY="-63.8" width="108" height="139" x="291" y="0"/>
					 <SubTexture name="parts/eyeR" pX="8" pY="15" width="19" height="29" x="491" y="118"/>
					 <SubTexture name="parts/eyeL" pX="0" pY="0" width="14" height="23" x="493" y="0"/>
					 <SubTexture name="parts/head" pX="79.5" pY="160" width="169" height="197" x="0" y="0"/>
					 <SubTexture name="parts/hair" pX="0" pY="0" width="62" height="141" x="401" y="118"/>
					 <SubTexture name="parts/body" pX="0" pY="0" width="118" height="174" x="171" y="0"/>
					 <SubTexture name="parts/legL" pX="0" pY="0" width="102" height="90" x="291" y="141"/>
					 <SubTexture name="parts/handL" pX="0" pY="0" width="48" height="39" x="82" y="199"/>
					 <SubTexture name="parts/armL" pX="0" pY="0" width="24" height="40" x="465" y="118"/>
					 <SubTexture name="parts/armUpperL" pX="41" pY="16" width="56" height="43" x="229" y="176"/>
					 <SubTexture name="parts/tailTip" pX="0" pY="0" width="56" height="105" x="171" y="176"/>
					</TextureAtlas>;
		private function initLoader():void{
			var urlLoader:URLLoader = new URLLoader();
			urlLoader.addEventListener(Event.COMPLETE,completeHandler);
			urlLoader.dataFormat = URLLoaderDataFormat.BINARY;
			urlLoader.load(new URLRequest("armatureTextureSWF.swf"));
		}
		
		protected function completeHandler(event:Event):void
		{
			// TODO Auto-generated method stub
			var swf:SWF = new SWF();
			var list:Array = [];
			var ds:DefineSprite;
			swf.initBySWFData(event.target.data as ByteArray,null);
			var tagList:Vector.<Tag> = new Vector.<Tag>();
			for each(var tag:Tag in swf.tagV){
				if (DefineObjs[TagTypes.typeNameV[tag.type]]){
					list[tag.UI16Id] = tag;
				}
				switch (tag.type){
					case TagTypes.PlaceObject2:
					case TagTypes.PlaceObject3:
						ds = list[tag.getBody(((tag.type == TagTypes.PlaceObject2)) ? PlaceObject2 : PlaceObject3, null).CharacterId].getBody(DefineSprite, null);
						tagList.push(tag);
						break;
					case TagTypes.SymbolClass:
						break;
					default:
						tagList.push(tag);
				};
			}
			if (ds){
			} else {
				throw (new Error("找不到 defineSprite"));
			}
			if (xml){
			} else {
				throw (new Error("找不到 elementsXML"));
			}
			swf.tagV = tagList;
			ds.tagV.pop();
			var newTagList:Vector.<Tag> = new Vector.<Tag>();
			for each (var tt:Tag in ds.tagV) {
				switch (tt.type){
					case TagTypes.PlaceObject2:
					case TagTypes.PlaceObject3:
						var sTag:Tag = new Tag();
						sTag.initByData(tt.toData(null), 0);
						newTagList.push(sTag);
						break;
				};
			}
			for each (var nTag:Tag in newTagList) {
				var rot:RemoveObject2 = new RemoveObject2();
				rot.Depth = nTag.getBody(((nTag.type == TagTypes.PlaceObject2)) ? PlaceObject2 : PlaceObject3, null).Depth;
				var ss:Tag = new Tag();
				ss.setBody(rot);
				ds.tagV.push(ss);
			}
			var index:int = -1;
			for each (var laterTag:Tag in newTagList) {
				index++;
				var fl:FrameLabel_ = new FrameLabel_();
				fl.Name = xml.SubTexture[index].@name.toString();
				var putTag:Tag = new Tag();
				putTag.setBody(fl);
				laterTag.getBody(((laterTag.type == TagTypes.PlaceObject2)) ? PlaceObject2 : PlaceObject3, null).Depth = 1;
				var robj:RemoveObject2 = new RemoveObject2();
				robj.Depth = 1;
				var sssTag:Tag = new Tag();
				sssTag.setBody(robj);
				ds.tagV.push(putTag, laterTag, new Tag(TagTypes.ShowFrame), sssTag);
			}
			var lc:LoaderContext = new LoaderContext();
			lc.allowCodeImport = true;
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE,completeLoaderHandler);
			loader.loadBytes(swf.toSWFData(null),lc);
		}
		
		private function parseList(a:Array,xml:XML):void{
			for(var i:int = 0;i<a.length;i++){
				var obj:ItemDataVO = ItemDataVO.parse(a[i]);
				var x:XML= obj.toXML();
				xml.appendChild(x);
				var list:Array = obj.children;
				if(list&&list.length>0){
					parseList(list,x);
				}
			}
		}
	}
}