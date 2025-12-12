// "Breathing Mold"
// I wanted to branch off of my first pattern code to create a more interesting visual with a concept applied. I created spirals that each represent mold and together, they create an animation of spiraling, growing, and shrinking. I selected colors that resemble the idea or feeling of mold and also played around with the randomness in scale and speed. When the user sets the mouse onto the spiral, it will increase in speed of rotation.
let cols = 8;
let rows = 8;
let spirals = [];
let colors = [
  [117, 99, 71],
  [26, 40, 56],
  [237, 168, 146],
  [108, 140, 107],
  [37, 26, 26]
];

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  noFill();

  let spacingX = width / cols;
  let spacingY = height / rows;

  // make spirals in a grid
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let s = {
        x: i * spacingX + spacingX / 2 + random(-20, 20), // x position
        y: j * spacingY + spacingY / 2 + random(-20, 20), // y position
        baseSize: random(40, 100), // size of spiral
        angle: random(360), // start rotation
        rotationSpeed: random(-2, 2), // normal spin speed
        scaleFactor: random(0.8, 1.2), // growth scale
        growthSpeed: random(0.003, 0.01), // rate of growth/shrink
        layers: int(random(2, 5)), // spiral layers
        col: random(colors) // color
      };
      s.normalSpeed = s.rotationSpeed; // save original speed
      spirals.push(s);
    }
  }
}

function draw() {
  background(242, 242, 232);

  for (let s of spirals) {
    // check hover → spin faster
    let d = dist(mouseX, mouseY, s.x, s.y);
    s.rotationSpeed = (d < s.baseSize) ? s.normalSpeed * 12 : s.normalSpeed;

    // draw spiral
    push();
    translate(s.x, s.y);
    rotate(s.angle);
    for (let l = 0; l < s.layers; l++) {
      let currentSize = s.baseSize * s.scaleFactor * (1 - l * 0.2);
      stroke(s.col[0], s.col[1], s.col[2], 100);
      drawSpiral(currentSize, 5 + l * 2, 3);
    }
    pop();

    // update rotation
    s.angle += s.rotationSpeed;

    // update size scaling
    s.scaleFactor += s.growthSpeed;
    if (s.scaleFactor > 1.5 || s.scaleFactor < 0.5) s.growthSpeed *= -1;
  }
}

// draw a spiral shape
function drawSpiral(size, turns, step) {
  beginShape();
  for (let t = 0; t < 360 * turns; t += step) {
    let r = map(t, 0, 360 * turns, 0, size);
    vertex(r * cos(t), r * sin(t));
  }
  endShape();
}