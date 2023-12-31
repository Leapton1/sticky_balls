const background_start = "assets/Background_start.png";
const background_middle = "assets/background_middle.png";
const background_end = "assets/background_end.png";
const end_screen = "assets/end_screen.png";

function room_destructor() {
    current_room -= 1;
}
function room_constructor() {
    current_room += 1;
}

function Ball(x, y, radius, e, mass, colour) {
    this.position = { x: x, y: y }; //m
    this.velocity = { x: 0, y: 0 }; // m/s
    this.e = -e; // has no units
    this.mass = mass; //kg
    this.radius = radius; //m
    this.colour = colour;
    this.area = (Math.PI * radius * radius) / 10000; //m^2
}

function Room(generation = room_constructor()) {
    this.index = room_track
    room_track += 1;
    this.generation = generation;
    this.destruction = function () {
        balls.splice(1, balls.length)
    }
}

var room_track = 0;
var current_room = 0;
var canvas = null;
var ctx = null;
var fps = 1 / 60; //60 FPS
var dt = fps * 1000; //ms 
var timer = false;
var Cd = 0.47;
var rho = 1.22; //kg/m^3 
var mouse = { x: 0, y: 0, isDown: false };
var ag = 9.81; //m/s^2 acceleration due to gravity on earth = 9.81 m/s^2. 
var width = 0;
var height = 0;
var balls = [];
// var density = 500;


var setup = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;

    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onmousemove = getMousePosition;
    timer = setInterval(loop, dt);
}

var mouseDown = function (e) {
    if (e.which == 1) {
        getMousePosition(e);
        var max = 255;
        var min = 20;
        var r = 75 + Math.floor(Math.random() * (max - min) - min);
        var g = 75 + Math.floor(Math.random() * (max - min) - min);
        var b = 75 + Math.floor(Math.random() * (max - min) - min);
        // balls.push(new Ball(mouse.x, mouse.y, 10, 0.7,10, "rgb(" + r + "," + g + "," + b + ")"));
    }
}

var mouseUp = function (e) {
    if (e.which == 1 && mouse.isDown) {
        mouse.isDown = false;
        h = Math.sqrt(Math.pow(balls[0].position.x - mouse.x, 2) + Math.pow(balls[0].position.y - mouse.y, 2));
        balls[0].velocity.x = -10 * ((balls[0].position.x - mouse.x) / h);
        balls[0].velocity.y = -10 * ((balls[0].position.y - mouse.y) / h);
    }
}

function getMousePosition(e) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}

