// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var propeller;
var boxes = [];
var birds = [];
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle=0;
var angleSpeed=0;
var canvas;
var timerValue = 60; //start 60s
var birdImg;
var tntImg;
var boomboom;
var tntdraw;
var fade = 255;
////////////////////////////////////////////////////////////
function preload()
{
    birdImg = loadImage('bird.png');
    tntImg = loadImage('tnt.png');
}
////////////////////////////////////////////////////////////
function setup() {
  canvas = createCanvas(1000, 600);
  engine = Engine.create();  //Create an engine

  setupGround();
  setupPropeller();
  setupTower();
  setupSlingshot();
  setupMouseInteraction();
  setupTNT();
  setInterval(timer, 1000); //Decrement 1s
}
////////////////////////////////////////////////////////////
function draw() {
  background(0);
  Engine.update(engine);
  drawGround();
  drawPropeller();
  drawTower();
  drawBirds();
  drawSlingshot();
  drawTNT();

    if (timerValue <= 60)
    {
        textSize(20);
        fill(255)
        text(timerValue + " Seconds", 20, 40);
    }

    push();
    if (fade > 0) {
        fade -= 1.7;
    }
    textSize(15);
    fill(255, 255, 255, fade)
    text("Press 'E'", 423, 450);
    pop();
}
////////////////////////////////////////////////////////////
//Use arrow keys to control propeller
function keyPressed()
{
  if (keyCode == LEFT_ARROW){
      angleSpeed += 0.1;
  }
  else if (keyCode == RIGHT_ARROW){
      angleSpeed -= 0.1;
  }
}
////////////////////////////////////////////////////////////
function keyTyped()
{
  //If 'b' create a new bird to use with propeller
  if (key==='b'){
    setupBird();
  }

  //If 'r' reset the slingshot
  if (key==='r'){
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
    //If 'e' detonate tnt
    if (key==='e')
        {
            detonate();
        }
}

//If mouse is released destroy slingshot constraint so that
//Slingshot bird can fly off
function mouseReleased(){
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//Tells you if a body is off-screen
function isOffScreen(body){
  var pos = body.position;
  return (pos.y > height || pos.x<0 || pos.x>width);
}
////////////////////////////////////////////////////////////
//Removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}
////////////////////////////////////////////////////////////
function youWin()
{
    push();
    fill(255);
    textSize(80);
    textAlign(CENTER);
    text("YOU WIN ( ͡° ͜ʖ ͡°)", width/2, height/2)
    noLoop();
    pop();
}
////////////////////////////////////////////////////////////
function youLose()
{
    push();
    fill(255);
    textSize(80);
    textAlign(CENTER);
    text("GAME OVER ( ͡° ͜ʖ ͡°)", width/2, height/2)
    noLoop();
    pop();
}
