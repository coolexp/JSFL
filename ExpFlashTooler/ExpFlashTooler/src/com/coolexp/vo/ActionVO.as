package com.coolexp.vo
{
	
	[Bindable]
	public class ActionVO
	{
		public function ActionVO()
		{
		}
		public var label:String;
		public var action:String;
		public static function parse(xml:Object):ActionVO{
			var av:ActionVO = new ActionVO();
			av.label = xml.label;
			av.action = xml.action;
			return av;
		}
	}
}