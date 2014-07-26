#pragma strict

enum menuMode {
	client,
	server,
	main
}

var serverButton : GUIObject;
var clientButton : GUIObject;
var backButton : GUIObject;
var nameField : GUIObject;
var createButton : GUIObject;
var connectButton : GUIObject;
var ipField : GUIObject;
var skin : GUISkin;
var mode : menuMode;
var	sizeArea : GUIScale;

var minSize : int;
var maxSize : int;
var playerName : String;
private var w : int;
private var h : int;
var iStart : int = 0;
var jStart : int = 0;
private var ip : String = "localhost";

function Start() {
	w = minSize;
	h = minSize;
}

function OnGUI () {	
	serverButton.normalizeFont();
	clientButton.normalizeFont();
	ipField.normalizeFont();
	nameField.normalizeFont();
	backButton.normalizeFont();
	createButton.normalizeFont();
	
	if (mode == menuMode.main) {
		if (GUI.Button(serverButton.scale.convertScales(), serverButton.content, skin.button)) {
			mode = menuMode.server;
		}
		if (GUI.Button(clientButton.scale.convertScales(), clientButton.content, skin.button)) {
			mode = menuMode.client;
		}
		playerName = GUI.TextField(nameField.scale.convertScales(), playerName, skin.textArea);
	}
	if (mode != menuMode.main) {
		if (GUI.Button(backButton.scale.convertScales(), backButton.content, skin.button)) {
			mode = menuMode.main;
		}
		iStart = int.Parse(GUI.TextField(new Rect(50, 50, 100, 30), iStart.ToString()));
		jStart = int.Parse(GUI.TextField(new Rect(50, 100, 100, 30), jStart.ToString()));
	}
	if (mode == menuMode.server) {
		GUILayout.BeginArea(sizeArea.convertScales());
			GUILayout.BeginVertical();
				GUILayout.Box("Width of field : ", GUILayout.Height(sizeArea.convertScales().height / 5));
				GUILayout.BeginHorizontal();
					w = GUILayout.HorizontalSlider(w, minSize, maxSize, GUILayout.Height(sizeArea.convertScales().height / 5));
					var tmp : String = w.ToString();
					if (w == 0) tmp = "";
					tmp = GUILayout.TextField(tmp, GUILayout.Width(sizeArea.convertScales().width / 4), GUILayout.Height(sizeArea.convertScales().height / 6));
					if (tmp == "") w = 0; 
					else w = Mathf.Max(Mathf.Min(int.Parse(tmp), maxSize), minSize);
				GUILayout.EndHorizontal();
				
				GUILayout.Box("Height of field : ", GUILayout.Height(sizeArea.convertScales().height / 5));
				GUILayout.BeginHorizontal();
					h = GUILayout.HorizontalSlider(h, minSize, maxSize, GUILayout.Height(sizeArea.convertScales().height / 5));
					tmp = h.ToString();
					if (h == 0) tmp = "";
					tmp = GUILayout.TextField(tmp, GUILayout.Width(sizeArea.convertScales().width / 4), GUILayout.Height(sizeArea.convertScales().height / 6));
					if (tmp == "") h = 0; 
					else h = Mathf.Max(Mathf.Min(int.Parse(tmp), maxSize), minSize);
				GUILayout.EndHorizontal();
			GUILayout.EndVertical();
		GUILayout.EndArea();
		
		if (GUI.Button(createButton.scale.convertScales(), createButton.content, skin.button)) {
			GameObject.Find("Administration").GetComponent(NetworkAdmin).launchServer(w, h, "Classic", playerName, iStart, jStart);
		}
	}
	
	if (mode == menuMode.client) {
		ip = GUI.TextField(ipField.scale.convertScales(), ip, skin.textField);
		if (GUI.Button(connectButton.scale.convertScales(), connectButton.content, skin.button)) {
			GameObject.Find("Administration").GetComponent(NetworkAdmin).connectToServer(ip, iStart, jStart, playerName);
		}
	}
}
