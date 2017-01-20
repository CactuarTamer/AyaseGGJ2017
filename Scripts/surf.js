var fps = 30; //frames per second for animating things
var winW = window.innerWidth;
var winH = window.innerHeight;
var canvasW = winW - 50;
var canvasH = 600;
var characterpath = "Assets/Graphics/emptysurfer.png"
class Character {

    constructor() {
        this.context = context;
        this.velocity = { x: 0, y: 0 };
        this.ready = false;
        var startpos = canvasW / 2;
        this.position = { x: startpos, y: 100 };
    }

    render() {
        if (this.ready) {
            this.context.drawImage(this.image, this.position.x, this.position.y);
        }
    }

    setCharacterSpriteImage(image) {
        var img = new Image();
        var character = this;
        img.src = image;
        this.image = img;
        img.onload = function () {
            character.ready = true;
            character.render();
        }
    }
}

function init(){
	canvas = document.getElementById("main");
	context = canvas.getContext("2d");
	context.canvas.width = canvasW;
	context.canvas.height = canvasH;
	character = new Character();
	character.setCharacterSpriteImage(characterpath)
}


