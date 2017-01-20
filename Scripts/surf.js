var fps = 30; //frames per second for animating things
var winW = window.innerWidth;
var winH = window.innerHeight;
var canvasW = winW - 50;
var canvasH = 600;

function init(){
	canvas = document.getElementById("main");
	context = canvas.getContext("2d");

	context.canvas.width = canvasW;
	context.canvas.height = canvasH;
}