function loop() {
    // Create constants
    var gravity = document.getElementById("gravity");
    var density = document.getElementById("density");
    var drag = document.getElementById("drag");

    // Clear window at the begining of every frame
    ctx.clearRect(0, 0, width, height);
    for (var i = 0; i < balls.length; i++) {


        // Rendering the ball
        ctx.beginPath();
        ctx.fillStyle = balls[i].colour;
        ctx.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        if (mouse.isDown) {
            ctx.beginPath();
            ctx.strokeStyle = "#2dbab5";
            ctx.moveTo(balls[0].position.x, balls[0].position.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
            ctx.closePath();
        }
        // Handling the ball collisions

    }
    collisionWall(balls[0]);
    collisionBall(balls[0]);

    if (!mouse.isDown) {
        //physics - calculating the aerodynamic forces to drag
        // -0.5 * Cd * A * v^2 * rho
        var fx = -0.5 * drag.value * density.value * balls[0].area * balls[0].velocity.x * balls[0].velocity.x * (balls[0].velocity.x / Math.abs(balls[0].velocity.x));
        var fy = -0.5 * drag.value * density.value * balls[0].area * balls[0].velocity.y * balls[0].velocity.y * (balls[0].velocity.y / Math.abs(balls[0].velocity.y));

        fx = (isNaN(fx) ? 0 : fx);
        fy = (isNaN(fy) ? 0 : fy);
        console.log(fx);
        //Calculating the accleration of the ball
        //F = ma or a = F/m
        var ax = fx / balls[0].mass;
        var ay = (ag * gravity.value) + (fy / balls[0].mass);

        //Calculating the ball velocity 
        balls[0].velocity.x += ax * fps;
        balls[0].velocity.y += ay * fps;

        //Calculating the position of the ball
        balls[0].position.x += balls[0].velocity.x * fps * 100;
        balls[0].position.y += balls[0].velocity.y * fps * 100;
    }

    // Switching rooms
    // Switch to next room
    if (balls[0].position.y < 10 && current_room < room_track - 1) {
        balls[0].position.y = 500;
        rooms[current_room].destruction();
        current_room += 1;
        rooms[current_room].generation();
    }
    // Switch to previous room
    if (balls[0].position.y > 500 && current_room > 0) {
        balls[0].position.y = 50;
        rooms[current_room].destruction();
        current_room -= 1;
        rooms[current_room].generation();
    }

    //Rendering Text
    ctx.fillStyle = 'green';
    ctx.font = "11pt Arial";
    ctx.fillText("Number of Balls: " + balls.length, 0, 16);
    ctx.fillText("Drag Coefficient: " + drag.value, 0, 32);
    ctx.fillText("Fluid Density: " + density.value + " kg/m^3", 0, 48);
    ctx.fillText("Acceleration due to gravity: " + gravity.value + " g", 0, 64);
    ctx.fillText("Room Width: " + width / 1000 + " m", 0, 80);
    ctx.fillText("Room Height: " + height / 1000 + " m", 0, 96);
    ctx.fillText("Mouse X: " + mouse.x, 0, 112);
    ctx.fillText("Mouse Y: " + mouse.y, 0, 128);
    ctx.fillText("Total Rooms: " + room_track, 0, 144);
    ctx.fillText("Current Room: " + (current_room + 1), 0, 160);
}

function collisionWall(ball) {
    if (ball.position.x > width - ball.radius) {
        ball.velocity.x *= ball.e;
        ball.position.x = width - ball.radius;
        // mouse.isDown = true;
    }
    if (ball.position.y > height - ball.radius) {
        ball.velocity.y *= ball.e;
        ball.position.y = height - ball.radius;
        mouse.isDown = true;
    }
    if (ball.position.x < ball.radius) {
        ball.velocity.x *= ball.e;
        ball.position.x = ball.radius;
        // mouse.isDown = true;
    }
    if (ball.position.y < ball.radius) {
        ball.velocity.y *= ball.e;
        ball.position.y = ball.radius;
        mouse.isDown = true;
    }
}

function collisionBall(b1) {
    for (var i = 0; i < balls.length; i++) {
        var b2 = balls[i];
        if (b1.position.x != b2.position.x && b1.position.y != b2.position.y) {
            //quick check for potential collisions using AABBs
            if (b1.position.x + b1.radius + b2.radius > b2.position.x
                && b1.position.x < b2.position.x + b1.radius + b2.radius
                && b1.position.y + b1.radius + b2.radius > b2.position.y
                && b1.position.y < b2.position.y + b1.radius + b2.radius) {

                //pythagoras 
                var distX = b1.position.x - b2.position.x;
                var distY = b1.position.y - b2.position.y;
                var d = Math.sqrt((distX) * (distX) + (distY) * (distY));

                //checking circle vs circle collision 
                if (d < b1.radius + b2.radius) {
                    var nx = (b2.position.x - b1.position.x) / d;
                    var ny = (b2.position.y - b1.position.y) / d;
                    var p = 2 * (b1.velocity.x * nx + b1.velocity.y * ny - b2.velocity.x * nx - b2.velocity.y * ny) / (b1.mass + b2.mass);

                    // calulating the point of collision 
                    var colPointX = ((b1.position.x * b2.radius) + (b2.position.x * b1.radius)) / (b1.radius + b2.radius);
                    var colPointY = ((b1.position.y * b2.radius) + (b2.position.y * b1.radius)) / (b1.radius + b2.radius);

                    // stopping overlap 
                    b1.position.x = colPointX + b1.radius * (b1.position.x - b2.position.x) / d;
                    b1.position.y = colPointY + b1.radius * (b1.position.y - b2.position.y) / d;
                    // b2.position.x = colPointX + b2.radius * (b2.position.x - b1.position.x) / d;
                    // b2.position.y = colPointY + b2.radius * (b2.position.y - b1.position.y) / d;

                    // updating velocity to reflect collision 
                    b1.velocity.x -= p * b1.mass * nx;
                    b1.velocity.y -= p * b1.mass * ny;
                    // b2.velocity.x += p * b2.mass * nx;
                    // b2.velocity.y += p * b2.mass * ny;
                    if (b1.position.x > b2.position.x) {
                        b1.position.x += 1;
                    } else {
                        b1.position.x -= 1;
                    }


                    if (b1.position.y > b2.position.y) {
                        b1.position.y += 1;
                    } else {
                        b1.position.y -= 1;
                    }

                    mouse.isDown = true;

                }
            }
        }
    }
}


var rooms = [];

// Room 0
rooms.push(
    new Room(
        function () {
            $(canvas).css("background-image", "url(" + background_start + ")")
            balls.push(new Ball(200, 500, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            balls.push(new Ball(375, 390, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            balls.push(new Ball(180, 310, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            balls.push(new Ball(340, 150, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            balls.push(new Ball(150, 55, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
        })
)

// Room 1
rooms.push(
    new Room(
        function () {
            $(canvas).css("background-image", "url(" + background_middle + ")")
            balls.push(new Ball(200, 482, 10, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(459, 393, 15, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(86, 349, 5, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(405, 253, 5, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(203, 335, 5, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(559, 416, 12, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(315, 226, 12, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(830, 117, 25, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(664, 280, 16, 0.7, 10, '#2f57c4'));
            balls.push(new Ball(132, 92, 16, 0.7, 10, '#2f57c4'));
        })
)

// Room 2
rooms.push(
    new Room(
        function () {
            $(canvas).css("background-image", "url(" + background_middle + ")")
            balls.push(new Ball(400, 200, 10, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
        })
)

// Room 3
rooms.push(
    new Room(
        function () {
            $(canvas).css("background-image", "url(" + background_middle + ")")
            balls.push(new Ball(700, 420, 10, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
        })
)

// Penultimate Room
rooms.push(
    new Room(
        function () {
            $(canvas).css("background-image", "url(" + background_end + ")")
            balls.push(new Ball(290, 210, 10, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
        })
)

// Final Room
let final_room = new Room(
    function () {
        $(canvas).css("background-image", "url(" + end_screen + ")");
        balls.push(new Ball(350, 400, 10, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));

    }
)


rooms.push(final_room)

// Switch rooms when Y is above 100


// Spawn player ball
balls.push(new Ball(70, 540, 10, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));

// Generate room
rooms[0].generation();