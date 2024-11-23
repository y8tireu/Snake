const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const gridSize = 20; // Size of each grid cell
let snake = [{ x: 300, y: 300 }];
let direction = { x: 0, y: 0 };
let food = { x: 0, y: 0 };
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameSpeed = 100;
let gameRunning = true;

// Load sounds
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");

// Initialize food position
function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    food.y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;

    // Ensure food does not spawn on the snake
    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        placeFood();
    }
}
placeFood();

// Draw Snake and Food
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });

    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Move the snake
function update() {
    const head = { ...snake[0] };

    head.x += direction.x * gridSize;
    head.y += direction.y * gridSize;

    // Check if the snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById("score").textContent = score;
        eatSound.play();
        placeFood();

        // Increase speed every 50 points
        if (score % 50 === 0) {
            gameSpeed = Math.max(gameSpeed - 10, 50);
        }
    } else {
        snake.pop(); // Remove the tail
    }

    snake.unshift(head);

    // Check for collisions
    if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= canvas.width ||
        head.y >= canvas.height ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    ) {
        gameOverSound.play();
        alert(`Game Over! Your score: ${score}`);
        resetGame();
    }
}

// Reset Game
function resetGame() {
    highScore = Math.max(highScore, score);
    localStorage.setItem("highScore", highScore);
    document.getElementById("highScore").textContent = highScore;

    snake = [{ x: 300, y: 300 }];
    direction = { x: 0, y: 0 };
    score = 0;
    gameSpeed = 100;
    document.getElementById("score").textContent = score;
    placeFood();
}

// Game Loop
function gameLoop() {
    if (gameRunning) {
        update();
        draw();
    }
    setTimeout(gameLoop, gameSpeed);
}

// Pause/Resume Game
document.getElementById("pauseButton").addEventListener("click", () => {
    gameRunning = !gameRunning;
    document.getElementById("pauseButton").textContent = gameRunning ? "Pause" : "Resume";
});

// Control Snake Direction
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// Start Game
document.getElementById("highScore").textContent = highScore;
gameLoop();

