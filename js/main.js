var num = 100;
var myScore;
var platforms = [];
var endWall = [
    {
    x: 0,
    y: 0,
    width: 10,
    height: 270
    }
];

function startGame() {
    myGamePiece = new component(30, 30, "red", 30, 120);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGamePiece.gravity = 0;
    myGameArea.start();
    myGameArea.createPlat();
    myGameArea.renderPlat();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
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
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    createPlat: function(){
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
    renderPlat: function(){
      var ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "#45597E";
      for(i=0; i<num; i++){
        ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
      }

    },
    renderWall: function(){
      var ctx = this.canvas.getContext("2d");
      ctx.fillStyle = "	#8B0000";
      ctx.fillRect(endWall[0].x, endWall[0].y, endWall[0].width, endWall[0].height);
    }
}

function component(width, height, color, x, y, type) {
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
    this.newPos = function() {
      this.gravitySpeed += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY + this.gravitySpeed;
      console.log(getGravitySpeed());
      if(getGravitySpeed() === true){
        this.gravitySpeed = 0;
      }else{
        this.gravitySpeed = 2;
      }
  }
  this.gameOver = function() {
    if(collision(myGamePiece, endWall[0]) === true || myGamePiece.y > 270){
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval);
    }
  }
}

function updateGameArea() {
  console.log(myGamePiece.x,myGamePiece.y)
  myGameArea.clear();
  myGameArea.frameNo += 1;
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
  if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
  if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
  if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -4; }
  if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }
  myScore.text = "SCORE: " + Math.round(myGameArea.frameNo/10);
  myScore.update();
  myGamePiece.newPos();
  myGamePiece.gameOver();
  myGameArea.renderPlat();
  myGameArea.renderWall();
  myGamePiece.update();
  for (i = 0; i < num; i += 1) {
    platforms[i].x += -1;
  }
}


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

var getGravitySpeed = function(){
 var i = 0;
  while(i < num){
    if(collision(myGamePiece, platforms[i])){
      return true;
    }else{
      i++;
    }
  }
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
