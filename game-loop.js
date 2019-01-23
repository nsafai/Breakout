/*************
   SETTINGS
*************/
let interval = setInterval(draw, 10);
let paddleSpeed = 13;

/**************
   GAME LOGIC
**************/
function draw() {
  // clear screen every frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // redraw elements
  drawBricks();
  drawBall();
  movePaddle();
  collisionDetection();
  drawPaddle();
  // game logic
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

  else if(y + dy > canvas.height - ballRadius) {
    // check if ball touches bottom edge of canvas

    if(x > paddleX && x < paddleX + paddleWidth) {
      // check if is hitting paddle
      dy = -dy;
    }
    else {
      // console.log("GAME OVER");
      const gameover_title = document.getElementById("game-over");
      gameover_title.classList.toggle("hidden");
      // document.location.reload();
      clearInterval(interval); // Needed for Chrome to end game
    }
  }
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
