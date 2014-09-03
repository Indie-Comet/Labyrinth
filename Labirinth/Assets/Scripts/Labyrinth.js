﻿#pragma strict
/*
 * типы стен :
 * 		wall
 * 		door
 * 		empty
 * 
 * типы мягких мест :
 * 		item
 * 		ammo
 * 		trap
 * 		empty
 * 
 * типы итемов :
 * 		bullet // не совсем итем
 * 		key
 * 
 * типы ловушек : 
 * 
 */


// TODO: Return info from item;
// Delete players

class LabyrinthObject {
	public var type : String;
	public var toString = function() : String{};
	function LabyrinthObject () {
		type = "empty";
		toString = function() : String {
			return type;
		};
	}
};

// Просто лежащий на полу итем
class Item extends LabyrinthObject {
	public var content : String;
	function Item(Content : String) {
		content = Content;
		type = "item";
		toString = function() : String {
			return "item: " + content;
		};
	}
};

class Player extends LabyrinthObject {
	public var items : ArrayList;
	public var ammo : int;
	public var name : String;
	public var life : int;
	public var alive : boolean;
	function hit(item : String) {
		if (item == "bullet") {
			alive = false;
		} else {
			
		}
	}
	
	function Player(Name : String, Ammo : int, playerLife : int) {
		life = playerLife;
		type = "player";
		name = Name;
		ammo = Ammo;
		alive = true;
		items = new ArrayList();
		toString = function () : String {
			var tmp : String = "player: name = " + name + "; ammo = " + ammo.ToString() + "; life = " + 
				life.ToString() + "; alive = " + alive.ToString()+ "; items : ";
			for (var item : String in items) {
				tmp += item + ' ';
			}
			return tmp + ";";
		};
	}
	
	function take(corpse : Player) {
		ammo += corpse.ammo;
		corpse.ammo = 0;
		for (var i : String in corpse.items) {
			items.Add(i);
		}
		corpse.items = new ArrayList();
	}
};

//Ловушка if trap.life == -1 trap is endless// if trap.life == 0 trap is empty
class Trap extends LabyrinthObject {
	public var content : String;
	public var life : int;
	function Trap(Content : String, trapLife : int) {
		life = trapLife;
		content = Content;
		type = "trap";
		toString = function() : String {
			return "trap: " + content;
		};
	}
	function Trap(Content : String) {
		this(Content, -1);
	}
};

//Мягкое место
class Treasure extends LabyrinthObject {
	public var content : String;
	public var treasureType : String;
	public var trap : Trap;
	public var ammo : int;
	function Treasure(Content : String) {
		content = Content;
		type = "treasure";
		treasureType = "item";
		toString = function() : String {
			return "treasure item: " + content;
		};
	}
	
	function Treasure(trapName : Trap) {
		treasureType = "trap";
		type = "treasure";
		trap = trapName;
		toString = function() : String {
			return "treasure trap: " + trap.toString();
		};
	}
	
	function Treasure(Ammo : int) {
		treasureType = "ammo";
		type = "treasure";
		ammo = Ammo;
		toString = function() : String {
			return "treasure ammo: " + ammo.ToString();
		};
	}
	
	function Treasure() {
		treasureType = "emty";
		type = "treasure";
		toString = function() : String {
			return "treasure empty";
		};
	}
};

class DSU {
	private var parent : Vector2[,];
	public function DSU(w : int, h : int) {
		parent = new Vector2[h, w];
		for (var I : int = 0; I < h; I++) {
			for (var J : int = 0; J < w; J++) {
				parent[I, J] = new Vector2(I, J);
			}
		}
		k = w * h;
	}
	
	private function color(i : int, j : int) : Vector2 {
		var tmp : Vector2;
		if (parent[i, j] == Vector2(i, j)) {
			return new Vector2(i, j);
		} else {
			tmp = color(parent[i, j].x, parent[i, j].y);
			parent[i, j] = tmp;
			return tmp;
		}
	}
	
	public var k : int;
	
	public function merge(i1 : int, j1 : int, i2 : int, j2 : int) {
		var a : Vector2 = color(i1, j1);
		var b : Vector2 = color(i2, j2);
		if (a == b) {
			return;
		}
		k--;
		parent[b.x, b.y] = a;
	}
}

