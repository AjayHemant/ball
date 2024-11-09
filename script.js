let basket = document.getElementById('basket');
let fallingObject = document.getElementById('falling-object');
let gameContainer = document.querySelector('.game-container');
let scoreElement = document.getElementById('score');
let restartButton = document.getElementById('restart-btn');  // Get the restart button element
let score = 0;
let speed = 5;  // Initial speed
let intervalTime = 50;  // Initial interval for the falling object

let basketPosition = basket.offsetLeft;
let objectPosition = {
    top: fallingObject.offsetTop,
    left: fallingObject.offsetLeft
};

let gameWidth = gameContainer.offsetWidth;
let gameHeight = gameContainer.offsetHeight;
let gameOver = false;

// Moving the basket with arrow keys or touch
document.addEventListener('keydown', function (e) {
    if (!gameOver) {
        if (e.key === 'ArrowLeft' && basketPosition > 0) {
            basketPosition -= 50;
            basket.style.left = basketPosition + 'px';
        } else if (e.key === 'ArrowRight' && basketPosition < gameWidth - basket.offsetWidth) {
            basketPosition += 50;
            basket.style.left = basketPosition + 'px';
        }
    }
});

// Mobile touch event listeners
let touchStartX = 0;
let touchEndX = 0;

// For detecting drag or swipe to move the basket
gameContainer.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
});

gameContainer.addEventListener('touchmove', function (e) {
    touchEndX = e.touches[0].clientX;
    let diff = touchEndX - touchStartX;

    // If swipe is detected, move the basket accordingly
    if (Math.abs(diff) > 10) {
        if (diff < 0 && basketPosition > 0) {  // Swipe Left
            basketPosition -= 10;
            basket.style.left = basketPosition + 'px';
        } else if (diff > 0 && basketPosition < gameWidth - basket.offsetWidth) {  // Swipe Right
            basketPosition += 10;
            basket.style.left = basketPosition + 'px';
        }
        touchStartX = touchEndX;  // Reset touch start position for smooth dragging
    }
});

gameContainer.addEventListener('touchend', function () {
    // After touch is finished, reset the position
    touchStartX = 0;
    touchEndX = 0;
});

// Falling object movement
function dropObject() {
    if (gameOver) return;

    fallingObject.style.top = objectPosition.top + 'px';
    fallingObject.style.left = objectPosition.left + 'px';

    let fallingInterval = setInterval(function () {
        if (gameOver) {
            clearInterval(fallingInterval);
            return;
        }

        objectPosition.top += speed;  // Falling speed starts slow but increases
        fallingObject.style.top = objectPosition.top + 'px';

        // If the object hits the bottom without being caught
        if (objectPosition.top >= gameHeight - fallingObject.offsetHeight) {
            clearInterval(fallingInterval);
            endGame();  // Call the end game function
        }

        // Check if the object is caught by the basket
        if (
            objectPosition.top >= gameHeight - basket.offsetHeight - fallingObject.offsetHeight &&
            objectPosition.left >= basketPosition &&
            objectPosition.left <= basketPosition + basket.offsetWidth
        ) {
            score += 10;  // Increase score by 10 for each catch
            scoreElement.innerText = 'Score: ' + score;  // Update score display
            clearInterval(fallingInterval);
            increaseSpeed();  // Increase speed for the next ball
            resetObject();  // Reset the object
        }
    }, intervalTime);  // Use the current interval time for speed control
}

function resetObject() {
    if (gameOver) return;
    
    objectPosition.top = 0;
    objectPosition.left = Math.random() * (gameWidth - fallingObject.offsetWidth);  // Randomize the horizontal position
    dropObject();  // Drop the object again
}

// Increase the speed by decreasing the interval or increasing the speed value
function increaseSpeed() {
    if (speed < 13) {  // Increase speed up to a max limit
        speed += 0.5;  // Increase the falling speed by 1 pixel per interval
    } else {
        // If speed hits the max, reduce the interval to make the game harder
        intervalTime = Math.max(intervalTime - 5, 20);  // Decrease interval down to a minimum of 20ms
    }
}

function endGame() {
    gameOver = true;
    scoreElement.innerText = 'You are out! Final Score: ' + score;
    fallingObject.style.display = 'none';  // Hide the falling object
    restartButton.style.display = 'block';  // Show the restart button
}

// Function to restart the game
function restartGame() {
    gameOver = false;
    score = 0;
    speed = 5;
    intervalTime = 50;

    scoreElement.innerText = 'Score: ' + score;  // Reset score
    fallingObject.style.display = 'block';  // Show the falling object
    restartButton.style.display = 'none';  // Hide the restart button

    objectPosition.top = 0;
    objectPosition.left = Math.random() * (gameWidth - fallingObject.offsetWidth);
    dropObject();  // Start the falling object again
}

// Add event listener to the restart button
restartButton.addEventListener('click', restartGame);

// Start the game by dropping the first object
dropObject();
