// "Winding"
// I created a pattern using spirals, playing around with their scale, transparency, and darkness. As someone who is very interested in line-work, I took time to play around with the thickness of the lines and what visuals they create when overlapped by one another. Overall, I aimed to create a sketch-like visual that isn't overwhelming but instead calm and "blank" but also complex in a sense.

let cols = 7;
let rows = 7;
let spirals = [];

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  noFill();
  background(240,240,240);
  let spacingX = width / cols;
  let spacingY = height / rows;


  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      spirals.push({
        x: i * spacingX + spacingX / 2 + random(-30, 30),
        y: j * spacingY + spacingY / 2 + random(-30, 30),
        size: random(50, 150), // bigger size range
        layers: int(random(2, 5)),
        grey: random(120, 210) // lighter grey shades
      });
    }
  }

  for (let s of spirals) {
    push();
    translate(s.x, s.y);

    for (let l = 0; l < s.layers; l++) {
      let currentSize = s.size * (1 - l * 0.2);
      stroke(s.grey, 255); // fully opaque
      drawSpiral(currentSize, 5 + l * 2, 3);
    }

    pop();
  }
}

function drawSpiral(size, turns, step) {
  beginShape();
  for (let t = 0; t < 360 * turns; t += step) {
    let r = map(t, 0, 360 * turns, 0, size);
    let x = r * cos(t);
    let y = r * sin(t);
    vertex(x, y);
  }
  endShape();
}
