/**************
  CANVAS SETUP
**************/
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

/*************
  BRICK SETUP
*************/
let brickRowCount = 3;
let brickColumnCount = 5;
// let brickWidth = 75;
// let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 40;
let brickOffsetLeft = 30;

let bricks = [];
for(let c=0; c<brickColumnCount; c++) {
  bricks[c] = [];
  for(let r=0; r<brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawBricks() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
      if(bricks[c][r].status == 1) {
        let brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
        let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// resize once upon first load afte brick setup
resize();

/**************
  SCORE SETUP
**************/
let score = 0;

function drawScore() {
  ctx.font = "14px 'Press Start 2P'";
  ctx.fillStyle = "#252A2E";
  ctx.fillText("Score: "+score, 20, 28);
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
let dx = 5;
let dy = 5;

// draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "grey";
  ctx.fill();
  ctx.closePath();
}

/**************
COLLISION DETECTION
**************/
function collisionDetection() {
  for(let c=0; c<brickColumnCount; c++) {
    for(let r=0; r<brickRowCount; r++) {
      let b = bricks[c][r];
      if(b.status == 1) {
        if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
          dy = -dy;
          b.status = 0;
          score++;
          if(score == brickRowCount*brickColumnCount) {
            console.log('user won!');
            let win_banner = document.getElementById("win-banner");
            win_banner.classList.toggle("hidden");
            clearInterval(interval); // Needed for Chrome to end game
          }
        }
      }
    }
  }
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


/*************
UPDATE SIZES ON WINDOW RESIZE
*************/

window.addEventListener("resize", function(){
  resize();
}, true);

function resize() {
  console.log('resizing window, update UI!')
  // resie canvas
  canvas.setAttribute('width', window.innerWidth * 0.9);
  canvas.setAttribute('height', window.innerHeight * 0.8);

  // resize bricks
  brickWidth = (canvas.width - (brickColumnCount * brickPadding * 2)) / brickColumnCount;
  brickHeight = canvas.height * 0.02;
}
