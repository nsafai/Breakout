/**************
  CANVAS SETUP
**************/
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
resize();

// resize to occupy full screen
window.addEventListener("resize", function(){
  resize();
}, true);

function resize() {
  canvas.setAttribute('width', window.innerWidth * 0.9);
  canvas.setAttribute('height', window.innerHeight * 0.8);
  console.log('resize!')
}

/**************
  PADDLE SETUP
**************/
let paddleHeight = 23;
let paddleWidth = 200;
let paddleX = ((canvas.width - paddleWidth) / 2);

// draw paddle
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

/**************
   BALL SETUP
**************/
let ballRadius = 16;

// ball starting position
let x = canvas.width / 2;
let y = canvas.height - window.innerHeight * 2/3;

// distance ball should move
let dx = 4;
let dy = 4;

// draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "grey";
  ctx.fill();
  ctx.closePath();
}

/**************
 CONTROLS SETUP
**************/
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// arrow key pressed
function keyDownHandler(e) {
  console.log(e.key);
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true
  }
}
// arrow key released
function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// swiped left on mobile
document.addEventListener('swiped-left', function(e) {
  console.log(e.target); // the element that was swiped
});

document.addEventListener('swiped-right', function(e) {
  console.log(e.target); // the element that was swiped
});

/**************
 MOVE PADDLE
**************/
function movePaddle() {
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += 13;
  }
  else if(leftPressed && paddleX > 0) {
      paddleX -= 13;
  }
}
