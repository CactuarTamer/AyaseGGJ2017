var fps = 30; //frames per second for animating things
var winW = window.innerWidth;
var winH = window.innerHeight;
var canvasW = winW - 50;
var canvasH = 700;
var horizon = 250;


var nightSky = [{stopPlace:0, r:13,g:4,b:65},
				{stopPlace:0.2, r:13,g:4,b:65},
				{stopPlace:0.8, r:86,g:28,b:145},
				{stopPlace:1, r:128,g:67,b:161}];

var nightSea = [{stopPlace:0, r:0,g:0,b:0},
				{stopPlace:0.2, r:0,g:0,b:0},
				{stopPlace:0.8, r:13,g:4,b:65},
				{stopPlace:1, r:13,g:4,b:65}];	

var sunsetSky = [{stopPlace:0, r:13,g:4,b:65},
				{stopPlace:0.2,   r:242,g:0,b:73},
				{stopPlace:0.6, r:225,g:116,b:0},
				{stopPlace:1, r:225,g:218,b:0}];

var sunsetSea = [{stopPlace:0, r:9,g:114,b:223},
				{stopPlace:0.8,r:13,g:4,b:65},
				{stopPlace:1, r:13,g:4,b:65}];

var sunriseSky = [{stopPlace:0, r:178,g:246,b:225},
				{stopPlace:0.4,  r:225,g:228,b:100},
				{stopPlace:0.5, r:225,g:228,b:100},
				{stopPlace:1, r:225,g:0,b:103}];

var sunriseSea = [{stopPlace:0,  r:178,g:246,b:225},
				{stopPlace:0.8, r:9,g:114,b:223},
				{stopPlace:1,r:9,g:114,b:223}];

var daytimeSky = [{stopPlace:0, r:117,g:224,b:254},
				{stopPlace:0.2, r:117,g:224,b:254},
				{stopPlace:0.6, r:40,g:148,b:218},
				{stopPlace:1, r:40,g:148,b:218}];

var daytimeSea = [{stopPlace:0, r:13,g:4,b:65},
				{stopPlace:0.8,r:9,g:114,b:223},
				{stopPlace:1, r:0,g:75,b:235}];

var dayStates = {
			
			day: {
				sky:daytimeSky,
				sea:daytimeSea
			},
			night: {
				sky:nightSky,
				sea:nightSea
			},
			sunrise: {
				sky:sunriseSky,
				sea:sunriseSea
			},
			sunset: {
				sky:sunsetSky,
				sea:sunsetSea
			}
}
var dayState = dayStates.day;
function changeDayState(){
	if(dayState == dayStates.day){
		dayState = dayStates.sunset;
	}else if(dayState == dayStates.sunset){
		dayState = dayStates.night;
	}else if(dayState == dayStates.night){
		dayState = dayStates.sunrise;
	}else if(dayState == dayStates.sunrise){
		dayState = dayStates.day;
	}else{
		console.log("something went wrong!");
	}
}

function spawnSeagull() {
    seagull = new SeaGull();
    seagull.setSeagullSpriteImage(seagullpath)
}
//console.log(dayStates);



var characterpath = "Assets/Graphics/chara1_idle-";
var seagullpath = "Assets/Graphics/emptyseagull.png";
var gravity = 10;
var wavePushback = 5;
var basePosition = 100;
var xPositionLimit = canvasW - (canvasW / 4);

class Character {

    constructor() {
        this.context = context;
        this.velocity = { x: 0, y: 0 };
        this.ready = false;
        this.jumping = false;
        this.startpos = (canvasW / 2) - (canvasW / 4);
        this.position = { x: this.startpos, y: 100 };
        this.jumpingPower = 100;
        this.img = [new Image(), new Image()];
    }

    render(frame) {
        if (this.ready) {
            this.userInput();
            this.move();
            this.context.drawImage(this.img[frame], this.position.x, this.position.y);
            console.log(frame);
        }
    }

    setCharacterSpriteImage(image) {
        var character = this;
        for (var i = 1; i <= 2 ; i++) {
            this.img[i-1].src = image + i + ".png";
        }
        this.image = this.img[0];
        this.img[0].onload = function () {
            character.ready = true;
            character.render(0);
        }
    }

    userInput() {
        var character = this;
        $(document.body).on('keydown', function (e) {
            switch(e.which)
            {
                case 32:
                    if (character.jumping == false) {
                        character.jumping = true;
                        character.velocity.y = character.jumpingPower;
                        character.velocity.x = character.jumpingPower/10;
                    }
                    break;
            }
        })
    }

