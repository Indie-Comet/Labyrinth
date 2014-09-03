#pragma strict

// Просто лежащий на полу итем
class Item extends LabyrinthObject {
	static public var ITEM_TYPE_EMPTY = 0;
	static public var ITEM_TYPE_FLOWER = 1;
	static public var ITEM_TYPE_ARMOR_PIERCING_BULLET = 2;
	static public var ITEM_TYPE_BULLET = 3;
	
	public var itemType : int;
	public var name : String;
	public var infoWindow = function(windowID : int){};
	public var hitPlayer = function(player : Player){};
	
	function Item(tmpI : int, tmpJ : int) {
		i = tmpI;
		j = tmpJ;
		name = "empty";
		itemType = ITEM_TYPE_EMPTY;
		type = TYPE_ITEM;
		toString = function() : String {
			return "item: " + name;
		};
		infoWindow = function(windowID : int) {
			GUILayout.Label("--EMPTY--");
		};
		hitPlayer = function(player : Player) {};
	}
};

class Bullet extends Item {
	function Bullet(tmpI : int, tmpJ : int) {
		super(tmpI, tmpJ);
		itemType = ITEM_TYPE_BULLET;
		name = "bullet";
		hitPlayer = function(player : Player) {
			player.life--;
			player.alive = player.life > 0;
		};
	}
	
	function Bullet() {
		this(0, 0);
	}
}

//TODO: items
