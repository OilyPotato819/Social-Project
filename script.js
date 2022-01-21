// Social Studies Game by Oli and Xander

// SETUP CANVAS AND GRAPHICS CONTEXT
let cnv = document.getElementById('my_canvas');
let ctx = cnv.getContext('2d');
cnv.width = 1000;
cnv.height = 600;

// GLOBAL VARIABLES
let screen = 'title0';
let frameCount = 0;
let background = document.getElementById('title');;
let openHole;
let rightIsPressed = false;
let leftIsPressed = false;
let eIsPressed = false;
let upIsPressed = false;
let distance;
let opacity = 0;
let checkMirrors = 'ready';
let showInfo = false;
let infoCount = 0;
let infoImg;
let char = {
  imgX: 0,
  imgY: 0,
  x: 850,
  y: 474 - 54,
  w: 24,
  h: 69,
  facing: 'left',
  gravity: 0,
  standing: true,
};
let laser = {
  originX: 0,
  originY: 0,
  xMove: 0,
  xLine: 0,
  yMove: 0,
  yLine: 0,
  dx: 0,
  dy: 0,
  shoot: 'ready',
  timer: 0,
  collide: false,
  width: 0,
};

// EVENT LISTENERS
document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);
document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("click", clickHandler);

// FUNCTIONS

function mousemoveHandler(event) {
  let pointerCheck = 0;
  let cnvRect = cnv.getBoundingClientRect();
  var mouseX = event.x - cnvRect.x;
  var mouseY = event.y - cnvRect.y;
  calculateDistance(mirror1);
  calculateDistance(mirror2);
  calculateDistance(mirror3);
  calculateDistance(mirror4);

  function calculateDistance(aMirror) {
    let run = Math.abs(mouseX - aMirror.centerX);
    let rise = Math.abs(mouseY - aMirror.centerY);
    distance = Math.sqrt(run ** 2 + rise ** 2);
    if (distance < 5) {
      document.body.style.cursor = "pointer";
      pointerCheck += 1;
      if (aMirror.clicked === 'too far') {
        aMirror.clicked = 'click?';
      }
    } else if (aMirror.clicked != 'clicked') {
      aMirror.clicked = 'too far';
    }
    if (pointerCheck === 0) {
      document.body.style.cursor = "default";
    }
  }
}

function clickHandler() {
  checkIfClicked(mirror1);
  checkIfClicked(mirror2);
  checkIfClicked(mirror3);
  checkIfClicked(mirror4);

  function checkIfClicked(aMirror) {
    if (aMirror.clicked === 'click?') {
      aMirror.rotation = 'changing';
    }
  }
}

function keydownHandler(event) {
  if (event.code === 'KeyE') {
    eIsPressed = true;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    rightIsPressed = true;
  }
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    leftIsPressed = true;
  }
  if (
    event.code === 'KeyW' ||
    event.code === 'ArrowUp' ||
    event.code === 'Space'
  ) {
    upIsPressed = true;
  }
}

function keyupHandler(event) {
  if (event.code === 'KeyE') {
    eIsPressed = false;
  }
  if (event.code === 'KeyD' || event.code === 'ArrowRight') {
    rightIsPressed = false;
  }
  if (event.code === 'KeyA' || event.code === 'ArrowLeft') {
    leftIsPressed = false;
  }
  if (
    event.code === 'KeyW' ||
    event.code === 'ArrowUp' ||
    event.code === 'Space'
  ) {
    upIsPressed = false;
  }
}

// CREATE LEVEL OBJECTS

// Button function
function newButton(x, y, w, h, action, activate, base, timer) {
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    action: action,
    activate: activate,
    base: base,
    timer: timer,
  }
}