class LabyrinthData {
	var wallProb : float;
	var treasures : Array;
	var useRandomTreasure : boolean;
	var treasureCount : int;
	var loveToilets : float; // Если хочет ставить в сартир
	var staticTreasureProb : float;
	var canPutTreasureTogether : boolean;
}

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
	
	private function checkPos(i : int, j : int) : boolean {
		return (i >= 0 && i < h && j >= 0 && j < w);
	}
	
	//По кордам и направлению дает новые корды.
	static function move(I : int, J : int, direction : String) : Vector2 {
		var i : int = I;
		var j : int = J;
		if (direction == "up") {
			i = i + 1;
		}
		if (direction == "down") {
			i = i - 1;
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
			if (direction == "up") {
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
	
	function addWall(i : int, j : int, direction : String, wall : String) {
		if (direction == "up" || direction == "down") {
			if (direction == "up") {
				i++;
			}
			horizontWalls[i, j] = wall;
		} else {
			if (direction == "right") {
				j++;
			}
			verticalWalls[i, j] = wall;
		}
	}
	
	function findPlayer(name : String) : Vector3 {
		var player : Player;
		for (var i : int = 0; i < h; i++) {
			for (var j : int = 0; j < w; j++) {
				var it = 0;
				for (var tmp : LabyrinthObject in cell[i, j]) {
					if (tmp.type == "player") {
						player = tmp;
						if (player.name == name) {
							return Vector3(i, j, it);
						}
					}
					it++;
				}
			}
		}
		return Vector3(w + 1, h + 1, 1);
	}
	
	function movePlayer(name : String, direction : String) {
		var player : Player;
		var pos : Vector3 = findPlayer(name);
		
		player = cell[pos.x, pos.y][pos.z];
		cell[pos.x, pos.y].RemoveAt(pos.z);
		var tmp : Vector2 = Labyrinth.move(pos.x, pos.y, direction);
		var i : int = tmp.x;
		var j : int = tmp.y;
		cell[i, j].Add(player);
	}
	
	function killPlayer(name : String) {
		Debug.Log("Try to kill : " + name);
		var playerPos : Vector3 = findPlayer(name);
		var player : Player = cell[playerPos.x, playerPos.y][playerPos.z];
		player.alive = false;
	}
	
	function addObject(i : int, j : int, item : Object) {
		cell[i, j].Add(item);
	}

	function use(trap : Trap, player : Player) {
		//TODO: Придумать ловушки
	}

	function makeBorder() {
		for (var r : int = 0; r < h; r++) {
			verticalWalls[r, 0] = "border";
			verticalWalls[r, w] = "border";
		}
		for (var c : int = 0; c < w; c++) {
			horizontWalls[0, c] = "border";
			horizontWalls[h, c] = "border";
		}
	}

	var direct : String[] = ["up", "left", "down", "right"];
	private var wasWall : boolean[,,];
	
	//settings:
	var data : LabyrinthData;

	function create() {
		wasWall = new boolean[h, w, 4];
		var dsu = new DSU(w, h);
		
		//Строит рандомный остов.
		while (dsu.k > 1) {
			var i : int = Mathf.RoundToInt(Random.Range(-0.5 + float.Epsilon, h - 0.5 - float.Epsilon));
			var j : int = Mathf.RoundToInt(Random.Range(-0.5 + float.Epsilon, w - 0.5 - float.Epsilon));
			var k : int = Mathf.RoundToInt(Random.Range(-0.5 + float.Epsilon, 4 - 0.5 - float.Epsilon));
			var newPos : Vector2 = move(i, j, direct[k]);	
			if (checkPos(newPos.x, newPos.y)) {
				var lastk : int = dsu.k;
				dsu.merge(i, j, newPos.x, newPos.y);
				if (lastk > dsu.k) {
					wasWall[i, j, k] = true;
					wasWall[newPos.x, newPos.y, (k + 2) % 4] = true;
				}
			}
		}
		
		//Ставит  остальные стены
		for (i = 0; i < h; i++) {
			for (j = 0; j < w; j++) {
				for (k = 0; k < 4; k++) {
					if (!wasWall[i, j, k]) {
						if (Random.value < data.wallProb) addWall(i, j, direct[k], "wall");
					}
				}
			}
		}
		
		var pos : int = 0;
		
		//Put treasures
		for (i = 0; i <= data.treasureCount; i++) {
			var treasure : Treasure;
			if (i == 0)
				treasure = new Treasure("key");
			else 
				if (data.useRandomTreasure) {
					treasure = data.treasures[Mathf.FloorToInt(Random.Range(0, data.treasures.Count - float.Epsilon))];
				} else {
					treasure = data.treasures[pos++];
				}
			var treasurePos : Vector2;
			var seed : int = 0; // How many times you tried to choose
			//Choose pos:
			while (true) {
				treasurePos.x = Mathf.FloorToInt(Random.Range(0, h - float.Epsilon));
				treasurePos.y = Mathf.FloorToInt(Random.Range(0, w - float.Epsilon));
				var wallCount : int = 0;
				for (j = 0; j < 4; j++) {
					if (getWall(treasurePos.x, treasurePos.y, direct[j]) != "empty") 
						wallCount++;
				}
				var f : boolean = true;
				//check if other treasures here:
				if (!data.canPutTreasureTogether) {
					for (var obj : LabyrinthObject in cell[treasurePos.x, treasurePos.y]) {
						if (obj.type == "treasure") {
							f = false;
						}
					}
				}
				if (!f) {
					seed++;
					continue;
				}
				
				var prob : float = wallCount * data.loveToilets + Mathf.Pow(1.1, seed) - 1 + data.staticTreasureProb;
				if (Random.value < prob) {
					addObject(treasurePos.x, treasurePos.y, treasure);
					break;
				}
				seed++;
			}
		}
		
		makeBorder();
	}
}

class GameLog extends Labyrinth {
	var previousVersion : GameLog;//Если ловушка переместила тебя.
	var player : Player;
	
	var turn : ArrayList;
	var iStart : int;
	var jStart : int;
	var iCur : int;
	var jCur : int;
	function use(trap : Trap) {
		//TODO: ИФЫ
		use(trap, player);
	}
	
	function addObject(a : Object) {
		cell[iCur, jCur].Add(a);
	}
	
	function GameLog(w : int, h : int, ammo : int, life : int, border : boolean, i : int, j : int) {
		player = new Player("HERO", ammo, life);
		super(w, h);
		turn = new ArrayList();
		iStart = i;
		jStart = j;
		iCur = i;
		jCur = j;
		if (border) {
			makeBorder();
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
			if (direction == "down") {
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
