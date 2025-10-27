let circles = [];
let numCircles = 45;
let elderlyRatio = 0.3; 
let avoidanceIterations = 4; 
let bufferGap = 18;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  for (let i = 0; i < numCircles; i++) {
    let isElderly = random() < elderlyRatio;
    let r = isElderly ? random(10, 25) : random(15, 50);
    let col = isElderly ? color(170,200,225) : color(210);
    circles.push(new Circle(random(width), random(height), r, isElderly, col));
  }
}

function draw() {
  background(255);

  for (let k = 0; k < avoidanceIterations; k++) {
    for (let i = 0; i < circles.length; i++) {
      let a = circles[i];
      if (!a.isElderly) continue;
      for (let j = 0; j < circles.length; j++) {
        if (i === j) continue;
        a.avoid(circles[j]);
      }
    }
  }

  for (let c of circles) {
    c.move();
    c.edges();
    c.display();
  }
}

class Circle {
  constructor(x, y, r, isElderly, col) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(map(r, 10, 50, 0.3, 1.2));
    this.r = r;
    this.isElderly = isElderly;
    this.col = col;
  }

  move() {
    let noiseStrength = this.isElderly ? 0.008 : 0.05;
    this.vel.add(p5.Vector.random2D().mult(noiseStrength));
    this.vel.limit(map(this.r, 10, 50, this.isElderly ? 0.3 : 0.5, this.isElderly ? 0.8 : 1.4));
    this.pos.add(this.vel);
  }

  edges() {

    if (this.pos.x < this.r || this.pos.x > width - this.r) {
      this.vel.x *= -1;
    }
    if (this.pos.y < this.r || this.pos.y > height - this.r) {
      this.vel.y *= -1;
    }
  }

  avoid(other) {
    let dir = p5.Vector.sub(this.pos, other.pos);
    let d = dir.mag();
    let minDist = this.r + other.r + bufferGap;
    if (d < minDist && d > 0) {
      dir.normalize();
      let overlap = minDist - d;
      this.pos.add(dir.mult(overlap * 0.4)); 
    }
  }

  display() {
    fill(this.col);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}