#pragma strict

//OnPlayerDisconnected

var field : Labyrinth;
var startAmmo : int = 3;
var maxPlayer : int = 100;
var turnQueue : Queue;

function Start () {
	DontDestroyOnLoad(gameObject);
}

function initField(w : int, h : int) {
	field = new Labyrinth(w, h);
	turnQueue = new Queue(maxPlayer);
}

//пока так:
function OnPlayerDisconnected (player : NetworkPlayer) {
	Network.RemoveRPCs(player, 0);
	Network.DestroyPlayerObjects(player);
}

function addPlayer(i : int, j : int, nameP : String) {
	field.cell[i, j].Add(new Player(nameP, startAmmo));
	turnQueue();
}

//Обрабатывает ход игрока
function doTurn(turn : String, nameP : String) {
	var arr : String[] = turn.Split([' '], 3, System.StringSplitOptions.None); 
	var type : String = arr[0];
	var playerPos : Vector3 = field.findPlayer(nameP);
	var player : Player = field.cell[playerPos.x, playerPos.y][playerPos.z];
	var hasKey : boolean = false;
	for (var it : int = 0; it < player.items.Count; it++) {
		if (player.items[it] == "key") {
			hasKey = true;
		}
	}
	var netAdmin : NetworkAdmin = GameObject.Find("Administration").GetComponent(NetworkAdmin);
	var result : String;
	var nameNext : String;
	
	if (type == "move") {
		var wall : String = field.getWall(playerPos.x, playerPos.y, arr[1]);
		if (wall == "door") {
			if (hasKey) {
				//TODO : WIN!!!
			} else {
				result = "wall";
				nameNext = nameP;
			}
		}
	} else if (type == "shoot") {
		
	} else if (type == "dig") {
		
	}
	
	netAdmin.sendResultOfTurn(nameP, turn, result, nameNext);
}
