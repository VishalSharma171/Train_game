// Google Chrome Dinosaur Game (Unicorn, run!)

let unicorn;
let uImg;
let tImg;
let bImg;
let trains = [];
let soundClassifier;
let gameover = false;
let score = 0;

function preload() {
  const options = {
    probabilityThreshold: 0.95,
  };
  soundClassifier = ml5.soundClassifier("SpeechCommands18w", options);
  uImg = loadImage("unicorn.png");
  tImg = loadImage("train.png");
  bImg = loadImage("background.jpg");
}

function mousePressed() {
  if (!gameover) {
    trains.push(new Train());
  } else {
    resetGame();
  }
}

function resetGame() {
  trains = [];
  gameover = false;
  score = 0;
  loop(); // Restart the game loop
}

function setup() {
  createCanvas(800, 450);
  unicorn = new Unicorn();
  soundClassifier.classify(gotCommand);
}

function gotCommand(error, results) {
  if (error) {
    console.error(error);
  }
  console.log(results[0].label, results[0].confidence);
  if (results[0].label == "up" && !gameover) {
    unicorn.jump();
  }
}

function keyPressed() {
  if (key == " " && !gameover) {
    unicorn.jump();
  }
}

function draw() {
  if (random(1) < 0.005 && !gameover) {
    trains.push(new Train());
  }

  background(bImg);
  for (let t of trains) {
    t.move();
    t.show();
    if (unicorn.hits(t)) {
      console.log("game over");
      gameover = true;
      showGameOver();
      noLoop();
    }
  }

  unicorn.show();
  unicorn.move();

  // Display and update the score
  fill(255);
  textSize(20);
  textAlign(RIGHT, TOP);
  text("Score: " + score, width - 20, 20);

  // Increment the score for each frame the game is not over
  if (!gameover) {
    score++;
  }
}

function showGameOver() {
  fill(255, 0, 0);
  textSize(50);
  textAlign(CENTER, CENTER);
  text("Game Over!", width / 2, height / 2);
  textSize(20);
  text("Score: " + score, width / 2, height / 2 + 40);
  text("Click to play again", width / 2, height / 2 + 80);
}
