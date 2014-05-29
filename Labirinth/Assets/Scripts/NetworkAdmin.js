#pragma strict

var playerName : String = "NooB"; 
var serverPrefab : GameObject;
var playerPrefab : GameObject;
var myLog : GameLog;

var w : int;
var h : int;
var map : String;
var ready : boolean;

function Start () {
	DontDestroyOnLoad(gameObject);
}

function createPlayer(name : String, w : int, h : int, i : int, j : int) {
	myLog = new GameLog(w, h, true, i, j);
	playerName = name;
	var player : GameObject = Network.Instantiate(playerPrefab, Vector3.zero, Quaternion(0, 0, 0, 0), 0);
	player.GetComponent(PlayerGameLog).init(name, w * 2, h * 2, false, w, h);
	player.name = new String.Copy(name);
	networkView.RPC("addPlayer", RPCMode.Server, i, j, name);
}

function launchServer(w : int, h : int, map : String, nameP : String, i : int, j : int) {
	var server : GameObject = Instantiate(serverPrefab);
	server.GetComponent(Server).initField(w, h);
	Application.LoadLevel(map);
	createPlayer(nameP, w, h, i, j);
}

function connectToServer(ip : String, i : int, j : int, nameP : String) {
	Network.Connect(ip, 25000);
	ready = false;
	networkView.RPC("getData", RPCMode.Server);
	while(!ready) {
		//Мoжно Сделать табличку : ОЖИДАНИЕ ОТВЕТА ОТ СЕРВЕРА...
	}
	createPlayer(nameP, w, h, i, j);
}

@RPC
function setW(a : int) {
	w = a;
}

@RPC
function setH(a : int) {
	h = a;
}

@RPC
function setMap(a : String) {
	map = a;
	ready = true;
}
