let swingStreched;
let ground;
let band;
let bandLength = 150;
let increasing = true;
let SpiderImg;



function setup() {
  const canvas = createCanvas(800, 600);

  //load Image
  SpiderImg = loadImage('Spider.png');

  // create an engine
  let engine = Matter.Engine.create();
  let world = engine.world;

  // add damped soft global constraint
  swingStreched = new Polygon (world, { x: 400, y: 100, s: 8, r: 50, image: SpiderImg, scale: 0.3 }, { density: 0.3 });
  band = swingStreched.constrainTo(null, {
    pointA: { x: -10, y: -20 }, length: bandLength, stiffness: 1, damping: 0.05, color: 'green'
  });

  mouse = new Mouse(engine, canvas, { stroke: 'blue', strokeWeight: 3 });

  // ground
  ground = new Block(world, { x: 400, y: height - 10, w: 810, h: 30, color: 'white' }, { isStatic: true });

  // run the engine
  Matter.Runner.run(engine);

}

function move() {
  if (increasing) {
    bandLength += 1;
    if (bandLength >= 300) {
      increasing = false;
    }
  } else {
    bandLength -= 1;
    if (bandLength <= 150) {
      increasing = true;
    }
  }
}

function draw() {
  background('grey');

  move();
  swingStreched.draw();
  swingStreched.drawConstraints();
  ground.draw();
  band.length = bandLength;
}





