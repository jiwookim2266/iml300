var circles = [];
function setup() {
  createCanvas(600, 600);
  angleMode(DEGREES);
}

function draw() {
  //grey background color
  background(123, 121, 134);

  //pink circles in background when mouse is clicked
  noStroke();
  for (var i = 0; i < circles.length; i++) {
    fill(circles[i].r, circles[i].g, circles[i].b, 150);
    ellipse(circles[i].x, circles[i].y, circles[i].size);
    circles[i].size += 1;
  }
  //hair
  fill(0);
  noStroke();
  rect(150, 300, 300, 400);
  ellipse(300, 275, 307, 330);

  //face
  fill(239, 193, 168);
  ellipse(300, 300, 250, 300);

  //additional parts of hair
  stroke("hair1");
  stroke(0);
  strokeWeight(7);
  line(270, 140, 190, 280);
  stroke("hair2");
  stroke(0);
  line(335, 140, 410, 260);

  //eye
  fill(0);
  circle(260, 300, 20);
  circle(340, 300, 20);
  
  stroke("sparkle");
  fill(255);
  circle(262, 300, 1);
  circle(345, 300, 1);

  //nose
  noFill();
  stroke(0);
  strokeWeight(4);
  arc(300, 330, 10, 10, 0, 180);

  //smile
  arc(300, 330, 120, 110, 30, 150);

  //additional hair for forehead
  strokeWeight(12);
  arc(300, 278, 260, 245, 185, 355);

  //cheeks
  fill(255, 163, 165);
  noStroke();
  ellipse(220, 330, 35, 25);
  ellipse(380, 330, 35, 25);
}

  //input for pink circles
function mousePressed() {
  var r = random(200, 255);
  var g = random(80, 180);
  var b = random(100, 180);

  circles.push({
    x: mouseX,
    y: mouseY,
    size: 10,
    r: r,
    g: g,
    b: b,
  });
}
