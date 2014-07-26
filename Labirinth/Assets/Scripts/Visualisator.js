/* Рисует поле + Анимация(coming soon)
 */
#pragma strict

var wall : GameObject;
var heroObj : GameObject;
private var xSize : float;
private var ySize : float;
private var zSize : float;

function addWall(i : int, j : int, type : String, num : int) {
	if (type == "floor") { 
		var newWall : GameObject = Instantiate(wall);
		newWall.transform.position = new Vector3(j * zSize, 0, i * zSize);
		newWall.transform.rotation = new Quaternion(0, 0, 1, 1);
		newWall.name = "Wall" + num.ToString();
	}
	if (type == "horizont") {
		newWall = Instantiate(wall);
		newWall.transform.position = new Vector3(j * zSize, ySize / 2, i * zSize - zSize / 2);
		newWall.transform.rotation = new Quaternion(0, 1, 0, 1);
		newWall.name = "Wall" + num.ToString();
	}
	if (type == "vertical") {
		newWall = Instantiate(wall);
		newWall.transform.position = new Vector3(j * zSize - zSize / 2, ySize / 2, i * zSize);
		newWall.transform.rotation = new Quaternion(1, 0, 0, 1);
		newWall.name = "Wall" + num.ToString();
	}
}

function addObject(i : int, j : int, type : String, num : int) {
	var newObj : GameObject;
	if (type == "hero") {
		newObj = Instantiate(heroObj);
	}
	newObj.transform.position = new Vector3(j * zSize, ySize / 2, i * zSize);
}

//Построение с нуля по GameLog
function init(gameLog : GameLog) {
	var oldWalls = GameObject.FindGameObjectsWithTag("Wall");
	for (var obj in oldWalls) {
		Destroy(obj);
	}
	for (var i : int = 0; i < gameLog.h; i++) {
		for (var j : int = 0; j < gameLog.w; j++) {
			addWall(i, j, "floor", 0);
		}
	}
	for (i = 0; i < gameLog.h + 1; i++) {
		for (j = 0; j < gameLog.w; j++) {
//			Debug.Log(i.ToString() + ' ' + j.ToString());
			if (gameLog.horizontWalls[i, j] != "empty") addWall(i, j, "horizont", 0);
		}
	}
	for (i = 0; i < gameLog.h; i++) {
		for (j = 0; j < gameLog.w + 1; j++) {
			if (gameLog.verticalWalls[i, j] != "empty") addWall(i, j, "vertical", 0);
		}
	}
	//TODO : -->
	var scale : double = gameLog.h;
	scale /= 10;
	GameObject.Find("Main Camera").transform.position = Vector3(gameLog.w * zSize / 2, 40 * scale, 9 * scale);
	//END:
	addObject(gameLog.iCur, gameLog.jCur, "hero", 1);
}

function Start() {
	xSize = wall.transform.localScale.x;
	ySize = wall.transform.localScale.y;
	zSize = wall.transform.localScale.z;
}
