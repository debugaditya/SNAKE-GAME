let snake = [{ x: 5, y: 5 }];
let direction = { x: 1, y: 0 };
let food = { x: 8, y: 7 };

let start = document.querySelector("#start");
let score = document.querySelector("#score");

function setup() {
    document.querySelectorAll('.head').forEach(el => el.remove()); // Clear old elements
    snake.forEach((segment, index) => {
        const segmentElement = document.createElement('div');
        segmentElement.classList.add('head');
        segmentElement.style.gridRowStart = segment.y;
        segmentElement.style.gridColumnStart = segment.x;
        segmentElement.style.backgroundColor = index === 0 ? 'red' : 'yellow';
        document.getElementById('area').appendChild(segmentElement);
    });
}

function collide() {
    if (snake[0].x <= 0 || snake[0].x >= 21 || snake[0].y <= 0 || snake[0].y >= 21) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function createfood() {
    let a = Math.floor(Math.random() * 18 + 1);
    let b = Math.floor(Math.random() * 18 + 1);
    food.x = a;
    food.y = b;

    if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        createfood(); // Avoid overlap
        return;
    }

    const foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.style.backgroundColor = 'purple';
    document.getElementById('area').appendChild(foodElement);
}

function moveSnake() {
    // Move body
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }
    // Move head
    snake[0].x += direction.x;
    snake[0].y += direction.y;
}

function eatFood() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        const eatFood = new Audio('eat.mp3'); // Ensure this file exists in your project
        eatFood.play(); // Play sound effect
        const newSegment = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };
        snake.push(newSegment);
        document.querySelector('.food').remove(); // Remove eaten food
        createfood();
        let currentScore = parseInt(score.innerText.split(': ')[1]);
        score.innerText = "SCORE: " + (currentScore + 1);
    }
}

function gameOver() {
    const end = new Audio('lose.mp3'); // Ensure lose.mp3 exists and is accessible
    end.play(); // Start sound

    setTimeout(() => {
        alert("Game Over! Your score is: " + score.innerText.split(': ')[1]);
    }, 300);
    setTimeout(() => {
        score.innerText = "SCORE: 0";
    }, 310);
    start.style.backgroundColor = "green";
    start.disabled = false;
    snake = [{ x: 5, y: 5 }];
    direction = { x: 1, y: 0 };
    document.getElementById('area').innerHTML = "";
    clearInterval(gameInterval);
}

let gameInterval;
setup();
start.addEventListener("click", function () {
    start.style.backgroundColor = "grey";
    start.disabled = true;
    createfood();
    addEventListener("keydown", function (event) {
        switch (event.key) {
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
    gameInterval = setInterval(() => {
        moveSnake();
        if (collide()) {
            gameOver();
            setup();
            return;
        }
        eatFood();
        setup(); // Re-render the snake
    }, 100); // Adjust speed here
});
