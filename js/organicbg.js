/**
* Background animator by https://github.com/xilix
*
* this code is distributed under LGPL licence
* http://www.gnu.org/licenses/lgpl.html
* 
*/

var OBG = (function (OBG) {
  "use strict";

  var quickLaunch = null;

  function OrganicBG(settings) 
  {
    var particlesBuffer
    ,   particles
    ,   content = settings.content;

    this.animId = null;

    /**
    * Base class for partcile
    */
    function BaseParticle(inject)
    {
      var i = 0, Nbehaviours = 0 // For performance
      ,   behaviours = [];// behabiours clousures

      this.v = [0, 0];// Velocity
      this.pos = inject.pos;// Initial pos
      this.img = inject.img;
      this.DNA = inject;// for cloning
      this.size = [
        parseInt(inject.img.size[0].split("px")[0]),
        parseInt(inject.img.size[1].split("px")[0])
      ];

      this.addBehaviour = function (behaviour) {
        behaviours.push(behaviour);
        Nbehaviours += 1;
      };

      this.getBehaviours = function () { return behaviours; }

      this.update = function () { 
        for (i = 0; i < Nbehaviours; i++) {
          behaviours[i]();
        }
      };
      this.getPos = function () {
        return this.pos[0]+"px "+this.pos[1]+"px";
      };
      this.getImg = function () {
        return "url("+this.img.src+")";
      };      
      this.loop = function () {
        this.update();
      };

    }

    /**
    * Particle factory
    */
    function PaticleFactory(inject) {
      var particle, i
      ,   Nbehaviours = inject.behaviours.length
      ,   behaviour;

      particle = new BaseParticle(inject);

      for (i = 0; i < Nbehaviours; i += 1) {
        behaviour = inject.behaviours[i];
        OBG.assemblers[behaviour.behaviour](particle, behaviour, inject); 
      }

      particle.index = inject.index

      return particle;

    }

    // Particles buffer
    function ParticlesBuffer(inject) {
      this.limit = inject.to;
      this.limitReach = inject.reach;
      this.length = 0;
      this.particles = [];
      this.pregnants = [];
      this.deathMarks = [];
    }
    ParticlesBuffer.prototype.clear = function () {
      this.length = 0;
      this.paricles = [];
      this.pregnants = [];
      this.deathMarks = [];

      return this;
    };
    ParticlesBuffer.prototype.add = function (inject, now) {
      if (now === undefined || !now) {
        this.prepareKid(index); return this;
      }


      if (this.length > this.limit) {
        switch (this.limitReach) {
          case "clear":
            this.clear();
            break;
          case "dontAdd":
            break;
        }
        return null;
      }

      inject.index = this.particles.length;
      this.particles.push(new PaticleFactory(inject));  
      this.length += 1;

      return this.particles[this.length - 1];
    };
    ParticlesBuffer.prototype.prepareKid = function (index) {
      this.pregnants.push(index);
    };
    ParticlesBuffer.prototype.giveBirthToAll = function () {
      var i, N = this.pregnants.length;

      for(i = 0; i < N; i += 1) {
        this.add(this.pregnants[i], true);
      }
      this.pregnants = [];
    };
    ParticlesBuffer.prototype.deathMark = function (index) {
      this.deathMarks.push(index);
    };
    ParticlesBuffer.prototype.executeDeathMarks = function () {
      var i, N = this.deathMarks.length;

      for(i = 0; i < N; i += 1) {
        this.remove(this.deathMarks[i], true);
      }
      this.deathMarks = [];
    };
    ParticlesBuffer.prototype.remove = function (index, now) {
      var Nparticles = this.particles.length, i;

      if (now === undefined || !now) {
        this.deathMark(index); return this;
      }

      // update the particles index as the buffer have change
      for (i = index; i < Nparticles; i++ ) { 
        this.particles[i].index -= 1; 
      }
      this.particles.splice(index,1);
      this.length -= 1;

      return this;
    };
    particlesBuffer = new ParticlesBuffer(settings.limit);
    particles = particlesBuffer.particles;// beacuse performance

    function createDNA(baseDNA, mutate) {
      var DNA = settings["DNA"][baseDNA];

      DNA.W = parseInt(content.style.width.split("px")[0]);
      DNA.H = parseInt(content.style.height.split("px")[0]);
      DNA.pos = mutate.pos;

      return DNA
    }

    this.setContent = function (value) {
      content = value;
      particlesBuffer.clear();
    };

    this.loop = function () {
      var i, N
      ,   backStyle = ""
      ,   backImg = "";

      N = particles.length;
      for (i = 0; i < N; i++) {
        particles[i].loop();
        backStyle += particles[i].getPos() + ",";
        backImg   += particles[i].getImg() + ",";
      }

      particlesBuffer.executeDeathMarks();
      particlesBuffer.giveBirthToAll();
      content.style.backgroundImage = backImg.slice(0, - 1);
      content.style.backgroundPosition = backStyle.slice(0, - 1);
    }

    this.start = function () {
      var loop = this.loop, id;
      id  = setInterval(function() {
        try {
          loop();
        } catch (e) {
          this.stop();
          throw e;
        }
      }, Math.round(1000 / settings.fps));
      this.animId = id;
    }

    this.stop = function () {
      window.clearInterval(this.animId);
    }

    function __construct() {
      var initPos = [], Nparticles, i;

      Nparticles = settings.instances.length;
      for (i = 0; i < Nparticles; i++) {
        initPos = [];
        initPos[0] = parseInt(settings.instances[i].pos.split("px ")[0]);
        initPos[1] = settings.instances[i].pos.split("px ")[1];
        initPos[1] = parseInt(initPos[1].split("px ")[0]);

        particlesBuffer.add(
          createDNA(settings.instances[i]["DNA"], {"pos": initPos}), true
        );
      }

    }
    __construct();
  };

  OBG.create = function (settings) {
    return new OrganicBG(settings);
  }
  OBG.start = function (settings) {
    quickLaunch = new OrganicBG(settings);
    quickLaunch.start();

    return quickLaunch;
  };
  OBG.stop = function (settings) {
    if (quickLaunch !== null) { quickLaunch.stop(); }

    return quickLaunch;
  };

  return OBG;
})(OBG || {});

