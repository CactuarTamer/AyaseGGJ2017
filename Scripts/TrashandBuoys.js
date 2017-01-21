

var obstaclePath= "Assets/Graphics/EmptyTrash.png";

class Obstacle {

    constructor() {
        this.context = context;
        this.velocity = { x: -1, y: 0 };
        this.ready = false;
        var startpos = canvasW - 200; //need to randomise Y 
        this.position = { x: startpos, y: 100 };
    }

    render() {
        if (this.ready) {
            this.context.drawImage(this.image, this.position.x, this.position.y);
        }
    }

	setObstacleSpriteImage(image) {

		var img = new Image();
		var obstacle = this;
		img.src = image;
		this.image = img;

		img.onload = function () {
			obstacle.ready = true;
			obstacle.render();
        }
    }
}

goLeft = new function(obstacle){
	obstacle.position.x += velocity.x;
	console.log("goleft called")
}

function obstacleInit(){

	obstacle = new Obstacle();
	obstacle.setObstacleSpriteImage(obstaclePath);

}



