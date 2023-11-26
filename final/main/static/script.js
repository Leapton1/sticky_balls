
// Object definitions
const gravity = 9.8;
const max_velocity = 5; // 5mps

function coordinates(xCoordinates, yCoordinates) {
    this.xCoordinates = xCoordinates;
    this.yCoordinates = yCoordinates;
}

function character(id, name, score, position) {
    // Object constructor
    this.id = id;
    this.name = name;
    this.score = score;
    this.position = position;

    // Object variables
    this.storedAcceleration = 0;
    this.acceleration = 0;
    this.velocity = 0;
    this.mass = 1;

    // Object methods and accessors
    // Accessors
    // Getters
    this.getID = () => this.id;
    this.getName = () => this.name;
    this.getScore = () => this.score;
    this.getPosition = () => this.position;

    // Setters
    this.setID = (id) => this.id = id;                          // int
    this.setName = (name) => this.name = name;                  // string
    this.setScore = (score) => this.score = score;              // int
    this.setPosition = (position) => this.position = position;  // coordinates

    // Methods
    // Live update method
    this.update = function()
    {
        // f = ma (force = mass * acceleration)
        // max velocity = 5m/s (for now)
        
        if (this.acceleration > 0 && this.position.xCoordinates < 600)
        {
            if (this.velocity < max_velocity) 
            {
                this.velocity += 0.1;
            }
            
            if (this.velocity > -max_velocity)
            {
                this.velocity -= 0.1;
            }

            // Acceleration needs to tend towards 0
            if (this.acceleration > 0) this.acceleration -= 0.1;
            if (this.acceleration < 0) this.acceleration += 0.1;
        }

        if (this.velocity > 0 && this.position.xCoordinates < 600)
        {
            this.setPosition(coordinates(this.xCoordinates+0.1, this.yCoordinates));
        }

        if (this.velocity < 0 && this.position.xCoordinates > 0)
        {
            this.setPosition(coordinates(this.xCoordinates-0.1, this.yCoordinates));
        }

        // debug
        console.log("Acceleration: "+this.acceleration);
        console.log("Velocity: "+this.velocity);
        console.log("Position: "+this.getPosition());

    }

    // Keyboard Input
    this.moveRight = function()
    {
        if (-gravity < this.acceleration < gravity && this.position.xCoordinates < 600)
        {
            this.acceleration += 0.1;
        }
    }
    this.moveLeft = function() {
        if (-gravity < this.acceleration < gravity && this.position.xCoordinates > 0)
        {
            this.acceleration -= 0.1;
        }
    }

};



// test code
function testCode() {
    testPlayer = new character();
    testCoordinates = new coordinates();
    testCoordinates.xCoordinates = 10;
    testCoordinates.yCoordinates = 10;

    testPlayer.setID(0);
    testPlayer.setName("John Doe");
    testPlayer.setScore(1);
    testPlayer.setPosition(testCoordinates);

    alert(
        testPlayer.getID(),
        testPlayer.getName(),
        testPlayer.getScore(),
        testPlayer.getPosition(),
    )
}



/*  Useful keycodes:
    Arrow Left: 37
    Arrow Up: 38
    Arrow Right: 39
    Arrow Down: 40
*/
const keyboard = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
};

var current_key_press = 0;

document.addEventListener('keydown', function (event) {
    switch (event.keyCode) {
        case (keyboard.left):
            current_key_press = keyboard.left;
            break;
        case (keyboard.up):
            console.log("Up!");
            break;
        case (keyboard.right):
            current_key_press = keyboard.right;
            break;
        case (keyboard.down):
            console.log("Down!");
            break;
        default:
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Ready!');

    testPlayer = new character();
    testCoordinates = new coordinates();
    testCoordinates.xCoordinates = 10;
    testCoordinates.yCoordinates = 10;

    testPlayer.setID(0);
    testPlayer.setName("John Doe");
    testPlayer.setScore(1);
    testPlayer.setPosition(testCoordinates);

    setInterval(function()
    {
        testPlayer.update();
    }, 40);
});