OBG = (function (OBG) {
  OBG.assemblers = [];
  /**
  * Asemble the keep inside behaviour
  */
  OBG.assemblers["keepInside"] = function (particle, behaviour, inject) {
    var limits = [999, 999], how = function () { };

    behaviour.W = inject.W;
    behaviour.H = inject.H;

    if (behaviour.content === "viewport") {
      limits = [behaviour.W, behaviour.H];
      limits[0] -= particle.size[0];
      limits[1] -= particle.size[1];
    }

    switch (behaviour.how) {
      case "stop":
        how = function (behaviour) {
          particle.pos = behaviour.pos;
          particle.v = [0, 0];
        };
        break;
      case "update":
        how = function (behaviour) {
          particle.pos = behaviour.pos;
          particle.update();
        };
      case "bounce":
        how = function (behaviour) {
          particle.pos = behaviour.pos;
          if (behaviour.hit[0]) { particle.v[0] = -particle.v[0]; }
          if (behaviour.hit[1]) { particle.v[1] = -particle.v[1]; }
        };
        break;
    }

    particle.addBehaviour(function () {
      var isInside = true, limit = {"pos": particle.pos, "hit": [false, false]};
      if (particle.pos[0] > limits[0])  { limit.pos[0] = limits[0]; limit.hit[0] = true; isInside = false; }
      if (particle.pos[1] > limits[1])  { limit.pos[1] = limits[1]; limit.hit[1] = true; isInside = false; }
      if (particle.pos[0] < 0)          { limit.pos[0] = 0;         limit.hit[0] = true; isInside = false; }
      if (particle.pos[1] < 0)          { limit.pos[1] = 0;         limit.hit[1] = true; isInside = false; }

      if (!isInside) {
        how(limit);
      }

    });
    return particle;
  };
  OBG.assemblers["move"] = function (particle, behaviour, inject) {
    particle.addBehaviour(function(){
      particle.pos[0] += particle.v[0];
      particle.pos[1] += particle.v[1];
    });
    return particle;
  };
  OBG.assemblers["randomMovment"] = function (particle, behaviour, inject) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        particle.v = [
          Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2)), 
          Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2))
        ];
      }
    });
    return particle;
  };
  OBG.assemblers["randomTeleport"] = function (particle, behaviour, inject) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        particle.pos = [
          Math.round(inject.W * Math.random()), 
          Math.round(inject.H * Math.random()) 
        ];
      }
    });
    return particle;
  };
  OBG.assemblers["brownianMovment"] = function (particle, behaviour, inject) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        particle.v = [
          particle.v[0] + Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2)), 
          particle.v[1] + Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2))
        ];
      }
    });
    return particle;
  };
  OBG.assemblers["randomWalker"] = function (particle, behaviour, inject) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        particle.pos = [
          particle.pos[0] + Math.round(behaviour.d * Math.random() * (1 - Math.random() * 2)), 
          particle.pos[1] + Math.round(behaviour.d * Math.random() * (1 - Math.random() * 2))
        ];
      }
    });
    return particle;
  };
  OBG.assemblers["clone"] = function (particle, behaviour, inject) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        particlesBuffer.prepareKid(particle.DNA);
      }
    });
    return particle;
  };
  OBG.assemblers["eject"] = function (particle, behaviour, inject) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        particlesBuffer.prepareKid(createDNA(
          behaviour["DNA"], 
          {"pos": [
            particle.pos[0] + Math.round(particle.size[0] / 3), 
            particle.pos[1] + Math.round(particle.size[1] / 3)
            ]}
        ));
      }
    });
    return particle;
  };
  OBG.assemblers["die"] = function (particle, behaviour, inject) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        particlesBuffer.deathMark(particle.index);
      }
    });
    return particle;
  };
  OBG.assemblers["dummy"] = function (particle, behaviour, inject) {

    return particle;
  };

  return OBG;
})(OBG);
