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
	function movePlayer(name : String, i : int, j : int, direction : String) {
		var player : Player;
		var pos : int;
		for (var it : int = 0; it < cell[i][j].Count; it++) {
			if (cell[i, j][it].type == "player") {
				player = cell[i, j];
				if (player.name == name) {
					pos = it;
					break;
				}
			}
		}
		
		cell[i, j].RemoveAt(pos);
		if (direction == "up") {
			cell[i - 1, j].Add(player);
		}
		if (direction == "down") {
			cell[i + 1, j].Add(player);
		}
		if (direction == "left") {
			cell[i, j - 1].Add(player);
		}
		if (direction == "right") {
			cell[i, j + 1].Add(player);
		}
	}
	function deletePlayer() {
		
	}
}

class GameLog extends Labyrinth{
	var turn : ArrayList;
	var iStart : int;
	var jStart : int;
	var iCur : int;
	var jCur : int;
	function GameLog(w : int, h : int, border : boolean, i : int, j : int) {
		super(w, h);
		turn = new ArrayList();
		iStart = i;
		jStart = j;
		iCur = i;
		jCur = j;
		if (border) {
			for (var r : int = 0; r < h; r++) {
				verticalWalls[r, 0] = "border";
				verticalWalls[r, w] = "border";
			}
			for (var c : int = 0; c < w; c++) {
				horizontWalls[0, c] = "border";
				horizontWalls[h, c] = "border";
			}
		}
	}
	function addMove(direction : String) {
		turn.Add(direction);
		if (direction == "right") {
			jCur++;
		}
		if (direction == "left") {
			jCur--;
		}
		if (direction == "down") {
			iCur++;
		}
		if (direction == "up") {
			iCur--;
		}
	}
	function addWall(direction : String, wall : String) {
		if (direction == "up" || direction == "down") {
			var j : int = jCur;
			var i : int;
			if (direction == "up") {
				i = iCur;
			} else {
				i = iCur + 1;
			}
			horizontWalls[i][j] = wall;
		} else {
			var i : int = iCur;
			var j : int;
			if (direction == "left") {
				j = jCur;
			} else {
				j = jCur + 1;
			}
			verticalWalls[i][j] = wall;
		}
	}
}