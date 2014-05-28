#pragma strict

var field : Labyrinth;

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