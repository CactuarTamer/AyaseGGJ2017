var fps = 30; //frames per second for animating things
var winW = window.innerWidth;
var winH = window.innerHeight;
var canvasW = winW - 50;
var canvasH = 700;
var horizon = 250;
var isBuoy = false;
var playtime = 0;
var timetick = 0;
var score = 0;
var currenthealth = 3;


var playerAnimationTick = 0;
var playerAnimationFrame = 0;


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

var playerStates = { idle: 1, jumping: 2, blocking: 3, endingJump: 4 }
var gameStates = {start: 1, game: 2, end: 3}

function spawnSeagull() {
    seagull = new SeaGull();
    if (Math.floor((Math.random() * (10 - 0) + 0)) == 5) {
        seagull.setSeagullSpriteImage(spazzySeagullpath)
    }
    else {
        seagull.setSeagullSpriteImage(seagullpath)
    }
}
//console.log(dayStates);



var characterpath = "Assets/Graphics/chara1_idle-";
var characterJumpPath = "Assets/Graphics/chara1_jump-";
var characterBlockPath = "Assets/Graphics/chara1_block-";
var seagullpath = "Assets/Graphics/Seagull.png";
var spazzySeagullpath = "Assets/Graphics/Spazzy.png";
var obstaclePath = "Assets/Graphics/Trash.png";
var startMenuPath = "Assets/Graphics/StartScreen.png";
var replayMenuPath = "Assets/Graphics/EndScreen.png";
var obstacleSize = {h: 200, w: 100}
var gravity = 8;
var wavePushback = 5;
var basePosition = 200;
var xPositionLimit = canvasW - (canvasW / 4);
var randomVelocity;
var audio = new Audio('Assets/Audio/Calypso Medley - Trinidad&Tobago - Steel drums.mp3');
var currentGameState = gameStates.start;

//audio settings
audio.loop = true;

function resetStats(){
	playtime = 0;
	currenthealth = 3;
	timetick = 0;
	score = 0;
}


function healthcheck(){
	if(currenthealth<=0){
		currentGameState = gameStates.end;
	}
}


class Character {

