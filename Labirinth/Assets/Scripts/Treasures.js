#pragma strict

//Мягкое место
class Treasure extends LabyrinthObject {
	public var name : String;
	public var content : ArrayList;
	
	function Treasure(Content : ArrayList) {
		content = Content;
		type = TYPE_TREASURE;
		toString = function() : String {
			var res : String = "Treasure. Conntents : ";	
			for (var i = 0; i < content.Count; i++) {
				var tmp : LabyrinthObject = content[i];
				res += tmp.toString() + " ";
			}
			return res;
		};
	}
};
