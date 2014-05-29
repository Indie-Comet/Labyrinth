#pragma strict

var data : GameLog;
var playerName : String;

function init (NameP : String, w : int, h : int, border : boolean, i : int, j : int) {
	data = new GameLog(w, h, border, i, j);
	playerName = new String.Copy(NameP);
}

