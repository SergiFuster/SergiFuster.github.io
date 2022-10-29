var ball;
var leftBar;
var rightBar;

function startGame() {
  myGameArea.start();
  leftBar = new component(15, 100, "black", 0, myGameArea.canvas.height/2-50);
  rightBar = new component(15, 100, "black", myGameArea.canvas.width-16, myGameArea.canvas.height/2-50);
  ball = new component(15, 15, "black", myGameArea.canvas.width/2, myGameArea.canvas.height/2);
  ball.speedX = 2;
  ball.speedY = 2;
}

var myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext("2d");
    document.getElementById("gameContainer").appendChild(this.canvas);
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

  stop : function() {
    clearInterval(this.interval);
  }

}

function component(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.update = function(){
    ctx = myGameArea.context;
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  this.newPos = function(){
    this.x += this.speedX;
    this.y += this.speedY;
  }

  this.OnContactWith = function(otherobj){
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var contact = true;
    if ((mybottom < othertop) ||
    (mytop > otherbottom) ||
    (myright < otherleft) ||
    (myleft > otherright)) {
      contact = false;
    }
    return contact;
  }
}

function updateGameArea() {
  myGameArea.clear();
  if(leftBar.y >= myGameArea.canvas.height){
    leftBar.y = -leftBar.height;
  }
  else if (leftBar.y <= -leftBar.height) {
    leftBar.y = myGameArea.canvas.height;
  }
  leftBar.speedY = 0;
  if (myGameArea.keys && myGameArea.keys[87]) {leftBar.speedY = -2; }
  if (myGameArea.keys && myGameArea.keys[83]) {leftBar.speedY = 2; }

  //Ball bouncing
  if(ball.y+ball.height >= myGameArea.canvas.height || ball.y <= 0){ //Up and down walls
    ball.speedY = -ball.speedY;
  }

  if(ball.x <= 0 || ball.x+ball.width >= myGameArea.canvas.width){ //Side walls
    myGameArea.stop();
  }

  if(leftBar.OnContactWith(ball) || rightBar.OnContactWith(ball)){ //Bars
    ball.speedX = -ball.speedX;
  }

  //IA
  if(ball.speedX > 0 && ball.x > myGameArea.canvas.width/2){
    if(ball.y > rightBar.y + rightBar.width/2){
      rightBar.speedY = 2;
    }
    else if (ball.y < rightBar.y - rightBar.width/2) {
      rightBar.speedY = -2;
    }
    else{
      rightBar.speedY = 0;
    }
  }
  else{
    rightBar.speedY = 0;
  }


  leftBar.newPos();
  leftBar.update();
  rightBar.newPos();
  rightBar.update();
  ball.newPos();
  ball.update();

}

function moveUpLeftBar(){
  leftBar.speedY -= 1;
}

function moveDownLeftBar(){
  leftBar.speedY += 1;
}

function stopMoveLeftBar(){
  leftBar.speedX = 0;
  leftBar.speedY = 0;
}
