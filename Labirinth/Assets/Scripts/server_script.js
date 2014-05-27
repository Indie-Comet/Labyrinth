 // Скрипт для сервера.
var start_msg : String = "Click to start";
var running_msg : String = "Waiting for oponent";
private var msg : String;
var label : GUI_location;
var start_button : GUI_location;
var map_select : GUI_location;
var map_number : int;
var maps : String[];
var gui_skin : GUISkin;

var field : Labyrinth;

function OnGUI(){
	var main_window : GUI_location = GetComponent(level_administration).main_window;
	GUI.Box(main_window.position, main_window.content, gui_skin.window);
	start_button.position = start_button.scale.Convert_Scales();
	start_button.normalize_font();
    map_select.position = map_select.scale.Convert_Scales();
    map_select.normalize_font();
	label.position = label.scale.Convert_Scales();
	label.normalize_font();
	label.content.text = msg;
	GUI.Label(label.position, label.content, gui_skin.textField);

	if (Network.peerType == Network.peerType.Disconnected) {
		start_button.content.text = "Start";
		if (GUI.Button(start_button.position, start_button.content, gui_skin.button)) {
			Network.InitializeServer(10,25000,false); 
		}
	}

	if (Network.peerType != Network.peerType.Disconnected) {
		msg= running_msg;
		start_button.content.text = "OFF";
		if (GUI.Button(start_button.position, start_button.content, gui_skin.button)) {
			Network.Disconnect();
			msg= start_msg;
		}
	}
   
    map_number = GUI.Toolbar(map_select.position, map_number, maps, gui_skin.button);
} 

function Start() {
	msg = start_msg;
}

function Update() {
}

@RPC
function get_level() {
    Debug.Log("catched");
    networkView.RPC("ready", RPCMode.All, maps[map_number]);
}