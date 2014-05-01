#pragma strict

class GUI_scale {
	var width_scale : double; 	// ширина
	var heigth_scale : double;	// высота
	var pos_x_scale: double;	// положение центра кнопки по X
	var pos_y_scale: double;	// положение центра кнопки по Y
	//Convert_Scales переводит масштаб кнопки в ее локальные размеры.
	//Возвращает Rect.
	function Convert_Scales() {
		var button : Rect;
		var width = Screen.width;
		var height = Screen.height; 
		button.x = width * pos_x_scale - width * width_scale / 2;
		button.y = height * pos_y_scale - height * heigth_scale / 2;
		button.width = width * width_scale;
		button.height = height * heigth_scale;
		return button;
	}
	
	// Конструктор.
	function GUI_scale(width : int, heigth : int, x : int, y : int) {
		width_scale = width;
		heigth_scale = heigth;
		pos_x_scale = x;
		pos_y_scale = y;
	}
}

//класс для хранения параметров GUI обьекта (почему локация известно только Богу)
class GUI_location{
	static var normal_size : float = 30; // нормальна высота обьекта (Использюется только для вычесления размера шрифта) 
	var scale : GUI_scale;
	var position : Rect;
	var style : GUIStyle;
	var normal_font_size : float; // размер шрифта при нормальной высоте.
	var content : GUIContent;
	// Изменяет размер шрифта под текущий размер обьекта.
	function normalize_font() {
		style.fontSize = normal_font_size / normal_size * Screen.height * scale.heigth_scale; 
	}
}

// ресует полоски (типо ХП или МП) в ковычки можно например писать числовое значение.
class GUI_bar {									 	
	var bar_background : GUI_scale;				 
	var background_style : GUIStyle;             
	var bar_style :GUIStyle;                     
	function draw_bar(part : float) {            
		GUI.Label(bar_background.Convert_Scales(), "", background_style);
		var bar_pos : Rect;
		bar_pos = bar_background.Convert_Scales();
		bar_pos.width *= part;
		GUI.Label(bar_pos, "", bar_style);
	}
}
