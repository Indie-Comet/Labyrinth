#pragma strict

var data : GameLog;

function init (w : int, h : int, border : boolean, i : int, j : int) {
	data = new GameLog(w, h, border, i, j);
}