    move() {
        //Update position and current velocity
        this.position.y -= this.velocity.y;
        this.velocity.y -= gravity;
        this.position.x += this.velocity.x;
        if (this.jumping == false)
        {
            this.velocity.x -= wavePushback//push back when on the ground
        }

        //clamp character position to the ground
        if (this.position.y > 100)
        {
            this.position.y = 100;
            this.jumping = false;
        }

        //clamp x position to world
        if (this.position.x < this.startpos)
        {
            this.position.x = this.startpos;
        }
        if(this.position.x > xPositionLimit)
        {
            this.position.x = xPositionLimit;
        }
    }
}

class SeaGull {
    constructor() {
        this.context = context;
        this.ready = false;
        this.startPointOffset = Math.random() * (300 - 0) + 0;
        this.playerPosition = { x: (canvasW / 2) - (canvasW / 4) + 200, y: 230 };
        this.startpos = {x: (canvasW - this.startPointOffset), y: 0}
        this.directionVector = { x: this.playerPosition.x - this.startpos.x, y: -(this.playerPosition.y - this.startpos.y) };
        this.directionVectorLength = Math.sqrt((this.directionVector.x*this.directionVector.x) + (this.directionVector.y*this.directionVector.y))
        this.normalizedVector = { x: this.directionVector.x / this.directionVectorLength, y: this.directionVector.y / this.directionVectorLength };
        this.velocity = { x: this.normalizedVector.x * 10, y: (this.normalizedVector.y * 10) };
        this.position = { x: this.startpos.x, y: 0};
    }

    render() {
        if (this.ready) {
            this.move();
            this.context.drawImage(this.image, this.position.x, this.position.y);
        }
    }

    move() {
        this.position.x += this.velocity.x;
        this.position.y -= this.velocity.y;
    }

    setSeagullSpriteImage(image) {
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

class changeBlock{
	constructor(context, xpos, ypos, width, height){
		this.context = context;
		this.pos = {x: xpos, y: ypos};
		this.size = {h: height, w:width}
		this.ready = true;
		this.color = "#000";

		//set gradient
		this.gradient = this.context.createLinearGradient(0,0,0,this.size.h+50);


	}

	setColor(rgb){
		this.color = rgb;
	}

	setGradient(gradient){
		this.gradient = this.context.createLinearGradient(0,0,0,this.size.h+50);
		for(var i = 0; i<gradient.length; i++){
			this.gradient.addColorStop(gradient[i].stopPlace, 'rgb('+gradient[i].r+','+gradient[i].g+','+gradient[i].b+')');
		}
	}



	render(){
		if(this.ready){
			this.context.fillStyle = this.gradient;
			this.context.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);	
		}
	}
}

function init(){
	canvas = document.getElementById("main");
	context = canvas.getContext("2d");
	context.canvas.width = canvasW;
	context.canvas.height = canvasH;

	mainVas = document.getElementById("main");
	mainText = mainVas.getContext("2d");
	mainText.canvas.width = canvasW;
	mainText.canvas.height = canvasH;

	skyVas = document.getElementById("sky");
	skyText = skyVas.getContext("2d");
	console.log(skyText);
	skyText.canvas.width = canvasW;
	skyText.canvas.height = canvasH;

	backVas = document.getElementById("background");
	backText = backVas.getContext("2d");
	backText.canvas.width = canvasW;
	backText.canvas.height = canvasH;



	sky = new changeBlock(skyText, 0, 0, canvasW, horizon)
	sea = new changeBlock(backText, 0, horizon, canvasW, canvasH-horizon);
	//sea.setColor("#0085D4");
	sea.setGradient(dayState.sea);
	sky.setGradient(dayState.sky);


	character = new Character();
	character.setCharacterSpriteImage(characterpath)
	spawnSeagull();
	var daytick = 0;
	var seagulltick = Math.random() * (300 - 0) + 0;
	var playerAnimationTick = 0;
	var playerAnimationFrame = 0;
    //initialize interval
	setInterval(function(){
	    mainText.clearRect(0,0,canvasW,canvasH);
	    skyText.clearRect(0,0,canvasW,canvasH);
	    backText.clearRect(0,0,canvasW,canvasH);
	    daytick++;
	    seagulltick++
	    playerAnimationTick++;
	    if(daytick >= 150){
	    	changeDayState();   	
			sea.setGradient(dayState.sea);
			sky.setGradient(dayState.sky);
			daytick = 0;
	    }
	    if (seagulltick >= 500) {
	        delete (seagull);
	        spawnSeagull();
	        seagulltick = Math.random() * (300 - 0) + 0;
	    }
	    if (playerAnimationTick >= fps/4)
	    {
	        playerAnimationFrame++
	        if(playerAnimationFrame > 1)
	        {
	            console.log("reset");
	            playerAnimationFrame = 0;
	        }
	        playerAnimationTick = 0;
	    }
	    console.log("tick!");

	    sea.render(); //draw the sea.
	    sky.render(); //draw the sea.
	    character.render(playerAnimationFrame);//draw the character
	    seagull.render();
	}, 1000/fps);
    //draw the stars

}
	
