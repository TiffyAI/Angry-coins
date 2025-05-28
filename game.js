// Module aliases
const Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Constraint = Matter.Constraint,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Events = Matter.Events;

// Create engine
const engine = Engine.create();
const world = engine.world;

// Create renderer
const canvas = document.getElementById('gameCanvas');
const width = window.innerWidth;
const height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: width,
    height: height,
    wireframes: false,
    background: 'transparent'
  }
});

Render.run(render);
Engine.run(engine);

// Load bird image
const birdImage = new Image();
birdImage.src = 'assets/TiffyAI-Token.png';

// Create ground
const ground = Bodies.rectangle(width / 2, height - 20, width, 40, {
  isStatic: true,
  render: { fillStyle: '#060a19' }
});
World.add(world, ground);

// Create bird
const birdRadius = 20;
const bird = Bodies.circle(200, height - 100, birdRadius, {
  density: 0.004,
  restitution: 0.8,
  render: {
    sprite: {
      texture: 'assets/TiffyAI-Token.png',
      xScale: (birdRadius * 2) / 100,
      yScale: (birdRadius * 2) / 100
    }
  }
});
World.add(world, bird);

// Create slingshot constraint
const slingshot = Constraint.create({
  pointA: { x: 200, y: height - 100 },
  bodyB: bird,
  stiffness: 0.05,
  render: {
    lineWidth: 5,
    strokeStyle: '#ffffff'
  }
});
World.add(world, slingshot);

// Add mouse control
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.02,
    render: {
      visible: false
    }
  }
});
World.add(world, mouseConstraint);
render.mouse = mouse;

// Release bird on mouse up
Events.on(mouseConstraint, 'enddrag', function(event) {
  if (event.body === bird) {
    setTimeout(() => {
      World.remove(world, slingshot);
    }, 100);
  }
});

// Reset bird position on spacebar press
document.addEventListener('keydown', function(event) {
  if (event.code === 'Space') {
    World.remove(world, bird);
    const newBird = Bodies.circle(200, height - 100, birdRadius, {
      density: 0.004,
      restitution: 0.8,
      render: {
        sprite: {
          texture: 'assets/TiffyAI-Token.png',
          xScale: (birdRadius * 2) / 100,
          yScale: (birdRadius * 2) / 100
        }
      }
    });
    World.add(world, newBird);
    slingshot.bodyB = newBird;
    World.add(world, slingshot);
  }
});
