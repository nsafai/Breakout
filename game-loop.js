/*************
   SETTINGS
*************/
let paddleSpeed = 13;
let lives = 3;

/**************
   GAME LOGIC
**************/
function draw() {
  // clear screen every frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // game logic
  drawBricks();
  drawBall();
  movePaddle();
  collisionDetection();
  drawPaddle();
  drawScore();
  drawLives();

  x += dx;
  y += dy;
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    // check if ball touches left or right edge of canvas
    dx = -dx; // "bounce" change direction
  }
  else if (y + dy < ballRadius) {
    // check if ball touches top edge of canvas
    dy = -dy; // "bounce" change direction
  }

  else if(y + dy > canvas.height - ( ballRadius / 2 )) {
    // check if ball touches bottom edge of canvas

    if(x > paddleX && x < paddleX + paddleWidth) {
      // check if is hitting paddle
      dy = -dy;
    }
    else {
      lives--;
      if(!lives) {
        const gameover_title = document.getElementById("game-over");
        gameover_title.classList.toggle("hidden");
      }
      else {
        x = canvas.width/2;
        y = canvas.height-30;
        // dx = 3;
        // dy = -3;
        paddleX = (canvas.width-paddleWidth)/2;
      }
    }
  }
  requestAnimationFrame(draw);
}

/**************
 MOVE PADDLE
**************/
function movePaddle() {
  if(rightPressed && paddleX < canvas.width-paddleWidth) {
      paddleX += paddleSpeed;
  }
  else if(leftPressed && paddleX > 0) {
      paddleX -= paddleSpeed;
  }
}

draw();
