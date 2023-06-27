const Events = Matter.Events;

let magnetA;
let magnetB;
let world;
let boxes;
let ball;
let SpiderImg;
let band;
let bandLength = 150;
let increasing = true;
let cZ = 0;
let mouse;
let mottenAnzahl = 25;
let polygon;
let unsichtbareWand1;

let scenes = [scene1, scene2];
let scene = 0;
let sceneBack, sceneFore, focus;

let motten = [];

let blocks = [];

function setup() {
  document.addEventListener('click', onMouseClick);
  document.addEventListener('keydown', onKeyDown);
  const canvas = createCanvas(2248, 1280);

  // create an engine
  let engine = Matter.Engine.create();
  world = engine.world;

  SpiderImg = loadImage('spinne.png');

  sceneBack = document.getElementById('scene-background');
  sceneFore = document.getElementById('scene-foreground');
  focus = document.getElementById('top');

  // no gravity
  engine.world.gravity.scale = 0.00005;



  mouse = new Mouse(engine, canvas, { stroke: 'magenta', strokeWeight: 2 });

  // run the engine
  Matter.Runner.run(engine);

  setInterval(kollisionserkennung, 10);

  switchScene(0);

  Matter.Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs[0];
    const bodyA = pairs.bodyA;
    const bodyB = pairs.bodyB;
    if (bodyA.label === "propeller" || bodyB.label === "propeller") {
      hitSound.play();
    }
  });
}
function scene1() {

  sceneBack.style['background'] = 'url("./nachthimmel.png") no-repeat';
  sceneFore.style['background'] = 'url("./gebaude.png") no-repeat';

  // add a group of identical boxes
  boxes = new Stack(
    world,
    { x: 240, y: 100, cols: 5, rows: 5, colGap: 5, rowGap: 5, color: 'red',
      create: (bx, by) => Matter.Bodies.circle(bx, by, 5, { restitution: 0.9 })
    },
    {mass:30}
  );
  blocks.push(boxes);
  console.log("Motten:"+motten);

  // add magnets
  // NOTE: Adding a "mass" is important, otherwise mass will default to infinite which makes for weird behaviour
  magnetA = new Magnet(
    world,
    { x: 200, y: 300, r: 50, color: 'grey', attraction: 0.6 },
    { isStatic: true, mass: 50 }
  );
  magnetA.addAttracted(boxes.body.bodies);
  //magnetA.isActive = false ;
  magnetB = new Magnet(
    world,
    { x: 600, y: 100, r: 50, color: 'grey', attraction: 0.6 },
    { isStatic: true, mass: 50 }
  );
  magnetB.addAttracted(boxes.body.bodies);

  magnetC = new Magnet(
    world,
    { x: 1000, y: 300, r: 50, color: 'grey', attraction: 0.6 },
    { isStatic: true, mass: 50 }
  );
  magnetC.addAttracted(boxes.body.bodies);

  magnetD = new Magnet(
    world,
    { x: 1400, y: 500, r: 50, color: 'grey', attraction: 0.6 },
    { isStatic: true, mass: 50 }
  );
  magnetD.addAttracted(boxes.body.bodies);

  magnetE = new Magnet(
    world,
    { x: 1800, y: 300, r: 50, color: 'grey', attraction: 0.6 },
    { isStatic: true, mass: 50 }
  );
  magnetE.addAttracted(boxes.body.bodies);

  blocks.push(magnetA, magnetB, magnetC, magnetD, magnetE);
  console.log(blocks);

  ball = new Ball(world, 
  {x: 550, y:150, r:50, color: 'green'},
  {isStatic: true});
  blocks.push(ball);

  unsichtbareWand1 = new Block(world,
    { x: 400, y: 300, w: 650, h: 30, color: 'white' },
    { isStatic: true, angle: angle, label: 'wand' }
  );
  blocks.push(unsichtbareWand1);


  swingStreched = new Polygon(world, { x: 400, y: 100, s: 8, r: 40, image: SpiderImg, scale: 0.3 }, { density: 0.3 });
  band = swingStreched.constrainTo(null, {
    pointA: { x: -10, y: -20 }, length: bandLength, stiffness: 1, damping: 0.05, color: 'green'
  });
  blocks.push(swingStreched);
}

function scene2(){
  sceneBack.style['background'] = 'url("./kitchen.png") no-repeat';
  sceneFore.style['background'] = '';
  //blocks.push(motten);
  boxes = new Stack(
    world,
    { x: 240, y: 100, cols: mottenAnzahl, rows: 1, colGap: 5, rowGap: 5, color: 'red',
      create: (bx, by) => Matter.Bodies.circle(bx, by, 5, { restitution: 0.9 })
    },
    {mass:30}
  );
  blocks.push(boxes);
  polygon = new BlockFromSVG(world,
    { x: 300, y: 650, fromFile: './LKW.svg', scale: 3, color: 'green' },
    { isStatic: true, friction: 0.0 }
  );
  blocks.push(polygon);
}