// Create buttons
let button1U = newButton(400, 454, 30, 10, 'button', false, {
  x: 0,
  y: 0,
  w: 50,
  h: 10
});
let button2U = newButton(500, 454, 30, 10, 'button', false, {
  x: 0,
  y: 0,
  w: 50,
  h: 10
});
let button1D = newButton(470, 300, 30, 10, 'button', false, {
  x: 0,
  y: 0,
  w: 50,
  h: 10
});
let button1L = newButton(600, 410, 10, 30, 'button', false, {
  x: 0,
  y: 0,
  w: 10,
  h: 50
});
let button1R = newButton(320, 410, 10, 30, 'button', false, {
  x: 0,
  y: 0,
  w: 10,
  h: 50
});

// Block function
function newBlock(x, y, w, h, action, activate, img, color) {
  return {
    x: x,
    y: y,
    w: w,
    h: h,
    action: action,
    activate: activate,
    img: img,
    color: color,
  }
}

// Create blocks
let platform1 = newBlock(-100, 0, 50, 10);
let platform2 = newBlock(-100, 0, 50, 10);
let wallL1 = newBlock(100, 400, 10, 50);
let wallL2 = newBlock(-100, 0, 10, 50);
let wallC1 = newBlock(-100, 0, 0.01, 0);
let wallC2 = newBlock(-100, 0, 0.01, 0);
let entrance = newBlock(-100, 0, 45, 35, 'hole');
let hole = newBlock(-100, 474, 100, 0);
let portal = newBlock(900, 380, 69, 90, 'portal');
let showDialogue = newBlock(0, 0, 0, 0, 'dialogue', true, document.getElementById("lvl1dia"));
let dialogueImg = newBlock(0, 0, 0, 0, 'dialogue');

// Mirror function
function newMirror(centerX, centerY, angle, x1, y1, action, coords, rotation, x2, y2, cor1x, cor1y, cor2x, cor2y, clicked) {
  return {
    centerX: centerX,
    centerY: centerY,
    angle: angle,
    x1: x1,
    y1: y1,
    action: action,
    coords: coords,
    rotation: rotation,
    x2: x2,
    y2: y2,
    cor1x: cor1x,
    cor1y: cor1y,
    cor2x: cor2x,
    cor2y: cor2y,
    clicked: clicked,
  }
}

// Create mirror
let mirror1 = newMirror(200, 420, 135, 700, 350, 'mirror', '', 135);
let mirror2 = newMirror(300, 420, 45, 670, 420, 'mirror', '', 45);
let mirror3 = newMirror(400, 420, 45, 750, 350, 'mirror', '', 45);
let mirror4 = newMirror(500, 420, 135, 780, 420, 'mirror', '', 135);

// MAIN PROGRAM LOOP
requestAnimationFrame(loop);

