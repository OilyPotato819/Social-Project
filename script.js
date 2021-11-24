// Social Studies Game by Oli and Xander

// Setup canvas and graphics context
let cnv = document.getElementById("my_canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 600;

// Global variables
let shipX = 100;
let rightIsPressed = false;
let leftIsPressed = false;

// Event listeners
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);

function keydownHandler() {
  if (event.code == "KeyD" || event.code == "ArrowRight") {
    rightIsPressed = true;
  }
  if (event.code == "KeyA" || event.code == "ArrowLeft") {
    leftIsPressed = true;
  }
}

function keyupHandler() {
  if (event.code == "KeyD" || event.code == "ArrowRight") {
    rightIsPressed = false;
  }
  if (event.code == "KeyA" || event.code == "ArrowLeft") {
    leftIsPressed = false;
  }
}

// Main Program Loop (60 FPS)
requestAnimationFrame(loop);

function loop() {
  // console.log()

  // BACKGROUND
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  // SHIP

  ctx.fillStyle = "black";
  ctx.fillRect(50, 50, 25, 25);

  // move
  if (rightIsPressed) {
    shipX += 5;
  } else if (leftIsPressed) {
    shipX -= 5;
  }

  // prevent ship from going off screen
  if (shipX < -15) {
    shipX = cnv.width;
  }
  if (shipX > cnv.width) {
    shipX = -15;
  }
}
