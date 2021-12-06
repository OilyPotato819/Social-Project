// Social Studies Game by Oli and Xander

// Setup canvas and graphics context
let cnv = document.getElementById("my_canvas");
let ctx = cnv.getContext("2d");
cnv.width = 1000;
cnv.height = 600;

// Global variables
let screen = "title";
let background;
let rightIsPressed = false;
let leftIsPressed = false;
let eIsPressed = false;
let upIsPressed = false;
let distance;
let char = {
  x: 500,
  y: 450,
  facing: 0,
  gravity: 0,
  yMove: "stay",
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
    screen = "level1-1";
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

    if (screen === "level1-1") { // LEVEL 1: Route de la Soie
      background = document.getElementById("level1");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

      ctx.fillStyle = "blue";
      ctx.fillRect(545, 425, 10, 50);
      ctx.fillRect(400, 425, 50, 10);
    } else if (screen === "level1-2") {
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    } else if (screen === "level2-1") { // LEVEL 2: First Nations
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    } else if (screen === "level2-2") {
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    } else if (screen === "level3-1") { // LEVEL 3: Europeans
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    } else if (screen === "level3-2") {
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    } else if (screen === "level4-1") { // LEVEL 4: Industrialisation in UK
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    } else if (screen === "level4-2") {
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    } else if (screen === "level5-1") { // LEVEL 5: Child Labour
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    } else if (screen === "level5-2") {
      background = document.getElementById("");
      ctx.drawImage(background, 0, 0, cnv.width, cnv.height);
    }

    // CHARACTER
    ctx.fillStyle = "black";
    ctx.fillRect(char.x, char.y, 25, 25);

    // move x
    if (laser.shoot != true) {
      if (rightIsPressed) {
        char.x += 5;
        char.facing = "right";
      }
      if (leftIsPressed) {
        char.x -= 5;
        char.facing = "left";
      }
    }

    // gravity
    if (laser.shoot != true) {
      // jump
      char.y += char.gravity
      if (upIsPressed && char.yMove === "stay") {
        char.yMove = "up"
        char.gravity = -10;
      }

      // check if standing on something
      if (char.yMove != "up") {
        if (char.y >= 450) {
          char.y = 450;
          char.yMove = "stay";
        } else if (screen === "level1-1") {
          if (char.y >= 400 && char.y <= 415 && char.x >= 380 && char.x <= 445) {
            char.y = 400;
             char.yMove = "stay";
          } else {
            char.yMove = "down";
          }
        } else if (screen === "level1-2") {

        } else if (screen === "level2-1") {
          
        } else if (screen === "level2-2") {

        } else if (screen === "level3-1") {

        } else if (screen === "level3-2") {

        } else if (screen === "level4-1") {

        } else if (screen === "level4-2") {

        } else if (screen === "level5-1") {

        } else if (screen === "level5-2") {

        }
      }

      // fall or stay
      if (char.yMove === "stay") {
        char.gravity = 0;
      } else {
        char.gravity += 0.5;
        if (char.gravity < 0) {
          char.yMove = "up";
        } else if (char.gravity > 0) {
          char.yMove = "down";
        }
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
      char.gravity = 1;
      laser.width = 4;
      laser.y = char.y + 12.5;
      laser.shoot = true;
      if (char.facing === "right") {
        laser.xMove = char.x + 25;
        laser.xLine = char.x + 25;
      } else {
        laser.xMove = char.x;
        laser.xLine = char.x;
      }
    }
    if (laser.shoot === true) {
      if (char.facing === "right") {
        while (!laser.collide) {
          // laser moves right
          laser.xLine++;
          // check right side collision
          if (screen === "level1-1") {
            if (laser.xLine === 545 && laser.y > 425 || laser.xLine === cnv.width + 1) {
              laser.collide = true;
            }
          } else if (screen === "level1-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level2-1") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level2-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level3-1") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level3-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level4-1") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level4-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level5-1") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level5-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          }
        }
      } else {
        while (!laser.collide) {
          // laser moves left
          laser.xLine--;
          // check left side collision
          if (screen === "level1-1") {
            if (laser.xLine === 555 && laser.y > 425 || laser.xLine === -1) {
              laser.collide = true;
            }
          } else if (screen === "level1-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level2-1") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level2-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level3-1") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level3-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level4-1") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level4-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level5-1") {
            if (laser.xLine) {
              laser.collide = true;
            }
          } else if (screen === "level5-2") {
            if (laser.xLine) {
              laser.collide = true;
            }
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