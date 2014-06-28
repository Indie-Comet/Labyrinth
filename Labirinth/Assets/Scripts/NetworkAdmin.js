#pragma strict

var playerName : String = "NooB"; 
var serverPrefab : GameObject;
var playerPrefab : GameObject;
var myLog : GameLog;

private var W : int;
private var H : int;
private var iStart : int;
private var jStart : int;
var map : String;

//private var ready : boolean;
private var wait : boolean = false;

function Start () {
	DontDestroyOnLoad(gameObject);
}

function createPlayer(name : String, w : int, h : int, i : int, j : int) {
	myLog = new GameLog(w, h, true, i, j);
	playerName = name;
	networkView.RPC("addPlayer", RPCMode.Server, i, j, name);
	networkView.RPC("addGameLog", RPCMode.All, w, h, name, "All");
}

function launchServer(w : int, h : int, map : String, nameP : String, i : int, j : int) {
	W = w;
	H = h;
	Network.InitializeServer(32, 25000, false);
	var server : GameObject = Instantiate(serverPrefab);
	server.GetComponent(Server).initField(w, h);
	server.name = "Server";
	Application.LoadLevel(map);
	createPlayer(nameP, w, h, i, j);
}

function connectToServer(ip : String, i : int, j : int, nameP : String) {
	Network.Connect(ip, 25000);
	iStart = i;
	jStart = j;
	playerName = nameP;
	wait = true;
}

function Update() {
	if (wait) {
		if (Network.peerType == NetworkPeerType.Client) {
			networkView.RPC("getData", RPCMode.Server);
			wait = false;
		}
	}
	Debug.Log(Network.peerType);
}

var dotCount : float = 0;

function OnGUI() {
	if (Network.peerType == NetworkPeerType.Disconnected) {
		dotCount = 0;
	}
	if (Network.peerType == NetworkPeerType.Connecting) {
		var label : String = "Connecting"; 
		dotCount += Time.deltaTime;
		for (var i : int = 0; i < dotCount; i++) {
			label += ".";
		}
		GUI.Label(new Rect(100, 100, 200, 200), label);
	}
}

@RPC
function getData() {
	Debug.Log("HEAVY\\m/METALL");
	networkView.RPC("setAll", RPCMode.Others, GameObject.Find("Server").GetComponent(Server).field.w,
					 GameObject.Find("Server").GetComponent(Server).field.h, "Classic");
}

@RPC
function setAll(w : int, h : int, MAP : String) {
	W = w;
	H = h;
	map = MAP;
	createPlayer(playerName, w, h, iStart, jStart);
	Application.LoadLevel(map);
}

@RPC
function addPlayer(i : int, j : int, name	P : String) {
	GameObject.Find("Server").GetComponent(Server).addPlayer(i, j, name);
	
	var otherPlayers : GameObject[] = GameObject.FindGameObjectsWithTag("GameLog");
	for (var k : int = 0; k < otherPlayers.length; k++) {
		networkView.RPC("addGameLog", RPCMode.All, W, H, otherPlayers[k].name, nameP);	
	}
}

@RPC
function addGameLog(w : int, h : int, name : String, toName : String) {
	if (toName != "All" && toName != playerName) {
		return;
	}
	var player : GameObject = Instantiate(playerPrefab, Vector3.zero, Quaternion(0, 0, 0, 0));
	player.GetComponent(PlayerGameLog).init(name, w * 2, h * 2, false, w, h);
	player.name = new String.Copy(name);	
}