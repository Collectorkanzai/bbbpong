// Get canvas and create drawing context
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 600;
canvas.height = 400;

// Create a ball object with properties such as position, velocity, radius, and color
let ball = {
    x: canvas.width / 2,  // Start position in the middle of the canvas
    y: canvas.height / 2,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "WHITE"
};

// Create a paddle object for the player with position, dimensions, and score
let userPaddle = {
    x: 0,  // Left side of the canvas
    y: (canvas.height - 100) / 2,  // Starts in the middle of the screen
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
};

// Create a paddle object for the computer with similar properties as the user's paddle
let comPaddle = {
    x: canvas.width - 10,  // Right side of the canvas
    y: (canvas.height - 100) / 2,  // Starts in the middle of the screen
    width: 10,
    height: 100,
    score: 0,
    color: "WHITE"
};

// Function to draw rectangles (e.g., paddles)
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Function to draw circles (the ball)
function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

// Function to draw text (score)
function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Draw the game (field, paddles, ball, and score)
function render() {
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");  // Draw background
    drawRect(userPaddle.x, userPaddle.y, userPaddle.width, userPaddle.height, userPaddle.color);  // Draw user's paddle
    drawRect(comPaddle.x, comPaddle.y, comPaddle.width, comPaddle.height, comPaddle.color);  // Draw computer's paddle
    drawCircle(ball.x, ball.y, ball.radius, ball.color);  // Draw ball
    drawText(userPaddle.score, canvas.width / 4, canvas.height / 5, "WHITE");  // Draw user's score
    drawText(comPaddle.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");  // Draw computer's score
}

// Update ball's position and handle collisions
function updateBallPosition() {
    ball.x += ball.velocityX;  // Move ball horizontally
    ball.y += ball.velocityY;  // Move ball vertically

    // Collision with top and bottom
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;  // Reverse ball's vertical direction
    }

    let player = (ball.x < canvas.width / 2) ? userPaddle : comPaddle;  // Determine which paddle is involved

    // Collision with paddles
    if (ball.x - ball.radius < player.x + player.width && ball.x + ball.radius > player.x &&
        ball.y - ball.radius < player.y + player.height && ball.y + ball.radius > player.y) {
        let collidePoint = (ball.y - (player.y + player.height / 2));  // Calculate collision point
        collidePoint /= (player.height / 2);
        let angleRad = collidePoint * Math.PI / 4;  // Calculate reflection angle
        let direction = (ball.x < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);  // Update horizontal speed based on angle
        ball.velocityY = ball.speed * Math.sin(angleRad);  // Update vertical speed
        ball.speed += 0.1;  // Increase speed slightly after each collision
    }

    // Handle ball loss
    if (ball.x - ball.radius < 0) {
        comPaddle.score++;  // Add point to computer
        resetBall();  // Reset ball
    } else if (ball.x + ball.radius > canvas.width) {
        userPaddle.score++;  // Add point to user
        resetBall();  // Reset ball
    }
}

// Reset ball to the middle of the field
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = ball.velocityX > 0 ? -5 : 5;  // Change horizontal direction
    ball.velocityY = 5;  // Set default vertical speed
    ball.speed = 7;  // Set default speed
}

// Update computer's paddle based on ball's position
function updateComPaddle() {
    const paddleCenter = comPaddle.y + comPaddle.height / 2;
    if (paddleCenter < ball.y - 20) {
        comPaddle.y += 4;  // Move up if the ball is above the paddle
    } else if (paddleCenter > ball.y + 20) {
        comPaddle.y -= 4;  // Move down if the ball is below the paddle
    }
}

// Add mouse control for the user's paddle to the canvas
canvas.addEventListener('mousemove', function(evt) {
    var rect = canvas.getBoundingClientRect();  // Get canvas position and dimensions
    var root = document.documentElement;  // Get root element (HTML document)

    // Calculate mouse's y-position relative to the canvas
    var mouseY = evt.clientY - rect.top - root.scrollTop;

    // Update paddle position based on mouse position
    userPaddle.y = mouseY - userPaddle.height / 2;

    // Ensure paddle doesn't leave the screen
    if (userPaddle.y < 0) {
        userPaddle.y = 0;  // Keep paddle within upper bound
    } else if (userPaddle.y + userPaddle.height > canvas.height) {
        userPaddle.y = canvas.height - userPaddle.height;  // Keep paddle within lower bound
    }
});

// Game's main function, which updates and renders the game
function game() {
    render();  // Draw all game objects on the screen
    updateBallPosition();  // Update ball's position and handle collisions
    updateComPaddle();  // Update computer's paddle based on ball's position
}

// Start the game with a framerate of 60 frames per second
let framePerSecond = 60;
let loop = setInterval(game, 1000 / framePerSecond);  // Define game's update rate