    constructor() {
        this.context = context;
        this.velocity = { x: 0, y: 0 };
        this.ready = false;
        this.jumping = false;
        this.startpos = (canvasW / 2) - (canvasW / 4);
        this.position = { x: this.startpos, y: 200 };
        this.jumpingPower = 75;
        this.img = [new Image(), new Image()];
        this.imgJump = [new Image(), new Image()];
        this.imgBlock = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(),new Image()];
        this.currentState = playerStates.idle;
        this.acceptingInput = true;

    }

    render(frame) {
        var canvas = document.getElementById("main");
        var ctx = canvas.getContext("2d");
        if (this.currentState == playerStates.endingJump)
        {
            var towLineOffset = { x: 280, y: 120 };
        }
        else
        {
            var towLineOffset = { x: 300, y: 102 };
        }
        ctx.beginPath();
        ctx.moveTo(this.position.x+ towLineOffset.x, this.position.y+towLineOffset.y);
        ctx.lineTo(this.position.x + 4000, this.position.y+towLineOffset.y);
        ctx.stroke();
        if (this.ready) {
            this.userInput();
            this.move();
            if (this.currentState == playerStates.idle) {
                this.context.drawImage(this.img[frame], this.position.x, this.position.y);
            }
            else if (this.currentState == playerStates.jumping || this.currentState == playerStates.endingJump)
            {
                this.context.drawImage(this.imgJump[frame], this.position.x, this.position.y);
            }

            else if (this.currentState == playerStates.blocking) {
                this.context.drawImage(this.imgBlock[frame], this.position.x, this.position.y);
            }
        }
    }

    checkCollision(object, isBlockable) {
        var rect1 = { x: this.position.x, y: this.position.y, width: 300, height: 250 };
        var rect2 = { x: object.position.x, y: object.position.y, width: object.width, height: object.height };

        if (this.currentState == playerStates.blocking && isBlockable &&
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y) {
        	if(!object.dead){score += 50;}
            object.dead = true;
        }
        else {
            if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.height + rect1.y > rect2.y)
            {
            	if(!object.dead){
            		if(currenthealth > 0){
            			currenthealth -= 1;
            		}

       				healthcheck();
            	}
            	object.dead = true;
            }
        }
    }

    setCharacterSpriteImage(image) {
        var character = this;
        for (var i = 1; i <= 2 ; i++) {
            this.img[i-1].src = characterpath + i + ".png";
        }
        for (var i = 2; i <= 3 ; i++) {
            this.imgJump[i - 2].src = characterJumpPath + i + ".png";
        }
        
        for (var i = 0; i <= 8; i++) {
            this.imgBlock[i].src = characterBlockPath + i + ".png";
            console.log(this.imgBlock[i]);
        }
        this.image = this.img[0];
        this.img[0].onload = function () {
            character.ready = true;
            character.render(0);
        }
    }

    userInput() {
        var character = this;
        if(character.acceptingInput == true){
	        $(document.body).on('keydown', function (e) {
	        	character.acceptingInput = false;
	            switch(e.which)
	            {
	                case 32:
	                    if(character.currentState != playerStates.jumping) {
	                        character.currentState = playerStates.jumping;
	                        character.velocity.y = character.jumpingPower;
	                        character.velocity.x = character.jumpingPower / 10;
	                        playerAnimationFrame = 0;
	                        playerAnimationTick = 0;
	                    }
	                    break;
	                case 70:
	                   if (character.currentState != playerStates.jumping) {
	                       character.currentState = playerStates.blocking;
	                    if(character.currentState != playerStates.blocking)
	                       {
	                            playerAnimationFrame = 0;
	                            playerAnimationTick = 0;
	                        }
	                    }
	                    break;
	            }
	        });
	        //$(document.body).on('keyup', function (e) {
	        //    switch (e.which)  
	        //    {
	        //        case 16:
	        //            character.currentState = playerStates.idle;
	        //            character.acceptingInput = true;
	        //    }
	        //})
	    }
    }

    move() {
        //Update position and current velocity
        this.position.y -= this.velocity.y;
        this.velocity.y -= gravity;
        this.position.x += this.velocity.x;
        if (this.currentState != playerStates.jumping)
        {
            this.velocity.x -= wavePushback//push back when on the ground
        }

        //clamp character position to the ground
        if (this.position.y > basePosition)
        {
            this.position.y = basePosition;
            if (this.currentState == playerStates.jumping) {
                this.currentState = playerStates.endingJump;
            }
        }

        //clamp x position to world
        if (this.position.x < this.startpos)
        {
            this.position.x = this.startpos;
            if (this.currentState == playerStates.endingJump) {
                this.currentState = playerStates.idle;
            }
        }
        if(this.position.x > xPositionLimit)
        {
            this.position.x = xPositionLimit;
        }
    }
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function randomObstaclePath() {
    var randomInteger = getRandomArbitrary(0, 2);
    if (randomInteger == 0) {
        obstaclePath = "Assets/Graphics/Trash.png";
        obstacleSize.w = 100;
        obstacleSize.h = 200;
        isBuoy = false;
    }

    else {
        obstaclePath = "Assets/Graphics/Buoy.png";
        obstacleSize.w = 75;
        obstacleSize.h = 200;
        isBuoy = true;
        console.log(isBuoy);
    }
    //randomise velocity

}
function randomVelocitySelector() {
    randomVelocity = getRandomArbitrary(15, 26);
}

randomVelocitySelector();

//create obstacle class
class Obstacle {

    constructor() {
        this.context = context;
        this.velocity = { x: randomVelocity * -1, y: 0 };
        this.ready = false;
        var startpos = canvasW; //need to randomise Y 
        this.position = { x: startpos, y: canvasH - 300 };
        if (isBuoy) {
            console.log("hello");
            this.position.y = this.position.y - 100;
        }
        this.width = obstacleSize.w;
        this.height = obstacleSize.h;
        this.dead = false;
    }

