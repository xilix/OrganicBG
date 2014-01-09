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

  OBG.bases = [];

  /**
   * Base class for partcile
   */
  OBG.bases.Particle = function (lambda) {
    var i = 0, Nbehaviours = 0 // For performance
    ,   behaviours = [];// behabiours clousures

    this.v = [0, 0];// Velocity
    this.pos = lambda.pos;// Initial pos
    this.img = lambda.img;
    this.DNA = lambda;// for cloning
    this.size = [
      parseInt(lambda.img.size[0].split("px")[0]),
      parseInt(lambda.img.size[1].split("px")[0])
    ];

    this.addBehaviour = function (behaviour) {
      behaviours.push(behaviour);
      Nbehaviours += 1;
    };

    this.getBehaviours = function () { return behaviours; };

    this.update = function () { 
      var i;
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
  };

  /**
  * Particle factory
  */
  OBG.PaticleFactory = function (lambda) {
    var particle, i
    ,   Nbehaviours = lambda.behaviours.length;

    particle = new OBG.bases[lambda.base](lambda);

    for (i = 0; i < Nbehaviours; i += 1) {
      OBG.assemblers[lambda.behaviours[i].behaviour](particle, lambda.behaviours[i], lambda); 
    }

    particle.index = lambda.index

    return particle;
  };

  OBG.DNA = function (settings) {
    this.settings = settings;

    this.create = function (baseDNA, mutate) {
      var DNA = this.settings.DNA[baseDNA], gen;

      for (gen in mutate) {
        DNA[gen] = mutate[gen];
      }

      return DNA;
    };
  };

  // Bases buffer
  function BaseBuffer(lambda) {
    this.limit = lambda.to;
    this.limitReach = lambda.reach;
    this.length = 0;
    this.data = [];
    this.pregnants = [];
    this.deathMarks = [];
  }
  BaseBuffer.prototype.clear = function () {
    this.length = 0;
    this.paricles = [];
    this.pregnants = [];
    this.deathMarks = [];

    return this;
  };
  BaseBuffer.prototype.add = function (lambda, now) {
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

    lambda.index = this.data.length;
    lambda.basesBuffer = this;
    this.data.push(new OBG.PaticleFactory(lambda));  
    this.length += 1;

    return this.data[this.length - 1];
  };
  BaseBuffer.prototype.prepareKid = function (index) {
    this.pregnants.push(index);
  };
  BaseBuffer.prototype.giveBirthToAll = function () {
    var i, N = this.pregnants.length;

    for(i = 0; i < N; i += 1) {
      this.add(this.pregnants[i], true);
    }
    this.pregnants = [];
  };
  BaseBuffer.prototype.deathMark = function (index) {
    this.deathMarks.push(index);
  };
  BaseBuffer.prototype.executeDeathMarks = function () {
    var i, N = this.deathMarks.length;

    for(i = 0; i < N; i += 1) {
      this.remove(this.deathMarks[i], true);
    }
    this.deathMarks = [];
  };
  BaseBuffer.prototype.remove = function (index, now) {
    var Ndata = this.data.length, i;

    if (now === undefined || !now) {
      this.deathMark(index); return this;
    }

    // update the data index as the buffer have change
    for (i = index; i < Ndata; i++ ) { 
      this.data[i].index -= 1; 
    }
    this.data.splice(index,1);
    this.length -= 1;

    return this;
  };


  function OrganicBG(settings) 
  {
    var particles
    ,   content = settings.content
    ,   basesBuffer = null
    ,   bases = null;

    this.settings = settings;
    this.animId = null;
    this.DNA = null;
    this.basesBuffer = new BaseBuffer(settings.limit);

    basesBuffer = this.basesBuffer;
    bases = this.basesBuffer.data;// beacuse performance

    this.mutagen = function (mutate) {
      var mutagen = {
        "DNA": this.DNA,
        "mutagen": this.mutagen,
        "W": parseInt(settings.content.style.width.split("px")[0]),
        "H": parseInt(settings.content.style.height.split("px")[0])
      }, gen;

      for (gen in mutate) {
        mutagen[gen] = mutate[gen];
      }
      return mutagen;
    };

    // Here for perfomance
    this.loop = function () {
      var i, N
      ,   backStyle = ""
      ,   backImg = "";

      N = bases.length;
      for (i = 0; i < N; i++) {
        bases[i].loop();
        backStyle += bases[i].getPos() + ",";
        backImg   += bases[i].getImg() + ",";
      }

      basesBuffer.executeDeathMarks();
      basesBuffer.giveBirthToAll();
      content.style.backgroundImage = backImg.slice(0, - 1);
      content.style.backgroundPosition = backStyle.slice(0, - 1);
    };

    function __construct(parent) {
      var initPos = [], Nparticles, i;
      parent.DNA = new OBG.DNA(settings);

      Nparticles = settings.instances.length;
      for (i = 0; i < Nparticles; i++) {
        initPos = [];
        initPos[0] = parseInt(settings.instances[i].pos.split("px ")[0]);
        initPos[1] = settings.instances[i].pos.split("px ")[1];
        initPos[1] = parseInt(initPos[1].split("px ")[0]);

        parent.basesBuffer.add(
          parent.DNA.create(
            settings.instances[i].DNA 
            , parent.mutagen({"pos": initPos})
          )
          , true
        );
      }
    }
    __construct(this);

  }

  OrganicBG.prototype.setContent = function (value) {
    content = value;
    this.basesBuffer.clear();
  };


  OrganicBG.prototype.start = function () {
    var loop = this.loop, id;
    id  = setInterval(function () {
      try {
        loop();
      } catch (e) {
        this.stop();
        throw e;
      }
    }, Math.round(1000 / this.settings.fps));
    this.animId = id;
  };

  OrganicBG.prototype.stop = function () {
    window.clearInterval(this.animId);
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
  OBG.assemblers["keepInside"] = function (particle, behaviour, lambda) {
    var limits = [999, 999], how = function () { };

    behaviour.W = lambda.W;
    behaviour.H = lambda.H;

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
          // diabled due to posible infinity inhritance. Too dangerous
          //particle.update();
        };
        break;
      case "bounce":
        how = function (behaviour) {
          particle.pos = behaviour.pos;
          if (behaviour.hit[0]) { particle.v[0] = -particle.v[0]; }
          if (behaviour.hit[1]) { particle.v[1] = -particle.v[1]; }
        };
        break;
      case "die":
        how = function (behaviour) {
          lambda.basesBuffer.deathMark(particle.index);
        };
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
  OBG.assemblers["move"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function (){
      particle.pos[0] += particle.v[0];
      particle.pos[1] += particle.v[1];
    });
    return particle;
  };
  OBG.assemblers["randomMovment"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function (){
      if (Math.random() > behaviour.P) {
        particle.v = [
          Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2)), 
          Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2))
        ];
      }
    });
    return particle;
  };
  OBG.assemblers["randomTeleport"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function (){
      if (Math.random() > behaviour.P) {
        particle.pos = [
          Math.round(lambda.W * Math.random()), 
          Math.round(lambda.H * Math.random()) 
        ];
      }
    });
    return particle;
  };
  OBG.assemblers["brownianMovment"] = function (particle, behaviour, lambda) {
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
  OBG.assemblers["randomWalker"] = function (particle, behaviour, lambda) {
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
  OBG.assemblers["clone"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        lambda.basesBuffer.prepareKid(particle.DNA);
      }
    });
    return particle;
  };
  OBG.assemblers["eject"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        lambda.basesBuffer.prepareKid(lambda.DNA.create(
          behaviour["DNA"], 
          lambda.mutagen({
            "pos":[
              particle.pos[0] + Math.round(particle.size[0] / 2), 
              particle.pos[1] + Math.round(particle.size[1] / 2)
          ]})
        ));
      }
    });
    return particle;
  };
  OBG.assemblers["die"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      if (Math.random() > behaviour.P) {
        lambda.basesBuffer.deathMark(particle.index);
      }
    });
    return particle;
  };
  OBG.assemblers["fall"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      particle.v[0] += behaviour.a[0];
      particle.v[1] += behaviour.a[1];
    });
    return particle;
  };
  OBG.assemblers["randomFall"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      particle.v[0] += Math.random() * behaviour.a[0] - behaviour.offset[0];
      particle.v[1] += Math.random() * behaviour.a[1] - behaviour.offset[1];
    });
    return particle;
  };
  OBG.assemblers["resistance"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      particle.v[0] *= (1 - behaviour.rho[0]);
      particle.v[1] *= (1 - behaviour.rho[1]);
    });
    return particle;
  };
  OBG.assemblers["friction"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      particle.v[0] *= behaviour.rho[1];
      particle.v[1] *= behaviour.rho[0];
    });
    return particle;
  };
 
  OBG.assemblers["dummy"] = function (particle, behaviour, lambda) {

    return particle;
  };

  return OBG;
})(OBG);


// Support CommonJS require()
if (typeof module !== "undefined" && ('exports' in module)) { 
  module.exports = OBG;
}
