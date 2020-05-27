var num = 3; //Number of platforms generated on the level
var currentPlat = 1; //Current platorm the player is on
var myScore; //Undefined score that will increase with frames as player survies
var jumpTime = 0; //Used to time jumps in air
var platforms = []; //Initial array to store all the platforms
var endWall = [{x: 0, y: 0, width: 10, height: 270 }]; //Ending wall that follows and kills player
var enemies = [];

function startGame() { //initial function to start the game, called in index
    myGamePiece = new component(30, 30, "red", 30, 120); //the player
    myScore = new component("30px", "Consolas", "black", 280, 40, "text"); //Main score listed in corner of screen
    myGamePiece.gravity = 0;
    myGameArea.start();
    myGameArea.createPlat();
    myGameArea.renderPlat();
}

var myGameArea = {//variable for all function related to the canvas
    canvas : document.createElement("canvas"),
    start : function() {//Initalizes the canvas
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
          myGameArea.keys = (myGameArea.keys || []);
          myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
          })
        },
    clear : function() { //clears the canvas to be uptated
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    createPlat: function(){ //creates platforms and pushes them to array
      for(i = 0; i < num; i++) {
          platforms.push(
              {
              x: 100 * i * getRandomArbitrary(2,2.5),
              y: 200 + getRandomArbitrary(-40,40),
              width: 110 + getRandomArbitrary(10,40),
              height: 15
              }
          );
      }
    },
    renderPlat: function(){ //renders platforms to screen
      var ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "#45597E";
      for(i=0; i<platforms.length; i++){
        ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
      }

    },
    renderEnimies: function(){ //renders platforms to screen
      var ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "#00FF00";
      for(i=0; i<enemies.length; i++){
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
      }

    },
    newPlat: function(){ //adds new platforms to array to be rendered
      platforms.push(
          {
          x: 100+(250 * getRandomArbitrary(1.25, 1.5)) + (currentPlat*200),
          y: 200 + getRandomArbitrary(-40,40),
          width: 110 + getRandomArbitrary(10,40),
          height: 15
          }
      );
    },
    newEnemy: function(){ //adds new platforms to array to be rendered
      enemies.push(
          {
          x: 100+(250 * getRandomArbitrary(1.25, 1.5)) + (currentPlat*200),
          y: 200 + getRandomArbitrary(-40,40),
          width: 30,
          height: 30,
          }
      );
    },
    renderWall: function(){ //renders endWall to screen
      var ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "	#8B0000";
      ctx.fillRect(endWall[0].x, endWall[0].y, endWall[0].width, endWall[0].height);
    }
}

function component(width, height, color, x, y, type) { //establishs all players and entites
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 2;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() { //Updates new location of player and entites
      this.gravitySpeed += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY + this.gravitySpeed;
      if(getGravitySpeed() === true){
        this.gravitySpeed = 0;
      }else{
        this.gravitySpeed = 2;
      }
  }
  this.gameOver = function() { //Creates end state of game
    if(collision(myGamePiece, endWall[0]) === true || myGamePiece.y > 270 || getEnemyCollison() == true){
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
  }
}

function updateGameArea() { //calls all listed function every frame to update
  myGameArea.clear();
  myGameArea.frameNo += 1;
  myGamePiece.height = 30;
  myGamePiece.width = 30;
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  if(getGravitySpeed() == true){jumpTime = 0;}
  if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
  if (myGameArea.keys && myGameArea.keys[39]) {
    myGamePiece.speedX = 1;
   }
  if (myGameArea.keys && myGameArea.keys[38] && jumpTime < 50) {
    myGamePiece.speedY = -4;
    myGamePiece.height = 35;
    jumpTime++;
  }
  if (myGameArea.keys && myGameArea.keys[38] && jumpTime == 50) {
    myGamePiece.speedY = 0;
    myGamePiece.height = 30;
    jumpTime++;
  }
  if (myGameArea.keys && myGameArea.keys[40] && getGravitySpeed() === false) {myGamePiece.speedY = 1; }
  myScore.text = "SCORE: " + Math.round(myGameArea.frameNo/10);
  myScore.update();
  myGamePiece.newPos();
  myGameArea.renderEnimies();
  myGamePiece.gameOver();
  myGameArea.renderPlat();
  myGameArea.renderWall();
  myGamePiece.update();
  if((myGameArea.frameNo/10) % 8 == 0){
    myGameArea.newPlat();
    myGameArea.newEnemy();
  }
  for (i = 0; i < platforms.length; i += 1) {
    platforms[i].x += -1;
    enemies[i].x += -1;
  }

  console.log(platforms);
}

//Function to Check for Collisions between two entities
var collision = function(r1, r2) {
  if (r1.x + r1.width > r2.x &&
      r1.x < r2.x + r2.width &&
      r2.y + r2.height > r1.y &&
      r2.y < r1.y + r1.height) {
        return true;
  } else {
    return false;
  }
};

var getGravitySpeed = function(){ //checks to see if player is on a platform and stops them from falling
 var i = 0;
  while(i < platforms.length){
    if(collision(myGamePiece, platforms[i])){
      currentPlat = i;
      return true;
    }else{
      i++;
    }
  }
}

var getEnemyCollison = function(){ //checks to see if player is on a platform and stops them from falling
 var i = 0;
  while(i < enemies.length){
    if(collision(myGamePiece, enemies[i])){
      return true;
    }else{
      i++;
    }
  }
}

function getRandomArbitrary(min, max) { //gives a random number between a min and max number
  return Math.random() * (max - min) + min;
}
