/* eslint-disable semi */
/* eslint-disable no-undef */

/* SETTINGS */
const paddleSpeed = 13
let lives = 3

/* CANVAS SETUP */
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

/* BRICK SETUP */
const brickRowCount = 3
const brickColumnCount = 5
let brickWidth = 75
let brickHeight = 20
const brickPadding = 20
const brickOffsetTop = 60
const brickOffsetLeft = 80

const bricks = []
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = []
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

/* UPDATE SIZES ON WINDOW RESIZE */

function resize() {
  console.log('resizing window, update UI!')
  // resie canvas
  canvas.setAttribute('width', window.innerWidth * 0.9)
  canvas.setAttribute('height', window.innerHeight * 0.8)

  // resize bricks
  brickWidth = (canvas.width - 240) / brickColumnCount
  brickHeight = canvas.height * 0.02
}

window.addEventListener('resize', () => resize(), true)

// resize once upon first load afte brick setup
resize()

/* SCORE SETUP */
let score = 0

function drawScore() {
  ctx.font = '16px \'Press Start 2P\''
  ctx.fillStyle = '#252A2E'
  ctx.fillText(`Score: ${score}`, 20, 38)
}

/* LIVES SETUP */
function drawLives() {
  ctx.font = '16px \'Press Start 2P\''
  ctx.fillStyle = '#252A2E'
  ctx.fillText(`Lives: ${lives}`, canvas.width - 145, 38)
}

/* PADDLE SETUP */
const paddleHeight = 23
const paddleWidth = 200
let paddleX = ((canvas.width - paddleWidth) / 2)

// draw paddle
function drawPaddle() {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#e67e22'
  ctx.fill()
  ctx.closePath()
}

/* BALL SETUP */
const ballRadius = 16

// ball starting position
let x = canvas.width / 2
let y = canvas.height - window.innerHeight * (1 / 2)

// distance ball should move
let dx = 7
let dy = 7

// draw ball
function drawBall() {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = 'grey'
  ctx.fill()
  ctx.closePath()
}

/* COLLISION DETECTION */
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const b = bricks[c][r]
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy
          b.status = 0
          score += 1
          if (score === brickRowCount * brickColumnCount) {
            console.log('user won!')
            const winBanner = document.getElementById('win-banner')
            winBanner.classList.toggle('hidden')
          }
        }
      }
    }
  }
}

/* CONTROLS SETUP */
let rightPressed = false
let leftPressed = false

/* KEYBOARD CONTROLS */
// arrow key pressed
function keyDownHandler(e) {
  console.log(e.key)
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true
  }
}
// arrow key released
function keyUpHandler(e) {
  if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false
  }
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

/* MOUSE CONTROLS */
function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
}

document.addEventListener('mousemove', mouseMoveHandler, false)

/* MOVE PADDLE */
function movePaddle() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += paddleSpeed
  } else if (leftPressed && paddleX > 0) {
    paddleX -= paddleSpeed
  }
}

/* MOBILE CONTROLS (WIP) */
document.addEventListener('swiped-left', (e) => {
  console.log(e.target); // the element that was swiped
})

document.addEventListener('swiped-right', (e) => {
  console.log(e.target); // the element that was swiped
})

/* GAME LOGIC */
function draw() {
  // clear screen every frame
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // game logic
  drawBricks()
  drawBall()
  movePaddle()
  collisionDetection()
  drawPaddle()
  drawScore()
  drawLives()

  x += dx
  y += dy 
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    // check if ball touches left or right edge of canvas
    dx = -dx; // 'bounce' change direction
  } else if (y + dy < ballRadius) {
    // check if ball touches top edge of canvas
    dy = -dy; // 'bounce' change direction
  } else if (y + dy > canvas.height - (ballRadius / 2)) {
    // check if ball touches bottom edge of canvas

    if (x > paddleX && x < paddleX + paddleWidth) {
      // check if is hitting paddle
      dy = -dy
    } else {
      lives -= 1
      if (!lives) {
        const gameoverTitle = document.getElementById('game-over')
        gameoverTitle.classList.toggle('hidden')
      } else {
        x = canvas.width / 2
        y = canvas.height - 30
        // dx = 3
        // dy = -3
        paddleX = (canvas.width - paddleWidth) / 2
      }
    }
  }
  requestAnimationFrame(draw)
}

draw()
