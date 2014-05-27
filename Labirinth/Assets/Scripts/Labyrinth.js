#pragma strict

// TODO: Dictionary of items
// TODO: Create Random Labyrinth;

class LabyrinthObject {
	public var type : String;
};

class Player extends LabyrinthObject {
	public var items : String[];
	public var itemsCount : int;
	public var ammo : int;
	public var name : String;
	public var alive : boolean;
	function Player(Name : String, Ammo : int) {
		name = Name;
		Ammo = ammo;
		alive = true;
		itemsCount = 0;
	}
};

class Treasure extends LabyrinthObject {
	public var content : String;
	function Treasure(Content : String) {
		content = Content;
	}
};

class Labyrinth {
	public var cell : LabyrinthObject[,];
	public var horizontWalls : boolean[,];
	public var verticalWalls : boolean[,];
	function Labyrinth(w : int, h : int) {
		
	}
}