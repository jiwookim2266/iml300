// For my music video exercise, I chose "Cry" by Cigarettes After Sex because its hazy intimacy matches the loneliness I wanted to show. I kept everything in black and white and leaned into a glitchy TV look with scanlines, soft rain streaks, and drifting abstract shapes. In the first scene the spirals feel like breathing as they form and slowly rotate, like a quiet inhale and exhale. The second scene pushes inward as the shapes become more irregular and the frame subtly zooms, as if I am being pulled into the static. In the last scene the veins grow from the bottom left and branch faster until the screen feels crowded and suffocating, which is the feeling I was trying to capture.


// scenes timing
const SCENE1_END = 13;
const SCENE2_END = 26;
const SCENE3_END = 42;

let song, playing = false;

// globals
let cols = 8, rows = 8;
let spirals = [], greys;
let veins = [], scene3Started = false;

// audio
function preload() {
  song = loadSound("Cry - Cigarettes After Sex-[AudioTrimmer.com].mp3");
}

// setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  pixelDensity(1);
  noFill();
  greys = [[40,40,40],[90,90,90],[140,140,140],[200,200,200],[240,240,240]];
  initSpirals(); // scene 1
}

// draw dispatch
function draw() {
  if (!playing) { background(0); drawScanlines(0.01,3,30,80); uiClick(); return; }
  const t = song.currentTime();

  if (t <= SCENE1_END) { background(0); drawScanlines(0.01,3,30,80); scene1_draw(t); }
  else if (t <= SCENE2_END) { scene2_draw(t); }
  else if (t <= SCENE3_END) { if (!scene3Started){ background(0); seedVeinsBL(); scene3Started=true; } scene3_draw(t); }
}

// scene 1 - init (breathing mold)
function initSpirals() {
  spirals = [];
  const sx = width / cols, sy = height / rows;
  for (let i=0;i<cols;i++){
    for (let j=0;j<rows;j++){
      let rot = random(-2.4, 2.4); if (abs(rot)<0.2) rot = 0.2*(rot<0?-1:1);
      spirals.push({
        x: i*sx + sx/2 + random(-20,20),
        y: j*sy + sy/2 + random(-20,20),
        baseSize: random(60, 200),
        angle: random(360),
        rotationSpeed: rot,
        spinAmp: random(0.4, 1.2),
        spinFreq: random(0.3, 1.0),
        layers: int(random(2,4)),
        col: random(greys),
        breathAmp: random(0.15, 0.35),
        breathFreq: random(0.7, 1.3),
        breathPhase: random(Math.PI*2),
        macroAmp: random(0.15, 0.4),
        macroFreq: random(0.12, 0.25),
        formStart: random(0, 2.0),
        formDuration: random(2.5, 6.5)
      });
    }
  }
}

// scene 1 - draw (grows while rotating; slower at start)
function scene1_draw(t){
  for (let s of spirals) {
    const local = 1 + s.breathAmp * Math.sin(s.breathFreq*t + s.breathPhase);
    const macro = 1 + s.macroAmp * Math.sin(s.macroFreq*t + s.breathPhase*0.5);
    const sizePulse = local * macro;
    const spin = s.rotationSpeed + s.spinAmp * Math.sin(s.spinFreq*t + s.breathPhase);

    // formation 0→1 (smoothstep)
    let fp = constrain((t - s.formStart) / s.formDuration, 0, 1);
    fp = fp*fp*(3 - 2*fp);
    // gentle early rotation → full by end of formation
    const speedFactor = 0.25 + 0.75 * (fp*fp);

    push();
    translate(s.x, s.y);
    rotate(s.angle);
    for (let l=0; l<s.layers; l++){
      let currentSize = s.baseSize * sizePulse * (1 - l*0.25);
      strokeWeight(1 + noise(frameCount*0.01 + l)*1.5);
      stroke(s.col[0], s.col[1], s.col[2], 60);
      drawMoldySpiralProgress(currentSize, 5 + l*2, 8, 7, fp);
    }
    pop();

    s.angle += spin * speedFactor;
  }
}

// scene 1 - helper (partial spiral)
function drawMoldySpiralProgress(size, turns, stepDeg, noiseAmp, progress){
  const maxAng = 360 * turns * progress;
  beginShape();
  for (let th=0; th<maxAng; th+=stepDeg){
    let r = map(th, 0, 360*turns, 0, size);
    let nx=(noise(r*0.02, th*0.01, frameCount*0.002)-0.5)*noiseAmp;
    let ny=(noise(r*0.02+100, th*0.01, frameCount*0.002)-0.5)*noiseAmp;
    vertex(r*cos(th)+nx, r*sin(th)+ny);
  }
  endShape();
}

