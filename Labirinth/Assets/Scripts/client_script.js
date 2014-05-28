// Скрипт для клиента

var connected = 0; //состояние соединения
var server_ip : String; // ip сервера (вводиться игрогом)
var connect_button : GUI_location;
var ip_field : GUI_location;
var gui_skin : GUISkin;

private var maps : String[];
  
function Start() {
    maps = GetComponent(server_script).maps; 
}
 
function OnGUI(){ 
	var main_window : GUI_location = GetComponent(level_administration).main_window;
	GUI.Box(main_window.position, main_window.content, gui_skin.window);
	ip_field.normalize_font();
	connect_button.normalize_font();
	
	//Если не подключены к серверу:
	if(Network.peerType == Network.peerType.Disconnected){ 
		server_ip = GUI.TextField(ip_field.scale.Convert_Scales(), server_ip, 25, gui_skin.textField);
		if (GUI.Button(connect_button.scale.Convert_Scales(), connect_button.content, gui_skin.button)) {	
			Network.Connect(server_ip,25000);
   			connected = 0; 
  		}
 	}
	 
	// Если подключены то шлем RPC о том что мы готовы. 
	if(Network.peerType != Network.peerType.Disconnected && connected == 0){
		networkView.RPC("get_level", RPCMode.All);
		connected = 1; 
	 } 

	if(Network.peerType != Network.peerType.Disconnected && connected == 1){
	}
} 

@RPC
function ready (map : String){
    Debug.Log("ready catched");
    GetComponent(network_script).enabled = true;
    Application.LoadLevel(map);
    GetComponent(level_administration).mode = menu_mode.game;
//    GetComponent(level_administration).Turn_Mouse_Look(true);
    GetComponent(server_script).enabled = false;
    GetComponent(client_script).enabled = false;
}