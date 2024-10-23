//Define Functions
//Function for setting pixels
function setPixel(imageData, x, y, r, g, b, a) 
{
    index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelRequestAnimationFrame = window[vendors[x]+
          'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}())

function setArray( p )
{
  for ( i = 1; i < width - 1; i++ )
  {
    for ( j = 1; j < height - 1; j++ )
    {
        p[i][j] = Math.random() * 255 | 0;
    }
  }
}

function checkArray( p )
{  
  //Zero out change tracking array
  for ( i = 1; i < width - 1; i++ )
  {
    for ( j = 1; j < height - 1; j++ )
    {
      change[i][j] = 0;
    }
  }
  
  //Sweep array and calculate changes
  for ( i = 1; i < width - 1; i++ )
  {
    for ( j = 1; j < height - 1; j++ )
    {
      //temporary holder for value
      var thisOne = p[i][j];
      
      //positions of neighboring elements
      var i1 = i - 1;
      var i2 = i + 1;
      var j1 = j - 1;
      var j2 = j + 1;
      
      //spread to neighboring elements
      change[i1][j] += thisOne/9;
      change[i2][j] += thisOne/9;
      change[i][j1] += thisOne/9; 
      change[i][j2] += thisOne/9;
      change[i1][j1] += thisOne/9;
      change[i2][j1] += thisOne/9;
      change[i1][j2] += thisOne/9;
      change[i2][j2] += thisOne/9;
      change[i][j] -= (8/9) * thisOne;
    }
  }
  
  //Change the array
  for ( i = 1; i < width - 1; i++ )
  {
    for ( j = 1; j < height - 1; j++ )
    {
      p[i][j] += change[i][j];
    }
  }
} // end check function

//RGB eating (red eats green, green eats blue, blue eats red)
function eat()
{
   for ( i = 0; i < width; i++ )
   {
      for ( j = 0; j < height; j++ )
      {  
         var R = red[i][j] + green[i][j] - blue[i][j];
         var G = green[i][j] + blue[i][j] - red[i][j];
         var B = blue[i][j] + red[i][j] - green[i][j];
       
         if ( R >= 0 && R <= 255 )
         {
           red[i][j] = R;
         }
         
         if ( G >= 0 && G  <= 255 )
         {
           green[i][j] = G;
         }
       
         if ( B >= 0 && B <= 255 )
         {
           blue[i][j] = B;
         }
      }
   }
}

//Function for drawing to the canvas
function drawCanvas() 
{
  for (i = 1; i < width - 1; i++) 
  {
    for (j = 1; j < height - 1; j++)
    {
      //Coordinates
      x = i;
      y = j;
      
      //Color values
      r = red[i][j];
      g = green[i][j];
      b = blue[i][j];
      
      //Set pixel
      setPixel(imageData, x, y, r, g, b, 255);
     }
  }
}

function mainloop() 
{ 
  //eat
  eat();
  
  // checks the array
  checkArray( red );
  checkArray( green );
  checkArray( blue );
  
  drawCanvas( );
 
  // copy the image data back onto the canvas
  c.putImageData(imageData, 0, 0); // at coords 0,0
}

//Execute functions
//Set element
element = document.getElementById("canvas");
c = element.getContext("2d");

// read the width and height of the canvas
width = element.width;
height = element.height;

var red = new Array( width );
var green = new Array( width );
var blue = new Array( width );
var change = new Array( width );
for ( i = 0; i < width; i++ )
{
  red[i] = new Array( height );
  green[i] = new Array( height );
  blue[i] = new Array( height );
  change[i] = new Array( height );
}

// create image data
imageData = c.createImageData(width, height);

//fill with random pixels
setArray( red );
setArray( green );
setArray( blue );

// recursive animation setup
var animFrame = window.requestAnimationFrame;

function recursiveAnim() 
{
  mainloop();
  animFrame( setTimeout (recursiveAnim, 1000/30) );
};

// start the mainloop
animFrame( recursiveAnim );