function switchScene(newScene) {
  console.log('Scene', newScene)
  // cleanup of all blocks in the old scene
  console.log(blocks)
  for(let w = 0; w++; w>blocks.length){
    if(block.body.bodies){
    Matter.Composite.remove(world, block.body.bodies[w])
    } else {
      Matter.World.remove(world, block.body);
    }
  }
  //Matter.Composite.remove(world, band);
 // blocks.forEach(block => Matter.World.remove(world, block.body));
  blocks = [];

  // activate the new scene

  scene = newScene;
  /*if(scene == 1){
    scene1();
  }
  if(scene == 2){
    scene2();
  }*/
  scenes[scene]();
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

function onMouseClick() {
  //cZ = (cZ++)%1;
  if (cZ < 4) {
    cZ++;
  }
  else if(cZ==4) {
    cZ = 0;
  }
  console.log(cZ);
  switch(cZ){
    case 0:
      magnetA.isActive = true;
      magnetB.isActive = false;
      magnetC.isActive = false;
      magnetD.isActive = false;
      magnetE.isActive = false;
      magnetA.attributes.color = "yellow";
      magnetB.attributes.color = "grey";
      magnetC.attributes.color = "grey";
      magnetD.attributes.color = "grey";
      magnetE.attributes.color = "grey";
      break;
    case 1:
      magnetA.isActive = false;
      magnetB.isActive = true;
      magnetC.isActive = false;
      magnetD.isActive = false;
      magnetE.isActive = false;
      magnetA.attributes.color = "grey";
      magnetB.attributes.color = "yellow";
      magnetC.attributes.color = "grey";
      magnetD.attributes.color = "grey";
      magnetE.attributes.color = "grey";
      break;
    case 2:
      magnetA.isActive = false;
      magnetB.isActive = false;
      magnetC.isActive = true;
      magnetD.isActive = false;
      magnetE.isActive = false;
      magnetA.attributes.color = "grey";
      magnetB.attributes.color = "grey";
      magnetC.attributes.color = "yellow";
      magnetD.attributes.color = "grey";
      magnetE.attributes.color = "grey";
      break;
    case 3:
      magnetA.isActive = false;
      magnetB.isActive = false;
      magnetC.isActive = false;
      magnetD.isActive = true;
      magnetE.isActive = false;
      magnetA.attributes.color = "grey";
      magnetB.attributes.color = "grey";
      magnetC.attributes.color = "grey";
      magnetD.attributes.color = "yellow";
      magnetE.attributes.color = "grey";
      break;
    case 4:
      magnetA.isActive = false;
      magnetB.isActive = false;
      magnetC.isActive = false;
      magnetD.isActive = false;
      magnetE.isActive = true;
      magnetA.attributes.color = "grey";
      magnetB.attributes.color = "grey";
      magnetC.attributes.color = "grey";
      magnetD.attributes.color = "grey";
      magnetE.attributes.color = "yellow";
      break;
  
  }
}

function draw() {
  clear(0);
  //background(255, 10);

  magnetA.gravity();
  magnetB.gravity();
  magnetC.gravity();
  magnetD.gravity();
  magnetE.gravity();
  textAlign(CENTER, CENTER);
  textSize(30);
  text('Anzahl der Motten: '+ mottenAnzahl, width/2, 50);
  /*magnetA.draw();
  magnetB.draw();
  magnetC.draw();
  magnetD.draw();
  magnetE.draw();
  boxes.draw();
  mouse.draw();
  ball.draw();*/
  blocks.forEach(block => block.draw());

  move();
  //kollisionserkennung();
  //swingStreched.drawConstraints();
  band.length = bandLength;
  
 //Hit SOund Beispiel
  }

 function onKeyDown(event) {
  switch (event.key) {
    case 'n':
      //switchScene((scene + 1) % scenes.length)
      switchScene(1);
      console.log(boxes);
      break;
    case 'p':
      switchScene(0);
      break;
    default:
      console.log(event.key);
  }
}
 

function kollisionserkennung(){
  for(let s = 0; s<boxes.body.bodies.length; s++){
    if(boxes.body.bodies[s].position.y>650){
      //console.log(boxes.body.bodies[s].position);
      Matter.Composite.remove(boxes.body, boxes.body.bodies[s]);
      mottenAnzahl--;
      //motten.pop();
      //delete boxes.body.bodies[s];
    }
    if(Matter.Collision.collides(boxes.body.bodies[s], ball.body) != null){
      Matter.Composite.remove(boxes.body, boxes.body.bodies[s]);
      mottenAnzahl--
      //motten.pop();
      //Hier muss dann rein, dass die motten auch aus dem motten[]-array entfernt werden
    } //Hit SOund Beispiel

    if(Matter.Collision.collides(boxes.body.bodies[s], swingStreched.body) != null){
      Matter.Composite.remove(boxes.body, boxes.body.bodies[s]);
      mottenAnzahl--
      //motten.pop();
      //Hier muss dann rein, dass die motten auch aus dem motten[]-array entfernt werden
      //Vllt einfach mit motten.pop arbeiten, weil ja eigentlich egal welche Motte jetzt genau entfernt wird
    }
  }
}
