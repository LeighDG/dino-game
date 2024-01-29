//Board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoTime;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -8;
let velocityY = -0;
let gravity = .4;

let gameOver = false;
let score = 0;
let scoreArray = [];

let cactusInterval;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d") // Drawing onto board

    //Load Dino Image
    dinoImg = new Image();
    dinoImg.src = "./img/dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    //Load Cactus Images
    cactus1Img = new Image();
    cactus1Img.src = "./img/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./img/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./img/cactus3.png";

    document.getElementById("start").addEventListener('click', startGame);

    function startGame() {
        requestAnimationFrame(update);
        cactusInterval = setInterval(placeCactus, 1000)
        document.getElementById("start").disabled = true;
    }

    document.addEventListener('keydown', moveDino);
    document.getElementById('touch-area').addEventListener('touchstart', moveDino, false);

    // Add event listener for the reset button
    document.getElementById("reset").addEventListener('click', resetGame);

    // Function to reset the game state
    function resetGame() {

        // Reset game variables
        gameOver = false;
        score = 0;
        dino.y = dinoY;
        velocityY = -0;

        // Reset cactus array
        cactusArray = [];

        // Change dino image back to the initial state
        dinoImg.src = "./img/dino.png";
        dinoImg.onload = function () {
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        }

        // Restart the game loop
        clearInterval(cactusInterval);
        cactusInterval = setInterval(placeCactus, 1000)
        this.blur();
    }
}



function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY) // Applying gravity to the dino.y while keeping it from going through the ground.
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;

            scoreArray.push(score + 1); // Score being saved was 1 less then the score being displayed on the screen.

            // Order array from most highest to lowest.
            // Only top 10 scores are saved.

            scoreArray.sort((b, a) => a - b);
            scoreArray = scoreArray.slice(0, 10);

            loadIntoHighScore();

            dinoImg.src = "./img/dino-dead.png"
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle = 'black';
    context.font = '20px courier'
    score++;
    context.fillText(score, 5, 20)
}

function moveDino(e) {
    if (gameOver) { return; }

    if ((e.code == 'Space' || e.code == 'ArrowUp'|| e.touches[0]) && dino.y == dinoY) {
        //jump
        velocityY = -10;
    }
}

function placeCactus() {
    if (gameOver) return;

    //place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }


    if (cactusArray.length > 5) {
        cactusArray.shift(); //Remove first element from array preventing it from growing further.
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width && // a's top left corner doesnt reach b's top right corner
        a.x + a.width > b.x &&  //a's top right corner passes b's top left corner
        a.y < b.y + b.height && // a's top left doesnt reach b's bottom left
        a.y + a.height > b.y;   //a's bottom left passes b's top left
}

function loadIntoHighScore() {
    let highScoreElement = document.getElementById("highscore-element");

    while (highScoreElement) {
        highScoreElement.parentNode.removeChild(highScoreElement);
        highScoreElement = document.getElementById("highscore-element");
    }


    for (let i = 0; i < scoreArray.length; i++) {
        var scoreElement = document.createElement('div');
        scoreElement.textContent = (i + 1) + ": " + scoreArray[i];
        scoreElement.id = "highscore-element";
        document.getElementById("highscores").appendChild(scoreElement);
    }
}
