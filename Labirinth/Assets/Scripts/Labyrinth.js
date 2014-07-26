#pragma strict

// TODO: Create Random Labyrinth;
// Delete players

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

//Мягкое место
class Treasure extends LabyrinthObject {
	public var content : String;
	function Treasure(Content : String) {
		content = Content;
		type = "treasure";
	}
};

//Ловушка (не считая мин в мягких местах, если такие будут)
class Trap extends LabyrinthObject {
	public var content : String;
	function Trap(Content : String) {
		content = Content;
		type = "trap";
	}
};

// Просто лежащий на полу итем
class Item extends LabyrinthObject {
	public var content : String;
	function Item(Content : String) {
		content = Content;
		type = "item";
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
	
	//По кордам и направлению дает новые корды.
	static function move(I : int, J : int, direction : String) : Vector2 {
		var i : int = I;
		var j : int = J;
		if (direction == "up") {
			i = i - 1;
		}
		if (direction == "down") {
			i = i + 1;
		}
		if (direction == "left") {
			j = j - 1;
		}
		if (direction == "right") {
			j = j + 1;
		}
		return Vector2(i, j);
	}

	function getWall(i : int, j : int, direction : String) {
		if (direction == "up" || direction == "down") {
			if (direction == "down") {
				i++;
			}
			return horizontWalls[i, j];
		} else {
			if (direction == "right") {
				j++;
			}
			return verticalWalls[i, j];
		}
	}

	function movePlayer(name : String, i : int, j : int, direction : String) {
		var player : Player;
		var pos : int;
		for (var it : int = 0; it < cell[i, j].Count; it++) {
			var ololo : LabyrinthObject = cell[i, j][it];
			if (ololo.type == "player") {
				player = cell[i, j][it];
				if (player.name == name) {
					pos = it;
					break;
				}
			}
		}
		
		cell[i, j].RemoveAt(pos);
		var tmp : Vector2 = Labyrinth.move(i, j, direction);
		i = tmp.x;
		j = tmp.y;
		cell[i, j].Add(player);
	}
	
	function findPlayer(name : String) : Vector3 {
		var player : Player;
		for (var i : int = 0; i < h; i++) {
			for (var j : int = 0; j < w; j++) {
				for (var it : int = 0; it < cell[i, j].Count; it++) {
					var tmp : LabyrinthObject = cell[i, j][it];
					if (tmp.type == "player") {
						player = tmp;
						if (player.name == name) {
							return Vector3(i, j, it);
						}
					}
				}
			}
		}
	}
	
	function deletePlayer() {
		//TODO:
	}
	
	function addItem(i : int, j : int, item : String) {
		cell[i, j].Add(Item(item));
	}
}

class GameLog extends Labyrinth{
	public var items : ArrayList;
	public var ammo : int;
	
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
		var tmp : Vector2 = Labyrinth.move(iCur, jCur, direction);
		iCur = tmp.x;
		jCur = tmp.y;
	}
	
	function addWall(direction : String, wall : String) {
		if (direction == "up" || direction == "down") {
			var j : int = jCur;
			var i : int = 0;
			if (direction == "up") {
				i = iCur;
			} else {
				i = iCur + 1;
			}
			horizontWalls[i, j] = wall;
		} else {
			i = iCur;
			j = 0;
			if (direction == "left") {
				j = jCur;
			} else {
				j = jCur + 1;
			}
			verticalWalls[i, j] = wall;
		}
	}
}
