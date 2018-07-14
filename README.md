OrganicBG
=========

Organic BG is a javascript library to add an animated background to an HTML element. Is easy to integrate in anyweb as the animation is entirely done by adding a background image to the element. No need to add a canvas, no need to add a flash, no need svg or other extra stuff that may annoy your web design.

**How it works ?**

Organic Background add's a background-image style attribute to the target HTML. Then it animate it by moving the styles propperties like background-position to make it looks like if it's alive.

Usage
=====

```html
<!-- 
  we have a DOM element wich is static boring and arbitrary complex
  It would be awesome if it was some space invaders moving around
  in the background witouth breaking the layout
-->
<div id="header-inner" style="border: 2px #000 solid; width:1020px;height:400px; margin: auto; margin-top: 30px;background-repeat: no-repeat;">
  <h3>Wich of the following 3 texts do you prefer for a test text?</h3>
  <ol>
  <li>
    <input type="radio" name="testText" onclick="JavaScript: document.getElementById('fillme').innerHTML='Hellow World !'" /> Hello World
  </li>
  <li>
    <input type="radio" name="testText" onclick="JavaScript: document.getElementById('fillme').innerHTML='Hello World !'" /> Hello World
  </li>
  <li>
    <input type="radio" name="testText" onclick="JavaScript: document.getElementById('fillme').innerHTML='Hello World !'" /> Hello World
  </li>
  </ol>
  <br />
  <span style="padding: 20px; border: 1px solid #F03; background-color: #FFF; color: #0A3" id="fillme"></span>
</div> 

<!--
  Okey. let's get on busniess. First import the library. Actually if you
  preffer you can copy & paste the JS code from the library as is not 
  as heavy
-->
<script type="text/javascript" src="js/organicbg.js"></script>

<!--
  Now it's time to set up the animation. Here it comes the hard stuff
-->
<script language='Javascript'>
// The a background animation is created usng OBG.create()
var obgAnim1 = OBG.create({// The input parameter is a json wich defines de animation
  "DNA": {// The "DNA"'s or class that will be used to respawn the particles
    "spaceInvader": { // We define the class of a particle called sapceInvader
      "behaviours": [ // We set how the particle wil behave
        { // move behaviour it sets a velocity and the capabilty to move
          "behaviour": "move"
        },
        { // Is telling to keep the particle always inisde the limits of the
          // DOM element and in order to do this it bounce once it reach an edge
          "behaviour": "keepInside" ,
          "content": "viewport", 
          "how": "bounce"
        }, 
        {
          // It will move less than 3 pixels per loop in
          // a random direction. The speed will randomly be changed
          // throug time. The probablitiy that his happens at least
          // once in 1 second is P
          "behaviour": "randomMovment", 
          "P": 0.8, "v": 3
        }
      ],
      "img": {
        // The image and size that will be showed
        "src": "img/inv1.png",
        "size": ["128px", "64px"]
      }
      // The type of the particle. Right now there is only one
      , "base": "Particle" 
    }
  },
  // Here we say how many particles it's gonna be created
  "instances": [
    {// The instance of a space invader
      "pos": "50px 10px",
      "DNA": "spaceInvader",
      "v": [2, 1]// You can set the initial speed here. by default is 0
    },
    {// The instance of another space invader
      "pos": "150px 50px",
      "DNA": "spaceInvader"
    }
  ],
  // The DOM content where the particles will be moving in the background
  "content": document.getElementById("header-inner"),
  // Just to control the performance it tells not to have more than 12
  // particles running at the same time. To do this once reach this limit it
  // just forbid to add more particles
  "limit": {"to": 12, "reach": "dontAdd"},
  "fps": 30
});

obgAnim1.start();// here the background animation begin
</script>
<!--
  Now we have our awsome space invaders moving in the background of the
  before boring HTML element. Yeah!
-->
```


It's been used on
===============
http://www.pixelsmil.com

Some behaviours:
===============

**move**

Allows the particle to have any kind of movement

v: [numeric, numeric]
The default inital speed of all particles of this class. If later for a particular particle a diferent speed is defined in the instance then the value of the instances is taked. By default is 0


**keepInside**

It keeps the particle inside an area. It requires an area to keep inside and a way to keep inside. viewport is the whole area of the background html element. bounce it tells that the particle will bounce in the edge. It may also be stop and update. update make the particle to update it's state till it fits inside the area.

content: ["viewport" | object]
viewport is to talk about the boundry of the DOM element. The particle with fetch inside of this area.
If it's giving an object then it should have the syntaxy as follow:
<pre>
{
  // The particle will be keep inside an square are
  shape: "square",
  // Size of the square area (width and height)
  size: [numeric, numeric], 
  // Position os the square area inside the DOM element (left and top)
  pos: [numeric, numeric] 
}
</pre>
how: ["stop" | "bounce" | "die"]
  
  stop: stops the particle and put it on the closed boundry of the DOM element

  bounce: it flips the speed of the particle to bounce in the oposite direction of the closer boundry
  
  die: just make the particle to die and disaper

**randomMovment**

It randomly change the velocity of the particle. It require a probablity "P" on how often it happens. The probability it range from 0 (more probable) to 1 (sure it will happen). This proability is check every click. Also it need a maximum speed "v" which it will have the particle.

v: [numeric]
An array for the x and y direccion. Maxmium random speed in any direccion

P: [numeric]
Probability to change the direccion and the speed of the movment at least once in 1 second

**randomTeleport**

It teleports the particle in a random position inside the viewportdd

P: [numeric]
Probability to teleport in a random position inside the viewport at least once in 1 second

**brownianMovment**

Browniand movment adds a random modification to the speed of a particle.

v: [numeric]
An array for the x and y direccion. Maxmium random speed modification in any direccion

P: [numeric]
Probability to add a random movment to the direccion and the speed of the movment at least once in 1 second

**clone**

It clones the particle making apear a new particle with the same DNA as the original one and in the same position

P: [numeric]
Probability to be cloned at least once in 1 second

**eject**

Makes a new particle with a different DNA to apear in the same position of the particle which have this behaviour

DNA: ["string"]
Identifing string for the DNA to apear

P: [numeric]
Probability to eject a particle with this DNA at least once in 1 second

**die**

It kills the particle

P: [numeric]
Probability to kill the particle at least once in 1 second

**fall**

Applies a constant acceleration to the particle

a: [numeric numeric]
Array wich contains 2 numbers for the acceleration on the 2 directions.

**randomFall**

Applies a random acceleration to the particle

a: [numeric numeric]
Array wich contains 2 numbers for the maximum random acceleration on the 2 directions.

offset: [numeric numeric]
constant offset that would be applied to the random acceleration

P: [numeric]
Probability to change the direction of the acceleration at least once in 1 second

**resistance**

Applies a multipicative modification to the speed. It comes fancy to simulate air resitance.

rho: [numeric numeric]
speed resistance to every direccion (x and y). Recomendable to be between 1 and 0