function loop() {
  frameCount++;

  // SET UP LEVEL
  // Draw background
  ctx.drawImage(background, 0, 0, cnv.width, cnv.height);

  // factory interior
  if (background === document.getElementById('level4')) {
    if (char.x < 200 && opacity < 10) {
      opacity += 1;
    } else if (char.x > 200 && opacity > 0) {
      opacity -= 1;
    }
    ctx.globalAlpha = opacity / 10
    ctx.drawImage(document.getElementById('factory-interior'), 0, 271, 200, 207);
    ctx.globalAlpha = 1
  }

  // Dialogue box
  if (showDialogue.activate) {
    ctx.drawImage(showDialogue.img, dialogueImg.x, dialogueImg.y, dialogueImg.w, dialogueImg.h);
  }

  // Platforms
  ctx.fillStyle = 'blue';
  ctx.fillRect(platform1.x, platform1.y, platform1.w, platform1.h);
  ctx.fillRect(platform2.x, platform2.y, platform2.w, platform2.h);

  // Walls
  ctx.fillRect(wallL1.x, wallL1.y, wallL1.w, wallL1.h);
  ctx.fillRect(wallL2.x, wallL2.y, wallL2.w, wallL2.h);
  ctx.fillStyle = hole.color;
  ctx.fillRect(wallC1.x, wallC1.y, wallC1.w, wallC1.h);
  ctx.fillRect(wallC2.x, wallC2.y, wallC2.w, wallC2.h);

  // Hole
  ctx.fillRect(hole.x, hole.y, hole.w, hole.h);

  // Portal
  ctx.drawImage(document.getElementById('portal'), portal.x, portal.y, portal.w, portal.h);

  // Mirrors
  createMirror(mirror1);
  createMirror(mirror2);
  createMirror(mirror3);
  createMirror(mirror4);

  function createMirror(aMirror) {
    aMirror.x1 = aMirror.centerX + (25 * Math.cos((aMirror.angle + 170) * Math.PI / 180));
    aMirror.y1 = aMirror.centerY + (25 * Math.sin((aMirror.angle + 170) * Math.PI / 180));
    aMirror.x2 = aMirror.centerX + (25 * Math.cos((aMirror.angle + 190) * Math.PI / 180));
    aMirror.y2 = aMirror.centerY + (25 * Math.sin((aMirror.angle + 190) * Math.PI / 180));
    aMirror.cor1x = aMirror.centerX + (25 * Math.cos((aMirror.angle + 10) * Math.PI / 180));
    aMirror.cor1y = aMirror.centerY + (25 * Math.sin((aMirror.angle + 10) * Math.PI / 180));
    aMirror.cor2x = aMirror.centerX + (25 * Math.cos((aMirror.angle - 10) * Math.PI / 180));
    aMirror.cor2y = aMirror.centerY + (25 * Math.sin((aMirror.angle - 10) * Math.PI / 180));
  }

  rotateMirror(mirror1);
  rotateMirror(mirror2);
  rotateMirror(mirror3);
  rotateMirror(mirror4);

  function rotateMirror(aMirror) {
    if (aMirror.rotation === 'changing') {
      aMirror.angle += 3;
      if (aMirror.angle === 225) {
        aMirror.rotation = 45;
        aMirror.angle = 45;
      } else if (aMirror.angle === 135) {
        aMirror.rotation = 135;
        aMirror.angle = 135;
      }
    }
  }

  // Buttons

  // Draw buttons
  drawButtonU(button1U);
  drawButtonU(button2U);
  drawButtonD(button1D);
  drawButtonL(button1L);
  drawButtonR(button1R);

  function drawButtonU(aButton) {
    if (!aButton.activate) {
      aButton.base.x = aButton.x + (aButton.w / 2) - aButton.base.w / 2;
      aButton.base.y = aButton.y + aButton.h;
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(aButton.x, aButton.y, aButton.w, aButton.h);
    ctx.fillStyle = 'grey';
    ctx.fillRect(aButton.base.x, aButton.base.y, aButton.base.w, aButton.base.h);
    ctx.fillRect(aButton.base.x, aButton.base.y, aButton.base.w, aButton.base.h);
  }
  
  function drawButtonD(aButton) {
    if (!aButton.activate) {
      aButton.base.x = aButton.x + (aButton.w / 2) - aButton.base.w / 2;
      aButton.base.y = aButton.y - aButton.h;
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(aButton.x, aButton.y, aButton.w, aButton.h);
    ctx.fillStyle = 'grey';
    ctx.fillRect(aButton.base.x, aButton.base.y, aButton.base.w, aButton.base.h);
    ctx.fillRect(aButton.base.x, aButton.base.y, aButton.base.w, aButton.base.h);
  }

  function drawButtonL(aButton) {
    if (!aButton.activate) {
      aButton.base.x = aButton.x + aButton.w;
      aButton.base.y = aButton.y + (aButton.h / 2) - aButton.base.h / 2;
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(aButton.x, aButton.y, aButton.w, aButton.h);
    ctx.fillStyle = 'grey';
    ctx.fillRect(aButton.base.x, aButton.base.y, aButton.base.w, aButton.base.h);
  }

  function drawButtonR(aButton) {
    if (!aButton.activate) {
      aButton.base.x = aButton.x - aButton.w;
      aButton.base.y = aButton.y + (aButton.h / 2) - aButton.base.h / 2;
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(aButton.x, aButton.y, aButton.w, aButton.h);
    ctx.fillStyle = 'grey';
    ctx.fillRect(aButton.base.x, aButton.base.y, aButton.base.w, aButton.base.h);
  }

  pressButtonU(button1U);
  pressButtonU(button2U);
  pressButtonD(button1D);
  pressButtonL(button1L);
  pressButtonR(button1R);

  function pressButtonU(aButton) {
    if (aButton.activate === true) {
      aButton.y += 5;
      aButton.h -= 5;
      aButton.activate = 'wait';
      aButton.timer = 0;
    } else if (aButton.activate === 'count') {
      aButton.timer++;
      if (aButton.timer > 30) {
        aButton.activate = 'reset';
      }
    }
    if (aButton.activate === 'reset') {
      aButton.y -= 5;
      aButton.h += 5;
      aButton.activate = false;
    }
  }

  function pressButtonD(aButton) {
    if (aButton.activate === true) {
      aButton.h -= 5;
      aButton.activate = 'wait';
      aButton.timer = 0;
    } else if (aButton.activate === 'count') {
      aButton.timer++;
      if (aButton.timer > 30) {
        aButton.activate = 'reset';
      }
    }
    if (aButton.activate === 'reset') {
      aButton.h += 5;
      aButton.activate = false;
    }
  }

  function pressButtonL(aButton) {
    if (aButton.activate === true) {
      aButton.x += 5;
      aButton.w -= 5;
      aButton.activate = 'wait';
      aButton.timer = 0;
    } else if (aButton.activate === 'count') {
      aButton.timer++;
      if (aButton.timer > 30) {
        aButton.activate = 'reset';
      }
    }
    if (aButton.activate === 'reset') {
      aButton.x -= 5;
      aButton.w += 5;
      aButton.activate = false;
    }
  }

  function pressButtonR(aButton) {
    if (aButton.activate === true) {
      aButton.w -= 5;
      aButton.activate = 'wait';
      aButton.timer = 0;
    } else if (aButton.activate === 'count') {
      aButton.timer++;
      if (aButton.timer > 30) {
        aButton.activate = 'reset';
      }
    }
    if (aButton.activate === 'reset') {
      aButton.w += 5;
      aButton.activate = false;
    }
  }

  // LASER

  // Shoot laser
  if (laser.shoot === 'animate') {
    laser.shoot = true;
    laser.width = 4;
    if (rightIsPressed || leftIsPressed) {
      laser.originY = char.y + 37;
    } else {
      laser.originY = char.y + 34;
    }
    if (char.imgY === 0) {
      laser.originX = char.x + char.w + 13;
    } else if (char.imgY === 112) {
      laser.originX = char.x + char.w + 23;
    } else if (char.imgY === 56) {
      laser.originX = char.x - 13;
    } else if (char.imgY === 168) {
      laser.originX = char.x - 23;
    }
  }

  if (eIsPressed && laser.shoot === 'ready' && mirror1.rotation != 'changing' && mirror2.rotation != 'changing' && mirror3.rotation != 'changing' && mirror4.rotation != 'changing') {
    laser.shoot = 'animate';
    char.gravity = 0;
  }

  if (laser.shoot === true) {
    laser.collide = false;
    laser.xMove = laser.originX;
    laser.xLine = laser.originX;
    laser.yMove = laser.originY;
    laser.yLine = laser.originY;
    laser.dx = 0;
    laser.dy = 0;
    shootLaser();
  }

  function shootLaser() {
    if (char.facing === "right") {
      laser.dx = 1;
    } else {
      laser.dx = -1;
    }

    while (!laser.collide) {
      if (checkMirrors === 'ready') {
        getCoordinates(mirror1);
        getCoordinates(mirror2);
        getCoordinates(mirror3);
        getCoordinates(mirror4);
      }

      laser.xMove = laser.xLine;
      laser.xLine += laser.dx;
      laser.yMove = laser.yLine;
      laser.yLine += laser.dy;

      // Check collision
      mirrorCollision(mirror1);
      mirrorCollision(mirror2);
      mirrorCollision(mirror3);
      mirrorCollision(mirror4);

      wallCollide(wallL1);
      wallCollide(wallL2);
      wallCollide(entrance);
      wallCollide(button1L);
      wallCollide(button1R);
      wallCollide(button1U);
      wallCollide(button2U);
      wallCollide(button1D);
      wallCollide(button1L.base);
      wallCollide(button1R.base);
      wallCollide(button1U.base);
      wallCollide(button2U.base);
      wallCollide(button1D.base);

      if (laser.xLine < -1 || laser.xLine > cnv.width + 1 || laser.yLine < 0 || laser.yLine > 473) {
        laser.collide = true;
      }

      // Draw laser
      ctx.lineWidth = laser.width;
      ctx.strokeStyle = 'red';
      ctx.beginPath();
      ctx.moveTo(laser.xMove, laser.yMove);
      ctx.lineTo(laser.xLine, laser.yLine);
      ctx.stroke();
    }
  }

  function getCoordinates(aMirror) {
    checkMirrors = true;
    aMirror.coords += '///coords1///'
    if (aMirror.rotation === 135) {
      for (let checkY = aMirror.y1, checkX = aMirror.x1; checkY < aMirror.cor1y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords2///'
      for (let checkY = aMirror.y1, checkX = aMirror.x1; checkY < aMirror.y2; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
      aMirror.coords += '///coords3///'
      for (let checkY = aMirror.y2, checkX = aMirror.x2; checkY < aMirror.cor2y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords4///'
      for (let checkY = aMirror.cor1y, checkX = aMirror.cor1x; checkY < aMirror.cor2y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
    } else if (aMirror.rotation === 45) {
      for (let checkY = aMirror.y2, checkX = aMirror.x2; checkY < aMirror.y1; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords2///'
      for (let checkY = aMirror.y2, checkX = aMirror.x2; checkY < aMirror.cor2y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
      aMirror.coords += '///coords3///'
      for (let checkY = aMirror.cor2y, checkX = aMirror.cor2x; checkY < aMirror.cor1y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX--;
      }
      aMirror.coords += '///coords4///'
      for (let checkY = aMirror.y1, checkX = aMirror.x1; checkY < aMirror.cor1y; checkY++) {
        aMirror.coords += '|' + parseInt(checkX) + ',' + parseInt(checkY) + '|';
        checkX++;
      }
    }
  }

  function mirrorCollision(aMirror) {
    let searchFor = '|' + parseInt(laser.xLine) + ',' + parseInt(laser.yLine) + '|';
    aMirror.coords = aMirror.coords.replace(searchFor, '|match|');
    if (aMirror.coords.includes('match')) {
      let coords2 = aMirror.coords.search('coords2');
      let coords3 = aMirror.coords.search('coords3');
      let coords4 = aMirror.coords.search('coords4');
      let match = aMirror.coords.search('match');
      if (match < coords2) {
        if (laser.dx === 0) {
          laser.dx = -1;
          laser.dy = 0;
        } else {
          laser.dx = 0;
          laser.dy = -1;
        }
      } else if (match > coords2 && match < coords3) {
        if (laser.dx === 0) {
          laser.dx = 1;
          laser.dy = 0;
        } else {
          laser.dx = 0;
          laser.dy = -1;
        }
      } else if (match > coords3 && match < coords4) {
        if (laser.dx === 0) {
          laser.dx = 1;
          laser.dy = 0;
        } else {
          laser.dx = 0;
          laser.dy = 1;
        }
      } else {
        if (laser.dx === 0) {
          laser.dx = -1;
          laser.dy = 0;
        } else {
          laser.dx = 0;
          laser.dy = 1;
        }
      }
      checkMirrors = 'ready'
      mirror1.coords = '';
      mirror2.coords = '';
      mirror3.coords = '';
      mirror4.coords = '';
    }
  }

  function wallCollide(aWall) {
    if (laser.xLine >= aWall.x && laser.xLine <= aWall.x + aWall.w && laser.yLine >= aWall.y && laser.yLine <= aWall.y + aWall.h) {
      laser.collide = true;
      laser.xLine;
      if (aWall.action === 'hole') {
        openHole = true;
      } else if (aWall.action === 'button') {
        if (aWall.activate != 'wait' && aWall.activate != 'count') {
          aWall.activate = true;
        }
      }
    }
  }

  // Laser timer
  if (laser.shoot != 'ready') {
    laser.timer++;
  }
  if (laser.timer >= 25) {
    laser.width -= 1;
  }
  if (laser.timer >= 30) {
    laser.shoot = 'cooldown';
    laser.collide = false;
  }
  if (laser.timer >= 60) {
    laser.shoot = 'ready';
    laser.timer = 0;
  }

  // Draw mirrors
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'black';
  drawMirror(mirror1);
  drawMirror(mirror2);
  drawMirror(mirror3);
  drawMirror(mirror4);

  function drawMirror(aMirror) {
    ctx.fillStyle = 'lightblue';
    ctx.beginPath();
    ctx.lineTo(aMirror.x1, aMirror.y1);
    ctx.lineTo(aMirror.x2, aMirror.y2);
    ctx.lineTo(aMirror.cor2x, aMirror.cor2y);
    ctx.lineTo(aMirror.cor1x, aMirror.cor1y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(aMirror.centerX, aMirror.centerY, 3, 0, 2 * Math.PI);
    ctx.fillStyle = '#2596be';
    ctx.fill();
  }

  // CHARACTER
  ctx.drawImage(document.getElementById('spritesheet'), char.imgX, char.imgY, 53.5, 56, char.x - 23, char.y - 1, 70, 72);

  if (laser.shoot != true && !showInfo) {

    // Reset mirror coords
    mirror1.coords = '';
    mirror2.coords = '';
    mirror3.coords = '';
    mirror4.coords = '';
    checkMirrors = 'ready';
    
    // Animations
    if (rightIsPressed) {
      char.imgY = 0;
      if (laser.shoot === 'animate') {
        char.imgX = 108;
      } else {
        if (frameCount % 10 === 0) {
          if (char.imgX === 54) {
            char.imgX = 0;
          } else {
            char.imgX = 54;
          }
        }
      }
    } else if (leftIsPressed) {
      char.imgY = 56;
      if (laser.shoot === 'animate') {
        char.imgX = 108;
      } else {
        if (frameCount % 10 === 0) {
          if (char.imgX === 54) {
            char.imgX = 0;
          } else {
            char.imgX = 54;
          }
        }
      }
    } else if (char.facing === 'right') {
      char.imgY = 112;
      if (laser.shoot === 'animate') {
        char.imgX = 54;
      } else {
        char.imgX = 0;
      }
    } else if (char.facing === 'left') {
      char.imgY = 168;
      if (laser.shoot === 'animate') {
        char.imgX = 54;
      } else {
        char.imgX = 0;
      }
    }

    // Move x
    if (rightIsPressed && !leftIsPressed) {
      char.x += 5;
      char.facing = 'right';
    }
    if (leftIsPressed && !rightIsPressed) {
      char.x -= 5;
      char.facing = 'left';
    }


    // Collision

    // wall
    function wallCollide(aWall) {
      if (char.x + char.w > aWall.x && char.x < aWall.x + aWall.w && char.y + char.h > aWall.y && char.y < aWall.y + aWall.h) {
        if (aWall.action === 'portal') {
          screen = screen.replace(/puzzle|title/, '');
          let levelNum = +screen;
          levelNum++;
          screen = 'level' + levelNum;
          level1Setup();
          level2Setup();
          level3Setup();
          level4Setup();
          level5Setup();
          level6Setup();
        } else if (aWall.action === 'dialogue') {
          aWall.activate = true;
        } else if (aWall.action === 'button') {
          if (aWall.activate != 'wait' && aWall.activate != 'count') {
            aWall.activate = true;
          }
        } else if (char.facing === 'right') {
          char.x = aWall.x - char.w - 1;
        } else if (char.facing === 'left') {
          char.x = aWall.x + aWall.w;
        } else {
          aWall.activate = false;

        }
      } else {
        if (aWall.action === 'button' && aWall.activate != false) {
          aWall.activate = 'count';
        } else {
          aWall.activate = false;
        }
      }
    }
    wallCollide(wallC1);
    wallCollide(wallC2);
    wallCollide(portal);
    wallCollide(showDialogue);
    wallCollide(button1U);
    wallCollide(button2U);
    wallCollide(button1D);
    wallCollide(button1L);
    wallCollide(button1R);

    // platform
    function platformCollide(aPlatform) {
      if (char.x + char.w > aPlatform.x && char.x < aPlatform.x + aPlatform.w && char.y + char.h > aPlatform.y - 7 && char.y + char.h < aPlatform.y + aPlatform.h && char.y != aPlatform.y - char.h) {
        char.y = aPlatform.y - char.h;
        char.gravity = 0;
        char.standing = true;
      }
    }
    if (char.x > hole.x && char.x + char.w < hole.x + hole.w && openHole) {
      char.standing = false;
      if (char.y >= hole.y + hole.h - char.h - 2) {
        char.y = hole.y + hole.h - char.h;
      }
    } else if (char.y > 397 && char.y != 404) {
      char.y = 404;
      char.gravity = 0;
      char.standing = true;
    } else if (char.gravity >= 0) {
      char.standing = false;
      platformCollide(platform1);
      platformCollide(platform2);
    }

    // Gravity
    char.y += char.gravity;
    if (char.gravity < 8.5) {
      char.gravity += 0.45;
    }
    if (upIsPressed && char.standing) {
      char.standing = false;
      char.y -= 8.5;
      char.gravity = -8.5;
    }

    // Puzzle room
    if (char.y > cnv.height) {
      screen = screen.replace('level', 'puzzle');
      puzzle1Setup();
      puzzle2Setup();
      puzzle3Setup();
      puzzle4Setup();
      puzzle5Setup();
      openHole = false;
    }
  }

  // prevent character from going off screen
  if (char.x < 0) {
    char.x = 0;
  }
  if (char.x > cnv.width - char.w) {
    char.x = cnv.width - char.w;
  }

  // Hole
  if (openHole) {
    if (hole.h < cnv.height) {
      hole.h += 4;
    }
    wallC1.x = hole.x;
    wallC1.y = hole.y;
    wallC1.h = hole.h;
    wallC2.x = hole.x + 100;
    wallC2.y = hole.y;
    wallC2.h = hole.h;
  }

  if (showInfo === true) {
    char.imgX = 0;
    char.imgY = 224;
    infoCount++;
    ctx.drawImage(infoImg, 685, 270, 300, 300)
    char.y = 404;
  }

  if (infoCount >= 50) {
    showInfo = false;
    infoCount = 0;
    char.imgX = 0;
    char.imgY = 168;
    char.gravity = 0;
  }

  if (screen === 'level6') {
    ctx.drawImage(document.getElementById('win'), (cnv.width / 2) - 150, 100, 280, 200)
  }
  requestAnimationFrame(loop);
}

function level1Setup() {
  if (screen === 'level1') {
    background = document.getElementById('level1');
    hideAll();
    entrance.x = 253;
    entrance.y = 408;
    entrance.w = 20;
    entrance.h = 20;
    hole.x = 920;
    hole.color = '#ffeb3b';
    showDialogue.img = document.getElementById("lvl1dia");
    showDialogue.x = 370;
    showDialogue.y = 400;
    showDialogue.w = 200;
    showDialogue.h = 50;
    dialogueImg.x = 305;
    dialogueImg.y = 235;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
    infoImg = document.getElementById("lvl1info");
  }
}

function level2Setup() {
  if (screen === 'level2') {
    background = document.getElementById('level2');
    hideAll();
    entrance.x = 110;
    entrance.y = 338;
    entrance.w = 25;
    entrance.h = 26;
    hole.x = 615;
    hole.color = '#8d6e63';
    showDialogue.img = document.getElementById("lvl2dia");
    showDialogue.x = 295;
    showDialogue.y = 400;
    showDialogue.w = 200;
    showDialogue.h = 50;
    dialogueImg.x = 238;
    dialogueImg.y = 230;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
    infoImg = document.getElementById("lvl2info");
  }
}

function level3Setup() {
  if (screen === 'level3') {
    background = document.getElementById('level3');
    hideAll();
    entrance.x = 573;
    entrance.y = 330;
    entrance.w = 40;
    entrance.h = 38;
    hole.x = 615;
    hole.color = '#685a55';
    showDialogue.img = document.getElementById("lvl3dia");
    showDialogue.x = 450;
    showDialogue.y = 400;
    showDialogue.w = 200;
    showDialogue.h = 50;
    dialogueImg.x = 400;
    dialogueImg.y = 210;
    dialogueImg.w = 300;
    dialogueImg.h = 200;
    infoImg = document.getElementById("lvl3info");
  }
}

function level4Setup() {
  if (screen === 'level4') {
    background = document.getElementById('level4');
    hideAll();
    entrance.x = 549;
    entrance.y = 386;
    entrance.w = 45.1;
    entrance.h = 50;
    hole.x = 850;
    hole.color = '#9e939e';
    showDialogue.img = document.getElementById("lvl4dia");
    showDialogue.x = 600;
    showDialogue.y = 400;
    showDialogue.w = 200;
    showDialogue.h = 50;
    dialogueImg.x = 555;
    dialogueImg.y = 215;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
    infoImg = document.getElementById("lvl4info");
  }
}

function level5Setup() {
  if (screen === 'level5') {
    background = document.getElementById('level5');
    hideAll();
    entrance.x = 223;
    entrance.y = 318;
    entrance.w = 33;
    entrance.h = 33;
    hole.x = 200;
    hole.color = '#5c5353';
    showDialogue.img = document.getElementById("lvl5dia");
    showDialogue.x = 40;
    showDialogue.y = 400;
    showDialogue.w = 200;
    showDialogue.h = 50;
    dialogueImg.x = -15;
    dialogueImg.y = 235;
    dialogueImg.w = 300;
    dialogueImg.h = 300;
    infoImg = document.getElementById("lvl5info");
  }
}

function level6Setup() {
  if (screen === 'level6') {
    background = document.getElementById('level6');
    infoImg = document.getElementById("lvl5info");
    char.x = 100;
    portal.x = -100;
    
  }
}

function puzzle1Setup() {
  if (screen === 'puzzle1') {
    puzzleSetup();
    hole.x = -100;
    mirror1.x1 = 400;
    mirror1.y1 = 444;
    portal.x = 900;
    portal.y = 380;
    char.facing = 'left';
  }
}

function puzzle2Setup() {
  if (screen === 'puzzle2') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle3Setup() {
  if (screen === 'puzzle3') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle4Setup() {
  if (screen === 'puzzle4') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzle5Setup() {
  if (screen === 'puzzle5') {
    puzzleSetup();
    hole.x = -100;
    portal.x = 900;
    portal.y = 380;
  }
}

function puzzleSetup() {
  background = document.getElementById('puzzle');
  char.y = 0 - char.h;
  hole.h = 0;
  entrance.x = -100;
  showDialogue.x = -100;
}

function hideAll() {
  wallL1.x = -100;
  wallL2.x = -100;
  wallC1.x = -100;
  wallC2.x = -100;
  mirror1.centerX = -100;
  mirror2.centerX = -100;
  mirror3.centerX = -100;
  mirror4.centerX = -100;
  button1U.x = -100;
  button2U.x = -100;
  button1D.x = -100;
  button1L.x = -100;
  button1R.x = -100;
  platform1.x = -100;
  platform2.x = -100;
  portal.x = -100;
  char.facing = 'left';
  showInfo = true;
}

// LEVEL 1: Route de la Soie
// LEVEL 2: First Nations
// LEVEL 3: Europeans
// LEVEL 4: Industrialisation in UK
// LEVEL 5: Child Labour