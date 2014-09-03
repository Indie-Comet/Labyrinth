﻿#pragma strict
//OnPlayerDisconnected

var players : Hashtable;
var field : Labyrinth;

private var startAmmo : int = 3;
private var startLife : int = 1;
private var maxPlayer : int = 100;

private var turnQueue : MyQueue;
private var turnPlayer : String;
private var tmpQueue : MyQueue;
private var netAdmin : NetworkAdmin;
private var serverData : ServerData;

function Start () {
	commandLog = new Array();
	DontDestroyOnLoad(gameObject);
	netAdmin = GameObject.Find("Administration").GetComponent(NetworkAdmin);
}

function initField() {
	serverData = GameObject.Find("Server Data").GetComponent(ServerData);
	var w : int = serverData.weight;
	var h : int = serverData.height;
	startAmmo = serverData.startAmmo;
	startLife = serverData.startLife;
	maxPlayer = serverData.maxPlayers;
	
	field = new Labyrinth(w, h);
	
	field.data = serverData.data;
	
	field.create();
	
	turnQueue = new MyQueue(maxPlayer);
	players = new Hashtable();
}

//Вход выход игроков
function killPlayer(name : String) {
	if (turnPlayer == name) {
		turnPlayer = turnQueue.pop();
		netAdmin.sendWhoNext(turnPlayer);
		return;
	}
	field.killPlayer(name);
	tmpQueue = new MyQueue(maxPlayer);
	while (!turnQueue.empty()) {
		var nameP : String = turnQueue.pop();
		if (nameP != name) tmpQueue.push(nameP);
	}
	turnQueue = tmpQueue;
}

function OnPlayerDisconnected (player : NetworkPlayer) {
	var ip : String = player.externalIP;
	Debug.Log(ip + " - DISCONNECTED");
	killPlayer(players[ip]);
	Network.RemoveRPCs(player, 0);
	Network.DestroyPlayerObjects(player);
}

function addPlayer(i : int, j : int, nameP : String, player : NetworkPlayer) {
	Debug.Log("addPlayer " + nameP);
	field.cell[i, j].Add(new Player(nameP, startAmmo, startLife));
	turnQueue.push(nameP);
	var ip : String = player.externalIP;
	Debug.Log(ip + ' ' + nameP);
	if (!players.Contains(ip))
		players.Add(ip, nameP);
}

//Обрабатывает движение игрока
function move(nameP : String, direction : String) {
	var result : String;
	var nameNext : String;
	var hasKey : boolean = false;
	var playerPos : Vector3 = field.findPlayer(nameP);
	var player : Player = field.cell[playerPos.x, playerPos.y][playerPos.z];
	for (var it : int = 0; it < player.items.Count; it++) {
		if (player.items[it] == "key") {
			hasKey = true;
		}
	}
	var wall : String = field.getWall(playerPos.x, playerPos.y, direction);
	
	if (wall == "door") {
		if (hasKey) {
			//TODO : WIN!!!
			Debug.Log(nameP + " - WINNER!!!");
		} else {
			result = "wall";
			nameNext = nameP;
		}
	} else if (wall == "empty") {
		nameNext = turnQueue.pop() || nameP;
		turnQueue.push(nameP);
		field.movePlayer(nameP, direction);
		playerPos = field.findPlayer(nameP);
		player = field.cell[playerPos.x, playerPos.y][playerPos.z];
		var traps : Array = new Array();
		var trap : Trap;
		var corpses : Array = new Array();
		var corpse : Player;
		var treasure : boolean;
		var obj : LabyrinthObject;
		
		for (obj in field.cell[playerPos.x, playerPos.y]) {
			if (obj.type == "treasure") {
				treasure = true;
			} else if (obj.type == "player") {
				corpse = obj;
				if (corpse.alive == false) corpses.Add(corpse); 
			} else if (obj.type == "trap") {
				trap = obj;
				if (trap.life != 0) traps.Add(trap);
			}
		}
		
		result = "move";
		result += ' ' + corpses.Count.ToString();
		for (corpse in corpses) {
			player.take(corpse);
			result += ' ' + corpse.name;
		}
		result += ' ' + traps.Count.ToString();
		for (trap in traps) {
			result += ' ' + trap.content;
			field.use(trap, player);
		}
		if (treasure) {
			result += ' 1';
		} else {
			result += ' 0';
		}
	} else {
		result = "wall";
		nameNext = nameP;
	}
	
	turnPlayer = nameNext;
	netAdmin.sendResultOfTurn(nameP, "move " + direction, result, nameNext);
}