// scene 2 - draw (tv/rain/abstract zoom)
function scene2_draw(t){
  background(0);
  drawScanlines(0.01,3,40,220);

  stroke(200,55);
  for (let i=0;i<140;i++){
    let x = random(width), len = random(10,40);
    let off = sin(frameCount*0.05 + x*0.01)*4;
    line(x+off, random(height), x+off, random(height)+len);
  }

  let d = (t-20.5)/2.2, surge = 0.35*Math.exp(-1.2*d*d);
  let zoom = 1 + (t - SCENE1_END)*0.06 + surge;

  push();
  translate(width/2, height/2);
  scale(zoom);
  noStroke();
  for (let i=0;i<44;i++){
    let nx = noise(i*0.23, frameCount*0.004);
    let ny = noise(i*0.23+50, frameCount*0.004);
    let x = map(nx,0,1,-width/2,width/2);
    let y = map(ny,0,1,-height/2,height/2);
    let sx = (noise(i*0.14, frameCount*0.01)-0.5)*20;
    let sy = (noise(i*0.14+99, frameCount*0.01)-0.5)*20;
    push();
    translate(x+sx, y+sy);
    rotate(random(-5,5));
    fill(255, random(16,60));
    drawNoisyBlob(random(6,28), int(random(12,24)), 0.4, 0.012);
    pop();
  }
  pop();

  if (frameCount%28<2){ noStroke(); fill(255,20); rect(0,0,width,height); }
}

// scene 3 - seed veins (bottom-left)
function seedVeinsBL(){
  veins = [];
  for (let i=0;i<18;i++) veins.push(new Vein(random(20,80), height - random(20,80)));
}

// scene 3 - draw (longer runs, faster end)
function scene3_draw(t){
  drawScanlines(0.01,4,15,50);
  const prog = constrain((t-26)/(SCENE3_END-26),0,1);
  const branchProb = 0.006 + 0.20*(prog*prog*prog);
  const speedBoost = 1 + 0.7*prog;

  for (let i=veins.length-1; i>=0; i--){
    const v = veins[i];
    v.update(speedBoost);
    v.bounce();
    v.display();
    let minSteps = lerp(30, 8, prog);
    if (v.stepsSinceBranch >= minSteps && Math.random()<branchProb && veins.length<6000){
      veins.push(v.spawn());
      v.stepsSinceBranch = 0;
    }
  }
}

// class - vein
class Vein{
  constructor(x,y){
    this.x=x; this.y=y; this.px=x; this.py=y;
    this.angle = Math.random()*Math.PI*2;   // radians
    this.baseSpeed = random(1.6, 2.4);
    this.stepsSinceBranch = 0;
  }
  update(speedBoost=1){
    this.px=this.x; this.py=this.y;
    this.angle += (Math.random()*0.4 - 0.2);
    const step = this.baseSpeed * speedBoost;
    this.x += Math.cos(this.angle)*step;
    this.y += Math.sin(this.angle)*step;
    this.stepsSinceBranch++;
  }
  bounce(){
    const m=2;
    if (this.x<m){ this.x=m; this.angle = Math.PI - this.angle; }
    if (this.x>width-m){ this.x=width-m; this.angle = Math.PI - this.angle; }
    if (this.y<m){ this.y=m; this.angle = -this.angle; }
    if (this.y>height-m){ this.y=height-m; this.angle = -this.angle; }
  }
  display(){
    strokeWeight(1.6);
    const g = random([170,185,200,220,235]);
    stroke(g,150);
    line(this.px,this.py,this.x,this.y);
  }
  spawn(){
    const c = new Vein(this.x,this.y);
    const fork = (Math.random()<0.5?-1:1)*(Math.PI/7 + Math.random()*Math.PI/9);
    c.angle = this.angle + fork;
    return c;
  }
}

// helpers - scanlines / noisy blob / ui
function drawScanlines(ns, stepY, minB, maxB){
  strokeWeight(1);
  for (let y=0; y<height; y+=stepY){
    let n = noise(y*0.01, frameCount*ns);
    stroke(map(n,0,1,minB,maxB));
    line(0,y,width,y);
  }
}
function drawNoisyBlob(r, verts, amp, freq){
  beginShape();
  for (let i=0;i<verts;i++){
    let a = (360/verts)*i;
    let nr = r*(1 + (noise(i*0.13, frameCount*freq)-0.5)*amp);
    vertex(nr*cos(a), nr*sin(a));
  }
  endShape(CLOSE);
}
function uiClick(){ push(); textAlign(CENTER,CENTER); noStroke(); fill(255,180); textSize(16); text("play", width/2, height/2); pop(); }

// input / resize
function mousePressed(){ if (!playing){ song.play(); playing=true; background(0); } }
function windowResized(){ resizeCanvas(windowWidth, windowHeight); initSpirals(); if (scene3Started && veins.length===0) seedVeinsBL(); }
