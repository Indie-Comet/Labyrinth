#pragma strict

//OnPlayerDisconnected

var field : Labyrinth;
var startAmmo : int = 3;

function Start () {
	DontDestroyOnLoad(gameObject);
}

function initField(w : int, h : int) {
	field = new Labyrinth(w, h);
}

function OnPlayerDisconnected (player : NetworkPlayer) {
	Network.RemoveRPCs(player, 0);
	Network.DestroyPlayerObjects(player);
}

function addPlayer(i : int, j : int, nameP : String) {
	field.cell[i, j].Add(new Player(nameP, startAmmo));
}