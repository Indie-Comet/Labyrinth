#pragma strict

var field : Labyrinth;
var startAmmo : int = 3;

function Start () {
	DontDestroyOnLoad(gameObject);
	Network.InitializeServer(32, 25000, false);
}

function initField(w : int, h : int) {
	field = new Labyrinth(w, h);
}

function OnPlayerDisconnected (player : NetworkPlayer) {
	Network.RemoveRPCs(player, 0);
	Network.DestroyPlayerObjects(player);
}

/*function addPlayer(i : int, j : int, nameP : String) {
	field.cell[i, j].Add(new Player(nameP, startAmmo));
}*/

@RPC
function getData() {
	networkView.RPC("setW", RPCMode.All, field.w);
	networkView.RPC("setH", RPCMode.All, field.h);
	networkView.RPC("setMap", RPCMode.All, "Classic");
}

@RPC
function addPlayer(i : int, j : int, nameP : String) {
	field.cell[i, j].Add(new Player(nameP, startAmmo));
}