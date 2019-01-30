/* eslint-disable semi */
/* eslint-disable no-undef */

/* GLOBAL SETTINGS */
let lives = 3

/* CONTROLS SETUP */
let rightPressed = false
let leftPressed = false

/* BALL CLASS */
class Ball {
  constructor(x, y, dx = 7, dy = 7, radius = 16) {
    this.x = x // starting position (x-axis)
    this.y = y // starting position (y-axis)
    this.dx = dx // how fast ball travels horizontally
    this.dy = dy // how fast ball travels vertically
    this.radius = radius // ball size
  }

  render(ctx) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'grey'
    ctx.fill()
    ctx.closePath()
  }

  move() {
    this.x += this.dx
    this.y += this.dy
  }
}

class Paddle {
  constructor(canvasWidth, width = 180, height = 23, paddleSpeed = 13) {
    this.width = canvasWidth / 4
    this.height = height
    this.x = (canvasWidth - width) / 2 // center the paddle at start
    this.paddleSpeed = paddleSpeed
  }

  render(ctx, canvas) {
    ctx.beginPath()
    ctx.rect(this.x, canvas.height - this.height, this.width, this.height)
    ctx.fillStyle = '#e67e22'
    ctx.fill()
    ctx.closePath()
  }

  move(canvas) {
    if (rightPressed && this.x < canvas.width - this.width) {
      this.x += this.paddleSpeed
    } else if (leftPressed && this.x > 0) {
      this.x -= this.paddleSpeed
    }
  }
}

class Brick {
  constructor(x, y, color = '#0095DD', width = 75, height = 20, status = 1) {
    this.x = x
    this.y = y
    this.color = color
    this.width = width
    this.height = height
    this.status = status
  }

  render(ctx) {
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.width, this.height)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }
}

/* CANVAS SETUP */
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

/* CREATE BRICKS */
const brickRowCount = 3
const brickColumnCount = 7
let brickWidth = 50
let brickHeight = 20
const brickPadding = 30
const brickOffsetTop = 60
const brickOffsetLeft = 30

const bricks = []
for (let c = 0; c < brickColumnCount; c += 1) {
  bricks[c] = []
  for (let r = 0; r < brickRowCount; r += 1) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    // console.log('c: ' + c)
    const hueValue = 370 / (c + 1)
    const hue = `hsl(${hueValue}, 90%, 50%)`
    console.log(hue)
    for (let r = 0; r < brickRowCount; r += 1) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        // console.log('r: ' + r)

        bricks[c][r] = new Brick(brickX, brickY, hue, brickWidth, brickHeight, 1)
        bricks[c][r].render(ctx)
      }
    }
  }
}

/* UPDATE SIZES ON WINDOW RESIZE */
function resize() {
  console.log('resizing window, update canvas size!')
  // resie canvas
  canvas.setAttribute('width', window.innerWidth * 0.9)
  canvas.setAttribute('height', window.innerHeight * 0.8)

  // resize bricks
  brickWidth = (canvas.width - 240) / brickColumnCount
  brickHeight = canvas.height * 0.02
}

window.addEventListener('resize', () => resize(), true)

// resize once upon first load after brick setup
resize()

/* CREATE BALL w/ starting position (x,y) */
const ball = new Ball(15, canvas.height / 2)

/* CREATE PADDLE w/ starting position x */
const paddle = new Paddle(canvas.width)

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
    paddle.x = relativeX - paddle.width / 2
  }
}

document.addEventListener('mousemove', mouseMoveHandler, false)

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

/* COLLISION DETECTION */
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c += 1) {
    for (let r = 0; r < brickRowCount; r += 1) {
      const brick = bricks[c][r]
      if (brick.status === 1) {
        if (ball.x > brick.x && ball.x < brick.x + brickWidth && ball.y > brick.y && ball.y < brick.y + brickHeight) {
          ball.dy = -ball.dy
          brick.status = 0
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
  paddle.render(ctx, canvas)
  paddle.move(canvas)
  collisionDetection()
  drawScore()
  drawLives()
  
  // check if ball touches edges
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    // ball touching left or right edge of canvas
    ball.dx = -ball.dx; // ball changes direction
  } else if (ball.y + ball.dy < ball.radius) {
    // ball touching top edge of canvas
    ball.dy = -ball.dy; // ball changes direction
  } else if (ball.y + ball.dy > canvas.height - (ball.radius / 2)) {
    // ball touching bottom edge of canvas
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      // ball is hitting paddle and should change direction (="bounce")
      ball.dy = -ball.dy
    } else if (lives > 0) {
      lives -= 1

      // reset ball position
      ball.x = canvas.width - 40
      ball.y = canvas.height / 2
    }
  }
  if (lives > 0) {
    ball.render(ctx)
    ball.move()
  } else {
    const gameoverTitle = document.getElementById('game-over')
    gameoverTitle.classList.remove('hidden')
  }
  requestAnimationFrame(draw)
}

draw()
