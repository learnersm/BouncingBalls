// setup canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;


// function to generate random number
function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}


// Constructor function for ball
function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}


/*
adding functions

Next, we use the arc() method to trace an arc shape on the paper. Its parameters are:
The x and y position of the arc's center — we are specifying our ball's x and y properties.
The radius of our arc — we are specifying our ball's size property.
The last two parameters specify the start and end number of degrees round the circle
that the arc is drawn between. Here we specify 0 degrees, and 2 * PI, 
which is the equivalent of 360 degrees in radians 
(annoyingly, you have to specify this in radians). 
That gives us a complete circle. If you had specified only 1 * PI, you'd get a semi-circle (180 degrees).
*/

//draws the ball , at the presnt x , y of a ball
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}


//Testing

// var testBall = new Ball(50, 100, 4, 4, 'blue', 10);
// testBall.x
// testBall.size
// testBall.color
// testBall.draw()


//updates the x, y and the velocity direction of the ball.
Ball.prototype.update = function() {

  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}



//Animating the balls
var balls = [];


//initialising
while (balls.length < 25) {
  var ball = new Ball(
    random(0,width),
    random(0,height),
    random(-7,7),
    random(-7,7),
    'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
    random(10,20)
  );
  balls.push(ball);
}


//Detecting collisions
Ball.prototype.detectCollision = function() {
  for(var i = 0; i < 25; i++){
    if(this !== balls[i]){
      var delx = this.x - balls[i].x;
      var dely = this.y - balls[i].y;

      var dist = Math.sqrt(delx * delx + dely*dely);
      if(dist < this.size + balls[i].size){
        this.color = balls[i].color = 'rgb(' +random(0,255) + ',' + random(0,255) + ',' + random(0,255) + ')';
 
        //does not preserve angular momentum as such! but still, looks good!
        //Just swapping the velocity directions of the two colliding balls.
        var t1 = this.velX;
        var t2 = this.velY;
        this.velX = balls[i].velX;
        this.velY = balls[i].velY;
        balls[i].velX = t1;
        balls[i].velY = t2;
      }
    }
  }
}


//updates the display , since several frames per second is created, a smooth animation is created
function loop() {
  
  //This is required in the loop , as the previous position of the ball
  //has to be blackended out again, otherwise , it will be like rays , instead of balls!
  //the 25% opacity is the reason behind why the balls leave a small(depending on their speed)
  //behind them. Read the comment at the end of this function to understand it clearly.  
  //changing this value from 0 to 1 will make the trails shorter!
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);

  
  for (var i = 0; i < balls.length; i++) {
    balls[i].draw();
    balls[i].update();
    balls[i].detectCollision();
  }

  
  // Try commenting the below line , running the index.html
  // Then, entering this command in the console, repeatedly, to see what is actually going on. 
  requestAnimationFrame(loop);
}


loop();
//Once the program is running , try entering loop() in the console, say 5 times, do you observe something?
//The balls speed up! Do you understand why?