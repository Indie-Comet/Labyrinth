#pragma strict

private var netAdmin : NetworkAdmin;
private var selectedLog : GameLog;
private var visualisator : Visualisator;

var selectButton : GUIObject;
var skin : GUISkin;

function Start () {
	netAdmin = GameObject.Find("Administration").GetComponent(NetworkAdmin);
	selectedLog = netAdmin.myLog;
	visualisator = GameObject.Find("Visualisator").GetComponent(Visualisator);
}

function Update () {
	visualisator.init(selectedLog);
}

private var selectNum : int = 0;

function OnGUI () {
	var otherPlayers : GameObject[] = GameObject.FindGameObjectsWithTag("GameLog");
	var names : String[] = new String[otherPlayers.length];
	for (var i : int = 0; i < otherPlayers.length; i++) {
		names[i] = otherPlayers[i].GetComponent(PlayerGameLog).playerName;
	}
	
	selectNum = GUILayout.Toolbar(selectNum, names);
	
	if (names[selectNum] == netAdmin.playerName) {
		selectedLog = netAdmin.myLog;
	} else {
		selectedLog = otherPlayers[selectNum].GetComponent(PlayerGameLog).data;
	}
}