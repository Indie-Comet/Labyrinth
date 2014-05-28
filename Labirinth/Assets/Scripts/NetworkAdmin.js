#pragma strict

var playerName : String = "NooB"; 
var serverPrefab : GameObject;

function Start () {
	DontDestroyOnLoad(gameObject);
}

function LaunchServer(w : int, h : int, map : String) {
	var server : GameObject = Instantiate(serverPrefab);
	server.GetComponent(Server).initField(w, h);
	Application.LoadLevel(map);
}

