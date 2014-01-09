OrganicBG
=========

Organic BG is a javascript library to add an animated background to an HTML element. Is easy to integrate in anyweb as the animation is entirely done by adding a background image to the element. No need to add a canvas, no need to add a flash, no need svg or other extra stuff that may annoy your web design.

**How it works ?**

Organic Background add's a background-image style attribute to the target HTML. Then it animate it by moving the styles propperties like background-position to make it looks like if it's alive.

Usage
=====

```javascript
var obgAnim1 = OBG.create({
  "DNA": {
    "spaceInv1": {
      "behaviours": [
        {
          "behaviour": "move"
        },
        {
          "behaviour": "keepInside" ,
          "content": "viewport", 
          "how": "bounce"
        }, 
        {
          "behaviour": "randomMovment", 
          "P": 0.98, "v": 3
        }
      ],
      "img": {
        "src": "img/inv1.png",
        "size": ["128px", "64px"]
      }
    }
  },
  "instances": [
    {
      "pos": "50px 10px",
      "DNA": "spaceInv1"
    },
  ],
  "content": document.getElementById("exemple1"),
  "limit": {"to": 12, "reach": "dontAdd"},
  "fps": 30
});

obgAnim1.start();
```

It's benn used
===============
http://www.pixelsmil.com

Some behaviours:
===============

**Move behaviour**

Allows the particle to have any kind of movement

**Keep inside behaviour**

It keeps the particle inside an area. It requires an area to keep inside and a way to keep inside. viewport is the whole area of the background html element. bounce it tells that the particle will bounce in the edge. It may also be stop and update. update make the particle to update it's state till it fits inside the area.

**Random movment**

It randomly change the velocity of the particle. It require a probablity "P" on how often it happens. The probability it range from 0 (more probable) to 1 (sure it will happen). This proability is check every click. Also it need a maximum speed "v" which it will have the particle.