function shoot(nameP : String, direction : String, item : String) {
	var result : String = "";
	var nameNext : String;
	var playerPos : Vector3 = field.findPlayer(nameP);
	var player : Player = field.cell[playerPos.x, playerPos.y][playerPos.z];
	var tmpPlayer : Player;
	var corpses : Array = new Array();
	var victims : Array = new Array();
	
	if (item == "bullet") {
		player.ammo--;
		var pos : Vector2 = new Vector2(playerPos.x, playerPos.y);
		for (; field.getWall(playerPos.x, playerPos.y, direction) == "empty";) {
			for (var obj : LabyrinthObject in field.cell[pos.x, pos.y]) {
				if (obj.type == "player") {
					tmpPlayer = obj;
					if (tmpPlayer.name != nameP) {
						victims.Add(tmpPlayer);
					}
				}
			}
			if (victims.Count) {
				break;
			}
			pos = Labyrinth.move(pos.x, pos.y, direction);
		}
		
		result += victims.Count;
		for (tmpPlayer in victims) {
			result += ' ' + tmpPlayer.name;
			tmpPlayer.hit(item);
			if (tmpPlayer.alive == false) {
				killPlayer(tmpPlayer.name);
			}
		}
		
		if (playerPos.x == pos.x && playerPos.y == pos.y) {
			result += " 1";
		} else {
			result += " 0";
		}
	} else {
		
	}
	
	nameNext = turnQueue.pop() || nameP;
	turnQueue.push(nameP);
	turnPlayer = nameNext;
	netAdmin.sendResultOfTurn(nameP, "shoot " + direction + ' ' + item, result, nameNext);
}

function dig(nameP : String) {
	var result : String = "";
	var nameNext : String;
	var playerPos : Vector3 = field.findPlayer(nameP);
	var player : Player = field.cell[playerPos.x, playerPos.y][playerPos.z];
	var treasure : Treasure;
	var treasures : Array = new Array();
	var findEmpty : boolean = false;
	
	for (var it : LabyrinthObject in field.cell[playerPos.x, playerPos.y]) {
		if (it.type == "treasure") {
			treasure = it;
			if (treasure.treasureType != "empty" || !findEmpty) 
				treasures.Add(treasure);
			findEmpty |= treasure.treasureType == "empty";
		}
	}
	
	result = treasures.Count.ToString();
	for (treasure in treasures) {
		result += ' ' + treasure.treasureType;
		if (treasure.treasureType == "item") {
			result += ' ' + treasure.content;
			player.items.Add(treasure.content);
		} else if (treasure.treasureType == "ammo") {
			result += ' ' + treasure.ammo.ToString();
			player.ammo += treasure.ammo;
		} else if (treasure.treasureType == "trap") {
			result += ' ' + treasure.trap.content;
			field.use(treasure.trap, player);
		} else if (treasure.treasureType == "empty") {
			result += " empty";
		} 
		treasure.treasureType = "empty";
		treasure.toString = new Treasure().toString;
	}
	
	nameNext = turnQueue.pop() || nameP;
	turnQueue.push(nameP);
	turnPlayer = nameNext;
	netAdmin.sendResultOfTurn(nameP, "dig", result, nameNext);
}

function doTurn(turn : String, nameP : String) {
	if (nameP != turnPlayer) {
		commandLog.Add("Server>'" + nameP + "' try to do turn. turnPlayer = " + turnPlayer);
		return;
	}
	commandLog.Add(nameP + ":>" + turn);
	var arr : String[] = turn.Split([' '], 3, System.StringSplitOptions.None); 
	var type : String = arr[0];
	
	if (type == "move") {
		move(nameP, arr[1]);
	} else if (type == "shoot") {
		shoot(nameP, arr[1], arr[2]);
	} else if (type == "dig") {
		dig(nameP);
	}
}

function startGame() {
	turnPlayer = turnQueue.pop();
	netAdmin.sendWhoNext(turnPlayer);
}

