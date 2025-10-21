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