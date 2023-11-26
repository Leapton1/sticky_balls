var background_start = 'static/Background_start.png';
var background_middle = 'static/background_middle.png';
var background_end = 'static/background_top.png';
var end_screen = 'static/sunset_screen.png';
// var background_start = document.getElementById("img1").getElementsByTagName('img');
// var background_middle = document.getElementById("img2").getElementsByTagName('img');
// var background_end = document.getElementById("img3").getElementsByTagName('img');
// var end_screen = document.getElementById("img4").getElementsByTagName('img');

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

function Rectangle(x, y, width, height, e, mass, colour) {
    this.position = { x: x, y: y };
    this.size = { width: width, height: height };
    this.velocity = { x: 0, y: 0 };
    this.e = -e;
    this.mass = mass;
    this.colour = colour;
}

function Room(generation = room_constructor()) {
    this.index = room_track
    room_track += 1;
    this.generation = generation;
    this.destruction = function () {
        balls.splice(1, balls.length);
        rects.splice(0, rects.length);
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
var rects = [];
var balls = [];
var density = 100;


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

    // Draw rectangles
    for (var i = 0; i < rects.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = rects[i].colour;
        ctx.rect(rects[i].position.x, rects[i].position.y, rects[i].size.width, rects[i].size.height);
        ctx.fill();
        ctx.closePath();
    }

    collisionWall(balls[0]);
    collisionRect(balls[0]);
    collisionBall(balls[0]);

    if (!mouse.isDown) {
        let fx = -0.5 * drag.value * density * balls[0].area * balls[0].velocity.x * balls[0].velocity.x * (balls[0].velocity.x / Math.abs(balls[0].velocity.x));
        let fy = -0.5 * drag.value * density * balls[0].area * balls[0].velocity.y * balls[0].velocity.y * (balls[0].velocity.y / Math.abs(balls[0].velocity.y));
        fx = (isNaN(fx) ? 0 : fx);
        fy = (isNaN(fy) ? 0 : fy);
        console.log(fx);
        let ax = fx / balls[0].mass;
        let ay = (ag * gravity.value) + (fy / balls[0].mass);
        balls[0].velocity.x += ax * fps;
        balls[0].velocity.y += ay * fps;
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
    if (balls[0].position.y > 500 && current_room > 0 && current_room < room_track - 1) {
        balls[0].position.y = 50;
        rooms[current_room].destruction();
        current_room -= 1;
        rooms[current_room].generation();
    }
    density = 0;
    // Leaderboard
    if (leaderboard != null && current_room == 0) {
        ctx.fillStyle = 'black';
        ctx.font = "16px Arial";
        ctx.fillText("1:  " + JSONleaderboard[0]['name'], 370, 250) 
        ctx.fillText(" Score:  " +JSONleaderboard[0]['score'], 600, 250);
        ctx.fillText("2:  " + JSONleaderboard[1]['name'], 370, 266)
        ctx.fillText(" Score:  " +JSONleaderboard[1]['score'], 600, 266);
        ctx.fillText("3:  " + JSONleaderboard[2]['name'], 370, 282);
        ctx.fillText(" Score:  " +JSONleaderboard[2]['score'], 600, 282);
        ctx.fillText("4:  " + JSONleaderboard[3]['name'], 370, 298);
        ctx.fillText(" Score:  " +JSONleaderboard[3]['score'], 600, 298);
        ctx.fillText("5:  " + JSONleaderboard[4]['name'], 370, 314);
        ctx.fillText(" Score:  " +JSONleaderboard[4]['score'], 600, 314);
    }
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

function collisionRect(ball) {
    for (var i = 0; i < rects.length; i++) {
        if (ball.position.y + ball.radius > rects[i].position.y
            && ball.position.y - ball.radius < rects[i].position.y + rects[i].size.height
            && ball.position.x + ball.radius > rects[i].position.x
            && ball.position.x - ball.radius < rects[i].position.x + rects[i].size.width) {

            // Figure out closest side
            let dists = [Math.abs(ball.position.x - rects[i].position.x),
            Math.abs(ball.position.x - (rects[i].position.x + rects[i].size.width)),
            Math.abs(ball.position.y - rects[i].position.y),
            Math.abs(ball.position.y - (rects[i].position.y + rects[i].size.height))];

            switch (dists.indexOf(Math.min.apply(Math, dists))) {
                case 0:
                    ball.position.x = rects[i].position.x - ball.radius;
                    ball.velocity.x *= ball.e;
                    break;
                case 1:
                    ball.velocity.x *= ball.e;
                    ball.position.x = rects[i].position.x + rects[i].size.width + ball.radius;
                    break;
                case 2:
                    ball.velocity.y *= ball.e;
                    ball.position.y = rects[i].position.y - ball.radius;
                    mouse.isDown = true;
                    break;
                case 3:
                    ball.velocity.y *= ball.e;
                    ball.position.y = rects[i].position.y + rects[i].size.height + ball.radius;
                    break;
                default:
            }
        }
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
            // balls.push(new Ball(200, 500, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            // balls.push(new Ball(375, 390, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            // balls.push(new Ball(180, 310, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            // balls.push(new Ball(340, 150, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            // balls.push(new Ball(150, 55, 20, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));
            rects.push(new Rectangle(100, 500, 200, 20, 0.7, 10, '#222222'));
            rects.push(new Rectangle(600, 400, 200, 20, 0.7, 10, '#222222'));
            rects.push(new Rectangle(100, 300, 200, 20, 0.7, 10, '#222222'));
            rects.push(new Rectangle(600, 200, 200, 20, 0.7, 10, '#222222'));
            rects.push(new Rectangle(100, 100, 200, 20, 0.7, 10, '#222222'));
        })
)

// Procedural Generation Test
/* Concept:
    Divide screen vertically into 10 stacked layers
    each layer will be given 50 pixels vertically and the full horizontal width 
    to decide whether or not a platform should be placed there
    Platforms can have a width of between 50 and 250
*/
var procedural_rooms = [];
var procedural_rooms_counter = 0;

const rooms_to_generate = 1;

for (let j = 0; j < rooms_to_generate; j++) {
    var procedural_platx = []
    var procedural_platwidth = []

    for (let i = 0; i < 8; i++) {
        procedural_platx.push(Math.floor(Math.random() * 600))
        procedural_platwidth.push(Math.floor(Math.random() * 200) + 50)
    }
    procedural_rooms.push([procedural_platx, procedural_platwidth])
}

for (let j = 0; j < rooms_to_generate; j++) {
    rooms.push(
        new Room(
            function () {
                $(canvas).css("background-image", "url(" + background_middle + ")")
                for (let layer = 0; layer < 550; layer += 50) {
                    platx = procedural_rooms[current_room - 1][0][Math.floor(layer / 50)]
                    platwidth = procedural_rooms[current_room - 1][1][Math.floor(layer / 50)]
                    if (platx + platwidth > 1000) { platwidth = 0; }
                    rects.push(new Rectangle(platx, layer, platwidth, 20, 0.7, 10, '#222222'));
                }
                rects.push(new Rectangle(600 - (current_room * 50), 500, 200, 20, 0.7, 10, '#222222'));
            })
    )
}

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

rooms.push(
    new Room(
        function () {
            $(canvas).css("background-image", "url(" + background_end + ")")
            for (let layer = 0; layer < 550; layer += 50) {
                platx = procedural_platx[Math.floor(layer / 50)]
                platwidth = procedural_platwidth[Math.floor(layer / 50)]
                if (platx + platwidth > 1000) { platwidth = layer > 450 ? platwidth : 0 }
                rects.push(new Rectangle(platx, layer, platwidth, 20, 0.7, 10, '#222222'));
            }
            rects.push(new Rectangle(600, 500, 200, 20, 0.7, 10, '#222222'));
        })
)

// Final Room
let final_room = new Room(
    function () {
        $(canvas).css("background-image", "url(" + end_screen + ")");
        rects.push(new Rectangle(0, 525, 990, 25, 0.7, 10, "#e5d5ba"));
        let time = new Date().getTime();
        var score = 100000-(now - time);
        let msg = prompt("Congratulations! You beat Sticky Balls and earned "+score+" enter your name to put your score into the leaderboard.")
        sendinfo([msg, score]);
    }
)


rooms.push(final_room)

// Switch rooms when Y is above 100


// Spawn player ball
balls.push(new Ball(70, 540, 10, 0.7, 10, "rgb(" + 50 + "," + 50 + "," + 200 + ")"));

// Generate room
rooms[0].generation();

// Do other things
const xhr = new XMLHttpRequest();
var leaderboard;
var JSONleaderboard;
var now;
xhr.open('GET', '/getleaderboard');
xhr.send();
xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        leaderboard = xhr.response;
        JSONleaderboard = JSON.parse(leaderboard);
        console.log(leaderboard);
        now = new Date().getTime();
    } else {
        console.log("Error retrieving leaderboard");
    }
}
