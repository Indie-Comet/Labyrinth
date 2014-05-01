#pragma strict

// Режимы меню:
enum menu_mode {
    start,
    client,
    server,
    game
}	

//buttons
var server_button : GUI_location;
var client_button : GUI_location;
var main_window : GUI_location;
var name_field : GUI_scale;
var back_button : GUI_location;
var gui_skin : GUISkin;

var mode : menu_mode;
var player_name : String;

function Start() {
    DontDestroyOnLoad(gameObject);
}

var style : GUIStyle;

function OnGUI() {
    //Начальное меню:
    if (mode == menu_mode.start) { 
        GUI.Box(main_window.position, main_window.content, gui_skin.window);
     	player_name = GUI.TextField(name_field.Convert_Scales(), player_name, 28, gui_skin.textField);
        if (GUI.Button(server_button.position, server_button.content, gui_skin.button)) {
            mode = menu_mode.server;
        }
        if (GUI.Button(client_button.position, client_button.content, gui_skin.button)) {
            mode = menu_mode.client;
        }
    }
    //Меню Сервера и игрока
    if (mode == menu_mode.client) {
        gameObject.GetComponent(client_script).enabled = true;
        if (GUI.Button(back_button.position, back_button.content, gui_skin.button)) {
            mode = menu_mode.start;
            gameObject.GetComponent(client_script).enabled = false;
        }
    }
    if (mode == menu_mode.server) {
        gameObject.GetComponent(server_script).enabled = true;
        if (GUI.Button(back_button.position, back_button.content, gui_skin.button)) {
            mode = menu_mode.start;
            gameObject.GetComponent(server_script).enabled = false;
        }
    }
    if (mode == menu_mode.game) {
//      Debug.Log("lol");
    }
}

function Update() {
    //Set buttons params//
    server_button.position = server_button.scale.Convert_Scales();
    server_button.normalize_font();
    main_window.position = main_window.scale.Convert_Scales();
    main_window.normalize_font();
    client_button.position = client_button.scale.Convert_Scales();
    client_button.normalize_font();
    back_button.position = back_button.scale.Convert_Scales();
    back_button.normalize_font();
}

















