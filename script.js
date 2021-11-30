// Social Studies Game by Oli and Xander

// Setup canvas and graphics context
let cnv = document.getElementById("my_canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 600;

// Global variables
let screen = "title";
let charX = 100;
let charY = 100;
let direction = "right";
let rightIsPressed = false;
let leftIsPressed = false;
let jumping = false;
let eIsPressed = false;
let upIsPressed = false;
let gravity = 0;
let distance;
let laserX, laserY;
let shootLaser = "end";
let laserTimer = 0;

// Event listeners
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("click", startGame);
document.addEventListener("mousemove", mousemoveHandler);

function startGame() {
  if (distance < 30) {
    screen = "level1";
  }
}

function mousemoveHandler(event) {
  let cnvRect = cnv.getBoundingClientRect();
  let run = Math.abs(event.x - cnvRect.x - 500);
  let rise = Math.abs(event.y - cnvRect.y - 300);
  distance = Math.sqrt(run ** 2 + rise ** 2);

  if (distance < 30) {
    document.body.style.cursor = "pointer";
  } else {
    document.body.style.cursor = "default";
  }
}

function keydownHandler(event) {
  if (event.code === "KeyD" || event.code === "ArrowRight") {
    rightIsPressed = true;
  }
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    leftIsPressed = true;
  }
  if (
    event.code === "KeyW" ||
    event.code === "ArrowUp" ||
    event.code === "Space"
  ) {
    upIsPressed = true;
  }
  if (event.code === "KeyE") {
    eIsPressed = true;
  }
}

function keyupHandler(event) {
  if (event.code === "KeyD" || event.code === "ArrowRight") {
    rightIsPressed = false;
  }
  if (event.code === "KeyA" || event.code === "ArrowLeft") {
    leftIsPressed = false;
  }
  if (
    event.code === "KeyW" ||
    event.code === "ArrowUp" ||
    event.code === "Space"
  ) {
    upIsPressed = false;
  }
  if (event.code === "KeyE") {
    eIsPressed = false;
  }
}

// Main Program Loop (60 FPS)
requestAnimationFrame(loop);

function loop() {
  console.log(direction);
  // console.log(laserTimer);

  if (screen === "title") {
    ctx.fillStyle = "black";
    ctx.arc(500, 300, 30, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    // BACKGROUNDS
    // Start
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, cnv.width, cnv.height);

    // LEVEL 1: Route de la Soie
    if (screen === "level1") {
      // Backgroud
      let bg1 = document.getElementById("level1");
      ctx.drawImage(bg1, 0, 0, cnv.width, cnv.height);
    }

    // LEVEL 2: First Nations
    // if (screen === "level2") {

    // }

    // LEVEL 3: Europeans
    // if (screen === "level3") {

    // }

    // LEVEL 4: Industrialisation in UK
    // if (screen === "level4") {

    // }

    // LEVEL 5: Child Labour
    // if (screen === "level15") {

    // }

    // CHARACTER
    ctx.fillStyle = "black";
    ctx.fillRect(charX, charY, 25, 25);

    // move x
    if (rightIsPressed) {
      charX += 5;
      direction = "right";
    } else if (leftIsPressed) {
      charX -= 5;
      direction = "left";
    }

    // jump
    if (upIsPressed && !jumping) {
      jumping = true;
      gravity = -10;
    }
    charY += gravity;
    if (jumping) {
      gravity += 0.5;
    }
    if (charY > 440) {
      gravity = 0;
      jumping = false;
    } else if (!jumping) {
      gravity = 10;
    }
    // prevent character from going off screen
    if (charX < 0) {
      charX = 0;
    }
    if (charX > cnv.width - 25) {
      charX = cnv.width - 25;
    }

    // Shoot laser
    if (eIsPressed && shootLaser === "end") {
      shootLaser = true;
      laserTimer = 1;
      laserX = charX + 25;
      laserY = charY + 12.5;
    }
    if (shootLaser === true) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(laserX, laserY);
      ctx.lineTo(700, laserY);
      ctx.stroke();
      laserTimer++;
    }
    if (laserTimer >= 10) {
      shootLaser = false;
      laserTimer++;
    }
    if (laserTimer >= 20) {
      shootLaser = "end";
      laserTimer = 0;
    }
  }
  requestAnimationFrame(loop);
}
