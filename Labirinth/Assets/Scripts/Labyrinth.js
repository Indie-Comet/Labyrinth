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

class Trap extends LabyrinthObject {
	public var content : String;
	function Trap(Content : String) {
		content = Content;
		type = "trap";
	}
};

class Labyrinth {
	public var w : int;
	public var h : int;
	public var cell : ArrayList[,];
	public var horizontWalls : String[,];
	public var verticalWalls : String[,];
	function Labyrinth(W : int, H : int) {
		w = W;
		h = H;
		cell = new ArrayList[h, w];
		horizontWalls = new String[h + 1, w];
		verticalWalls = new String[h, w + 1];
		for (var i : int = 0; i < h; i++) {
			for (var j : int = 0; j < w; j++) {
				cell[i, j] = new ArrayList();
			}
		}
		for (i = 0; i < h; i++) {	
			for (j = 0; j < w + 1; j++) {
				verticalWalls[i, j] = "empty";
			}
		}
		for (i = 0; i < h + 1; i++) {
			for (j = 0; j < w; j++) { 
				horizontWalls[i, j] = "empty";
			}
		}
	}
}

class GameLog extends Labyrinth{
	var turn : ArrayList;
	var iStart : int;
	var jStart : int;
	function GameLog(w : int, h : int, border : boolean, i : int, j : int) {
		super(w, h);
		turn = new ArrayList();
		iStart = i;
		jStart = j;
		if (border) {
			for (var r : int = 0; r < h; r++) {
				verticalWalls[r, 0] = "border";
				verticalWalls[r, w] = "border";
			}
			for (var c : int = 0; c < w; c++) {
				verticalWalls[0, c] = "border";
				verticalWalls[h, c] = "border";
			}
		}
	}
	function addMove(direction : String) {
		turn.Add(direction);
	}
}