    render() {
        if (this.ready) {
            this.context.drawImage(this.image, this.position.x, this.position.y);
        }

        //function to make obstacles go left
        this.goLeft();
    }



    goLeft() {
        this.position.x += this.velocity.x;
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


function startFunction(){
    currentGameState = gameStates.game;
}

class StartMenu {
    constructor() {
        this.context = context;
        this.ready = false;
        document.getElementById('main').addEventListener('click', startFunction,
        false
        );
    }

    render() {
        if (this.ready) {
            this.context.drawImage(this.image, 400, -50);
        }
    }

    setMenuImage() {
        var img = new Image();
        var menu = this;
        img.src = startMenuPath;
        this.image = img;
        img.onload = function () {
            menu.ready = true;
            menu.render();
        }
    }
}

function replayFunction(){
	resetStats();
    currentGameState = gameStates.start;
}


class ReplayMenu {
    constructor() {
        this.context = context;
        this.ready = false;
        document.getElementById('main').addEventListener('click', replayFunction,
        false
        );
    }

    render() {
        if (this.ready) {
            this.context.drawImage(this.image, 400, -50);
        }
    }

    setReplayImage() {
        var img = new Image();
        var replay = this;
        img.src = replayMenuPath;
        this.image = img;
        img.onload = function () {
            replayMenu.ready = true;
            replayMenu.render();
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
        this.width = 100;
        this.height = 50;
        this.dead = false;
        this.flicker = 0;
    }

    render() {
        if (this.dead)
        {
           this.flicker++
        }
        if (this.ready && this.flicker % 2 == 0 && this.flicker < 50) {
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

function zerofy(num){
	if(num >-1 && num < 10){
		numstring = '0'+num;
		return numstring;
	}else{
		return num;
	}
}

/* Can't make donuts work
class Donut {
    constructor(context, xpos) {
        this.ctx = context;
        this.ready = false;
        this.xpos = xpos;
        this.ypos = 75;
    }
    setDonut(){
    	var img = new Image();
        var donut = this;
        img.onload = function () {
            this.ready = true;
            var ctx = canvas.getContext("2d");
        	donut.ctx.drawImage(this, donut.xpos, donut.ypos);
        }
        img.src = "Assets/Graphics/lifedonut.png";
        
    }

    render() {
    	console.log("entered render... ready: "+this.ready);
        if(this.ready) {
            this.context.drawImage(this.image, this.xpos, this.ypos);
        } 
    }
}

function poplulateDonuts(context){
	var donuts = [];

	for(var i = 0; i < currenthealth; i++){
		console.log("Donut!");
		imgwidth = 60;
		var xpos =  (imgwidth*i)+50;

		var donut = new Donut(context, xpos);
		donut.setDonut();  
		donuts.push(donut);      
	}
    return donuts;
}

*/

function getTimefromTick(){
	totalseconds = Math.floor(timetick/fps);
	minutes = Math.floor(totalseconds/60);
	seconds = totalseconds % 60;
	timestring = zerofy(minutes)+":"+zerofy(seconds);
	return timestring;
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
	skyText.canvas.width = canvasW;
	skyText.canvas.height = canvasH;

	backVas = document.getElementById("background");
	backText = backVas.getContext("2d");
	backText.canvas.width = canvasW;
	backText.canvas.height = canvasH;

    replayMenu = new ReplayMenu(); 
    replayMenu.setReplayImage();

	sky = new changeBlock(skyText, 0, 0, canvasW, horizon)
	sea = new changeBlock(backText, 0, horizon, canvasW, canvasH-horizon);
	//sea.setColor("#0085D4");
	sea.setGradient(dayState.sea);
	sky.setGradient(dayState.sky);
	startMenu = new StartMenu();
	startMenu.setMenuImage();



	character = new Character();
    if (character.currentState == playerStates.idle) {
        character.setCharacterSpriteImage(characterpath);
    }
    else if (character.currentState == playerStates.jumping) {
        character.setCharacterSpriteImage(characterJumpPath);
    }

    else if (character.currentState == playerStates.blocking) {
        character.setCharacterSpriteImage(characterBlockPath);
    }

	obstacle = new Obstacle();
	obstacle.setObstacleSpriteImage(obstaclePath);
	spawnSeagull();
	var daytick = 0;
	var seagulltick = Math.random() * (300 - 0) + 0;
	//var currentDonuts = poplulateDonuts(skyText);
	//console.log(currentDonuts);
	var seconds
	audio.play();
    //initialize interval
	setInterval(function () {
	    //ALL STATES
	    mainText.clearRect(0, 0, canvasW, canvasH);
	    skyText.clearRect(0, 0, canvasW, canvasH);
	    backText.clearRect(0, 0, canvasW, canvasH);





	    //START MENU STATE
	    if (currentGameState == gameStates.start)
	    {
            document.getElementById('main').removeEventListener('click',
            replayFunction,
            false);
            document.getElementById('main').addEventListener('click', startFunction,
            false
            );
	        startMenu.render();
	        sea.render(); //draw the sea.
	        sky.render(); //draw the sea.
	    }

        if (currentGameState == gameStates.end)            
        {   document.getElementById('main').removeEventListener('click',
            startFunction,
            false);
            document.getElementById('main').addEventListener('click', replayFunction,
            false
            );
            replayMenu.render();
            sea.render(); //draw the sea.
            sky.render(); //draw the sea.
        }
	    //GAME STATE
	    if (currentGameState == gameStates.game) {
	        daytick++;
	        seagulltick++
	        playerAnimationTick++;
	        timetick++;
	        playtime = getTimefromTick();

	        if (daytick >= 150) {
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
	        if (playerAnimationTick >= fps / 4 && character.currentState == playerStates.idle) {
            playerAnimationFrame++
            if (playerAnimationFrame > 1) {
                playerAnimationFrame = 0;
            }
            playerAnimationTick = 0;
        }
        else if (character.currentState == playerStates.jumping) {
            playerAnimationFrame = 0;
        }
        else if (character.currentState == playerStates.endingJump) {
            playerAnimationFrame = 1;
        }
        
        else if(playerAnimationTick >= fps/4 && character.currentState == playerStates.blocking)
        {
            playerAnimationFrame++;
            if(playerAnimationFrame > 6 && playerAnimationFrame <=7){
                playerAnimationFrame = 7;
                playerAnimationFrame++;
            }else if(playerAnimationFrame > 7){
                character.currentState = playerStates.idle;
                playerAnimationFrame = 0;
            	character.acceptingInput = true;
            }
            console.log(playerAnimationFrame);

        }

        if (obstacle.position.x < 0 - 200) //insert obstacle width if possible
        {
            randomVelocitySelector();
            randomObstaclePath();
            obstacle = new Obstacle();
            obstacle.setObstacleSpriteImage(obstaclePath);

        }
	        // console.log("tick!");
	        character.checkCollision(obstacle, false);
	        character.checkCollision(seagull, true);
	        sea.render(); //draw the sea.
	        sky.render(); //draw the sea.
	        character.render(playerAnimationFrame);//draw the character
	        obstacle.render();//draw the obstacle
	        seagull.render();

	        
	        var healthstring = "";
	        for(var i = 0; i < currenthealth; i++){

	        	healthstring += "&#x2764;";

	        	//heart = String.fromCharCode(c);
	        }


	        if(dayState == dayStates.sunset || dayState == dayStates.night){backText.fillStyle = "white";}
	        else {backText.fillStyle = "black";}
	        backText.font = "30px Arial";

	        //Labels
	        backText.fillText("Score:",20,50);
	        backText.fillText("Time:",300,50);

	        backText.font = "40px Arial";
	        //Numbers
	        backText.fillText(score,150,50);
	        backText.fillText(playtime,400,50);


	        for(var i = 0; i < currenthealth; i++){
	        	xpos = 60*i;
	        	var h="10084";
	        	backText.fillText(String.fromCharCode(h),xpos+20,100);
	        }
	        

	    }
        //END GAME STATE



        //Indicators
		

		

	}, 1000/fps);
    //draw the stars

}
	
