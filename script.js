// Social Studies Game by Oli and Xander

// Setup canvas and graphics context
let cnv = document.getElementById("my_canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 600;

// Global variables
let screen = "title";
let rightIsPressed = false;
let leftIsPressed = false;
let eIsPressed = false;
let upIsPressed = false;
let distance;
let char = {
  x: 0,
  y: 0,
  direction: 0,
  jumping: false,
  gravity: 0,
};
let laser = {
  xMove: 0,
  xLine: 0,
  y: 0,
  shoot: "ready",
  timer: 0,
  collide: false,
  width: 0,
};

// Event listeners
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("click", startGame);
document.addEventListener("mousemove", mousemoveHandler);

function startGame() {
  if (distance < 30) {
    screen = "level1";
    document.body.style.cursor = "default";
  }
}

function mousemoveHandler(event) {
  if (screen === "title") {
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
}

function keydownHandler(event) {
  if (event.code === "KeyE") {
    eIsPressed = true;
  }
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
}

function keyupHandler(event) {
  if (event.code === "KeyE") {
    eIsPressed = false;
  }
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
}

// Main Program Loop (60 FPS)
requestAnimationFrame(loop);

function loop() {
  if (screen === "title") {
    ctx.fillStyle = "black";
    ctx.arc(500, 300, 30, 0, 2 * Math.PI);
    ctx.fill();

    ctx.font = "100px  Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Titre", 420, 100);
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

    ctx.fillStyle = "blue";
    ctx.fillRect(545, 425, 10, 50);

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
    // if (screen === "level5") {

    // }

    // CHARACTER
    ctx.fillStyle = "black";
    ctx.fillRect(char.x, char.y, 25, 25);

    // move x
    if (laser.shoot != true) {
      if (rightIsPressed) {
        char.x += 5;
        char.direction = "right";
      }
      if (leftIsPressed) {
        char.x -= 5;
        char.direction = "left";
      }
    }

    // jump
    if (laser.shoot != true) {
      if (upIsPressed && !char.jumping) {
        char.jumping = true;
        char.gravity = -10;
      }
      char.y += char.gravity;
      if (char.jumping) {
        char.gravity += 0.5;
      }
      if (char.y > 440) {
        char.gravity = 0;
        char.jumping = false;
      } else if (!char.jumping) {
        char.gravity = 10;
      }
    }

    // prevent character from going off screen
    if (char.x < 0) {
      char.x = 0;
    }
    if (char.x > cnv.width - 25) {
      char.x = cnv.width - 25;
    }

    // LASER

    // shoot laser
    if (eIsPressed && laser.shoot === "ready") {
      laser.width = 4;
      laser.y = char.y + 12.5;
      laser.shoot = true;
      if (char.direction === "right") {
        laser.xMove = char.x + 25;
        laser.xLine = char.x + 25;
      } else {
        laser.xMove = char.x;
        laser.xLine = char.x;
      }
    }
    if (laser.shoot === true) {
      // lineTo changes until collision
      if (char.direction === "right") {
        while (!laser.collide) {
          laser.xLine++;
          if (laser.xLine === 545 && laser.y > 425 || laser.xLine === cnv.width + 1) {
            laser.collide = true;
          }
        }
      } else {
        while (!laser.collide) {
          laser.xLine--;
          if (laser.xLine === 555 && laser.y > 425 || laser.xLine === -1) {
            laser.collide = true;
          }
        }
      }

      // draw
      ctx.lineWidth = laser.width;
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.moveTo(laser.xMove, laser.y);
      ctx.lineTo(laser.xLine, laser.y);
      ctx.stroke();
    }
    // timer
    if (laser.shoot != false && laser.shoot != "ready") {
      laser.timer++;
    }
    if (laser.timer >= 25) {
      laser.width -= 1;
    }
    if (laser.timer >= 30) {
      laser.shoot = "cooldown";
      laser.collide = false;
    }
    if (laser.timer >= 60) {
      laser.shoot = "ready";
      laser.timer = 0;
    }
  }
  requestAnimationFrame(loop);
}

// ctx.fillRect(545, 425, 10, 50);