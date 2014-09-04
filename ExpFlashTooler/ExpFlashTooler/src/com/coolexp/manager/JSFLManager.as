package com.coolexp.manager
{
	import adobe.utils.MMExecute;
	
	import flash.events.EventDispatcher;
	import flash.events.IEventDispatcher;
	
	public class JSFLManager extends EventDispatcher
	{
		public function JSFLManager(target:IEventDispatcher=null)
		{
			super(target);
		}
		private static var _instance:JSFLManager;
		public static function getInstance():JSFLManager{
			if(_instance==null){
				_instance = new JSFLManager();
			}
			return _instance;
		}
		public function action(jsfl:String):void{
			MMExecute(jsfl);
		}
		public function log(...args):void{
			var jsfl:String = "ExpJSFLTooler.trace('"+args.join(",")+"')";
			MMExecute(jsfl);
		}
		public function get isAvailable():Boolean{
			try {
				MMExecute("fl;");
				return (true);
			}catch(e:Error) {};
			return false;
		}
	}
}