#pragma strict

class GUIScale {
	var widthScale : double; 	// ширина
	var heigthScale : double;	// высота
	var XScale: double;	// положение центра кнопки по X
	var Yscale: double;	// положение центра кнопки по Y
	//Convert_Scales переводит масштаб кнопки в ее локальные размеры.
	//Возвращает Rect.
	function convertScales() : Rect {
		var button : Rect;
		var width = Screen.width;
		var height = Screen.height; 
		button.x = width * XScale - width * widthScale / 2;
		button.y = height * Yscale - height * heigthScale / 2;
		button.width = width * widthScale;
		button.height = height * heigthScale;
		return button;
	}
	
	// Конструктор.
	function GUIScale(width : int, heigth : int, x : int, y : int) {
		widthScale = width;
		heigthScale = heigth;
		XScale = x;
		Yscale = y;
	}
}

//класс для хранения параметров GUI обьекта (почему локация известно только Богу)
class GUIObject{
	static var normalSize : float = 30; // нормальна высота обьекта (Использюется только для вычесления размера шрифта) 
	var scale : GUIScale;
	var position : Rect;
	var style : GUIStyle;
	var normalFontSize : float; // размер шрифта при нормальной высоте.
	var content : GUIContent;
	// Изменяет размер шрифта под текущий размер обьекта.
	function normalizeFont() {
		style.fontSize = normalFontSize / normalSize * Screen.height * scale.heigthScale; 
	}
}

// ресует полоски (типо ХП или МП) в ковычки можно например писать числовое значение.
class GUIBar {									 	
	var barBackground : GUIScale;				 
	var backgroundStyle : GUIStyle;             
	var barStyle : GUIStyle;                     
	function drawBar(part : float) {            
		GUI.Label(barBackground.convertScales(), "", backgroundStyle);
		var barPos : Rect;
		barPos = barBackground.convertScales();
		barPos.width *= part;
		GUI.Label(barPos, "", barStyle);
	}
}
