var blockSize = 25;
var rows = 20;
var cols = 20;
var gameCanvas;
var context;
var snake = [{ x: 5, y: 5 }]; // Początkowa pozycja węża
var direction = "right"; // Początkowy kierunek ruchu
var food = { x: 10, y: 10 }; // Początkowa pozycja jedzenia
var gameInterval;
var gameStarted = false; // Flaga wskazująca, czy gra została rozpoczęta
var score = 0; // Początkowa punktacja
var highscore = localStorage.getItem("highscore") || 0; // Pobieranie highscore z localStorage
var speed = 100; // Początkowa prędkość
var pointMultiplier = 2; // Początkowy mnożnik zdobywania punktów
var selectedDifficulty = "Średni"; // Początkowy poziom trudności

// Funkcja wywoływana po załadowaniu strony
window.onload = function() {
    gameCanvas = document.getElementById("gameCanvas");
    gameCanvas.height = rows * blockSize;
    gameCanvas.width = cols * blockSize;
    context = gameCanvas.getContext("2d");
    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("easyButton").addEventListener("click", setEasyDifficulty);
    document.getElementById("mediumButton").addEventListener("click", setMediumDifficulty);
    document.getElementById("hardButton").addEventListener("click", setHardDifficulty);
    document.getElementById("extremeButton").addEventListener("click", setExtremeDifficulty);
    document.addEventListener("keydown", handleKey);
    document.getElementById("resetButton").addEventListener("click", resetGame);
    updateScore();
}

// Funkcja aktualizująca planszę
function update() {
    context.fillStyle = "black";
    context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    drawFood();
    drawSnake();
}

// Funkcja rysująca węża na planszy
function drawSnake() {
    context.fillStyle = "green";
    snake.forEach(segment => {
        context.fillRect(segment.x * blockSize, segment.y * blockSize, blockSize, blockSize);
    });
}

// Funkcja rysująca jedzenie na planszy
function drawFood() {
    context.fillStyle = "red";
    context.fillRect(food.x * blockSize, food.y * blockSize, blockSize, blockSize);
}

// Rozpoczęcie gry po naciśnięciu przycisku "Start"
function startGame() {
    if (!gameStarted) {
        snake = [{ x: 5, y: 5 }];
        direction = "right";
        food = { x: 10, y: 10 };
        score = 0;
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
        gameStarted = true;
        updateScore();
        document.removeEventListener("keydown", handleKey);
        document.addEventListener("keydown", handleKey);
    }
}

// Główna pętla gry
function gameLoop() {
    if (gameStarted) {
        moveSnake();
        checkCollision();
        update();
    }
}

// Funkcja poruszająca wężem
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === "right") head.x++;
    if (direction === "left") head.x--;
    if (direction === "up") head.y--;
    if (direction === "down") head.y++;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows)
        };
        score += pointMultiplier;
        updateScore();
    } else {
        snake.pop();
    }
}

// Funkcja sprawdzająca kolizje
function checkCollision() {
    const head = snake[0];

    if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        alert("Koniec gry! Twój wynik: " + score);
        if (score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore);
        }
        clearInterval(gameInterval);
        gameStarted = false;
        updateScore();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            alert("Koniec gry! Twój wynik: " + score);
            if (score > highscore) {
                highscore = score;
                localStorage.setItem("highscore", highscore);
            }
            clearInterval(gameInterval);
            gameStarted = false;
            updateScore();
        }
    }
}

// Obsługa klawiszy
function handleKey(event) {
    if (!gameStarted) {
        startGame();
    }

    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    if (event.key === "ArrowRight" && direction !== "left") direction = "right";
}

// Aktualizacja wyniku i poziomu trudności na stronie
function updateScore() {
    const scoreElement = document.getElementById("score");
    const highscoreElement = document.getElementById("highscore");
    const difficultyElement = document.getElementById("level");
    scoreElement.innerText = "Score: " + score;
    highscoreElement.innerText = "Highscore: " + highscore;
    difficultyElement.innerText = "Level: " + selectedDifficulty;
}


function setEasyDifficulty() {
    speed = 150;
    pointMultiplier = 1;
    selectedDifficulty = "Easy";
    updateLevel();
    resetGame();
}


function setMediumDifficulty() {
    speed = 100;
    pointMultiplier = 2;
    selectedDifficulty = "Medium";
    updateLevel();
    resetGame();
}


function setHardDifficulty() {
    speed = 75;
    pointMultiplier = 3;
    selectedDifficulty = "Hard";
    updateLevel();
    resetGame();
}


function setExtremeDifficulty() {
    speed = 25;
    pointMultiplier = 4;
    selectedDifficulty = "Extreme";
    updateLevel();
    resetGame();
}

// Resetowanie gry
function resetGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    snake = [{ x: 5, y: 5 }];
    direction = "right";
    food = { x: 10, y: 10 };
    score = 0;
    updateScore();
    updateLevel();
    startGame();
}

// Aktualizacja poziomu trudności na stronie
function updateLevel() {
    const levelElement = document.getElementById("level");
    levelElement.innerText = "Poziom trudności: " + selectedDifficulty;
}
