#pragma strict

// TODO: Create Random Labyrinth;

class LabyrinthObject {
	public var type : String;
	function LabyrinthObject () {
		type = "empty";
	}
};

class Player extends LabyrinthObject {
	public var items : ArrayList;
	public var ammo : int;
	public var name : String;
	public var alive : boolean;
	function Player(Name : String, Ammo : int) {
		type = "player";
		name = Name;
		Ammo = ammo;
		alive = true;
		items = new ArrayList();
	}
};

class Treasure extends LabyrinthObject {
	public var content : String;
	function Treasure(Content : String) {
		content = Content;
		type = "treasure";
	}
};

class Labyrinth {
	public var cell : ArrayList[,];
	public var horizontWalls : String[,];
	public var verticalWalls : String[,];
	function Labyrinth(w : int, h : int) {
		cell = new ArrayList[h, w];
		horizontWalls = new String[h + 1, w];
		verticalWalls = new String[h, w + 1];
		for (var i : int = 0; i < h; i++) {
			for (var j : int = 0; j < w; j++) {
				cell[i, j] = new ArrayList();
			}
		}	
	}
}