var isConsoleOpen : boolean = false;
var command : String = "";
var commandLog : Array;
var scrollPosition : Vector2 = new Vector2(0, 0);
var consoleStyle : GUIStyle;
var consoleButtonPressed : boolean = false;

function doCommand(command : String) {
	var com : String[] = command.Split([' '], 100, System.StringSplitOptions.None);
	var pos : Vector3;
		var player : Player;
	if (com[0] == "kill") {
		killPlayer(com[1]);
	} else if (com[0] == "give") {
		pos = field.findPlayer(com[1]);
		player = field.cell[pos.x, pos.y][pos.z];
		player.items.Add(com[2]);
		netAdmin.sendResultOfTurn(com[1], "dig", "1 item " + com[2], "Server");
	} else if (com[0] == "stat") {
		pos = field.findPlayer(com[1]);
		player = field.cell[pos.x, pos.y][pos.z];
		commandLog.Add(player.toString());
		commandLog.Add("           position = " + pos.x.ToString() + ' ' + pos.y.ToString());
	} else if (com[0] == "give_ammo") {
		pos = field.findPlayer(com[1]);
		player = field.cell[pos.x, pos.y][pos.z];
		player.ammo += int.Parse(com[2]);
		netAdmin.sendResultOfTurn(com[1], "dig", "1 ammo " + com[2], "Server");
	} else if (com[0] == "set_turn") {
		turnQueue.push(turnPlayer);
		turnPlayer = com[1];
		netAdmin.sendWhoNext(com[1]);
	} else if (com[0] == "add") {
		var tmpos : Vector2 = new Vector2(int.Parse(com[1]), int.Parse(com[2]));
		if (com[3] == "trap") {
			field.cell[tmpos.x, tmpos.y].Add(new Trap(com[4]));
		} else if (com[3] == "treasure"){
			if (com[4] == "trap") {
				field.cell[tmpos.x, tmpos.y].Add(new Treasure(new Trap(com[5])));
			} else if (com[4] == "ammo") {
				field.cell[tmpos.x, tmpos.y].Add(new Treasure(int.Parse(com[5])));
			} else if (com[4] == "item") {
				field.cell[tmpos.x, tmpos.y].Add(new Treasure(com[5]));
			}
		}
	} else if (com[0] == "get") {
		tmpos = new Vector2(int.Parse(com[1]), int.Parse(com[2]));
		for (var obj : LabyrinthObject in field.cell[tmpos.x, tmpos.y]) {
			commandLog.Add(obj.toString());
		}
	} else if (com[0] == "get_wall") {
		tmpos = new Vector2(int.Parse(com[1]), int.Parse(com[2]));
		commandLog.Add(field.getWall(tmpos.x, tmpos.y, com[3]));
	} else if (com[0] == "add_wall") {
		tmpos = new Vector2(int.Parse(com[1]), int.Parse(com[2]));
		field.addWall(tmpos.x, tmpos.y, com[3], com[4]);
	}
}

function Update() {
}

function OnGUI() {
	if (isConsoleOpen) {
		GUI.Window(0, new Rect(0, 0, Screen.width, Screen.height / 3), console, "Server Console", consoleStyle);
	}
	if (Event.current.type == EventType.KeyUp && Event.current.keyCode == KeyCode.BackQuote) {
		isConsoleOpen = !isConsoleOpen;
	}
}

function console(windowID : int) {
	scrollPosition = GUILayout.BeginScrollView (scrollPosition, GUILayout.MaxHeight(Screen.height / 3 - 20));
		var text : String = "";
		for (var com : String in commandLog)
			text += com + '\n';
		GUILayout.Label(text);
	GUILayout.EndScrollView();
	
	GUI.SetNextControlName ("cmd");
	command = GUI.TextField(new Rect(0, Screen.height / 3 - 20, Screen.width, 20), command);
	GUI.FocusControl ("cmd");
	if (Event.current.isKey && Event.current.keyCode == KeyCode.Return &&
			GUI.GetNameOfFocusedControl () == "cmd" && command != "") {
		commandLog.Add(">>>" + command);
		scrollPosition.y = 10000000;
		doCommand(command);
		command = "";
	}
} 
