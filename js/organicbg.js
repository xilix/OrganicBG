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

  // "clone" an object
  function cloneObj (obj) {
    var copy = {};
    if ("create" in Object) {// ECMA script 5 way
      copy = Object.create(obj);
    } else if (typeof JSON === "object") {// JSON way
      copy = (JSON.parse(JSON.stringify(obj)));
    } else {
      // If not then prototyping. Yeah i know is not exactly to clone
      // but is better than nothing
      copy.prototype = obj; 
    }
    return copy;
  }

  /**
   * Base class for partcile
   */
  OBG.bases.Particle = function (lambda) {
    var i = 0, Nbehaviours = 0 // For performance
    ,   behaviours = [];// behabiours clousures

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
        if (!behaviours[i]()) { break; };
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
    Object.defineProperty(this, "settings", {
      "value": settings,
      "writable": false,
      "enumerable": true,
      "configurable": false,
    });
    //this.settings = settings;
    
    this.mitosis = function (baseDNA, mutate) {
      var DNA = cloneObj(this.settings.DNA[baseDNA]), gen;

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
        "mitosis": this.DNA.mitosis.bind(this.DNA),
        "mutagen": this.mutagen.bind(this),
        "W": parseInt(settings.content.style.width.split("px")[0]),
        "H": parseInt(settings.content.style.height.split("px")[0]),
        "fps": settings.fps,
        "dt": 1 / settings.fps
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
      var initPos = [], Nparticles, i, gen, gens = {};
      parent.DNA = new OBG.DNA(settings);

      Nparticles = settings.instances.length;
      for (i = 0; i < Nparticles; i++) {
        gens = {};
        for (gen in settings.instances[i]) {
          gens[gen] = settings.instances[i][gen];
        }

        gens["pos"] = [];
        gens["pos"][0] = parseInt(settings.instances[i].pos.split("px ")[0]);
        gens["pos"][1] = settings.instances[i].pos.split("px ")[1];
        gens["pos"][1] = parseInt(gens["pos"][1].split("px ")[0]);

        parent.basesBuffer.add(
          parent.DNA.mitosis(settings.instances[i].DNA, parent.mutagen(gens))
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

    if (typeof behaviour.content === "string") {
      switch (behaviour.content) {
        case "viewport":
          behaviour.W = lambda.W;
          behaviour.H = lambda.H;
          behaviour.offX = 0;
          behaviour.offY = 0;

          limits = [
            [behaviour.offX, behaviour.offY]
            , [behaviour.W + behaviour.offX , behaviour.H + behaviour.offY]
          ];
          limits[1][0] -= particle.size[0];
          limits[1][1] -= particle.size[1];
          break;
      }
    } else {
      switch (behaviour.content.shape) {
        case "square":
          behaviour.W = behaviour.content.size[0];
          behaviour.H = behaviour.content.size[1];
          behaviour.offX = behaviour.content.pos[0];
          behaviour.offY = behaviour.content.pos[1];

          limits = [
            [behaviour.offX, behaviour.offY]
            , [behaviour.W + behaviour.offX, behaviour.H + behaviour.offY]
          ];
          limits[1][0] -= particle.size[0];
          limits[1][1] -= particle.size[1];
          break;
      }
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
      if (particle.pos[0] > limits[1][0]) { 
        limit.pos[0] = limits[1][0]; limit.hit[0] = true; isInside = false; 
      }
      if (particle.pos[1] > limits[1][1]) { 
        limit.pos[1] = limits[1][1]; limit.hit[1] = true; isInside = false; 
      }
      if (particle.pos[0] < limits[0][0]) { 
        limit.pos[0] = limits[0][0]; limit.hit[0] = true; isInside = false; 
      }
      if (particle.pos[1] < limits[0][1]) { 
        limit.pos[1] = limits[0][1]; limit.hit[1] = true; isInside = false; 
      }

      if (!isInside) {
        how(limit);
      }
      return true;
    });
    return particle;
  };
  OBG.assemblers["move"] = function (particle, behaviour, lambda) {
    particle.v = [0, 0];
    if (behaviour.v !== undefined) {
      particle.v[0] = behaviour.v[0];
      particle.v[1] = behaviour.v[1];
    }
    if (particle.DNA.v !== undefined) {
      particle.v[0] = particle.DNA.v[0];
      particle.v[1] = particle.DNA.v[1];
    }

    particle.addBehaviour(function (){
      particle.pos[0] += particle.v[0];
      particle.pos[1] += particle.v[1];
      return true;
    });
    return particle;
  };
  OBG.assemblers["randomMovment"] = function (particle, behaviour, lambda) {
    var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, 
        dt = lambda.dt, t = dt;
    particle.addBehaviour(function (){
      if (t < dt || Math.random() > P) {
        particle.v = [
          Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2)), 
          Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2))
        ];
      }
      if (T) { t += dt; t = t % T; }
      return true;
    });
    return particle;
  };
  OBG.assemblers["randomTeleport"] = function (particle, behaviour, lambda) {
    var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, 
        dt = lambda.dt, t = dt;
    particle.addBehaviour(function (){
      if (t < dt || Math.random() > P) {
        particle.pos = [
          Math.round(lambda.W * Math.random()), 
          Math.round(lambda.H * Math.random()) 
        ];
      }
      if (T) { t += dt; t = t % T; }
      return true;
    });
    return particle;
  };
  OBG.assemblers["brownianMovment"] = function (particle, behaviour, lambda) {
    var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, 
        dt = lambda.dt, t = dt;
    particle.addBehaviour(function(){
      if (t < dt || Math.random() > P) {
        particle.v = [
          particle.v[0] + Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2)), 
          particle.v[1] + Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2))
        ];
      }
      if (T) { t += dt; t = t % T; }
      return true;
    });
    return particle;
  };
  OBG.assemblers["randomWalker"] = function (particle, behaviour, lambda) {
    var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, 
        dt = lambda.dt, t = dt;
    particle.addBehaviour(function(){
      if (t < dt || Math.random() > P) {
        particle.pos = [
          particle.pos[0] + Math.round(behaviour.d * Math.random() * (1 - Math.random() * 2)), 
          particle.pos[1] + Math.round(behaviour.d * Math.random() * (1 - Math.random() * 2))
        ];
      }
      if (T) { t += dt; t = t % T; }
      return true;
    });
    return particle;
  };
  OBG.assemblers["clone"] = function (particle, behaviour, lambda) {
    var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, 
        dt = lambda.dt, t = dt;
    particle.addBehaviour(function(){
      if (t < dt || Math.random() > P) {
        lambda.basesBuffer.prepareKid(particle.DNA);
      }
      if (T) { t += dt; t = t % T; }
      return true;
    });
    return particle;
  };
  OBG.assemblers["eject"] = function (particle, behaviour, lambda) {
    var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, 
        dt = lambda.dt, t = dt;
    particle.addBehaviour(function(){
      if (t < dt || Math.random() > P) {
        lambda.basesBuffer.prepareKid(lambda.mitosis(
          behaviour["DNA"], 
          lambda.mutagen({
            "pos":[
              particle.pos[0] + Math.round(particle.size[0] / 2), 
              particle.pos[1] + Math.round(particle.size[1] / 2)
          ]})
        ));
      }
      if (T) { t += dt; t = t % T; }
      return true;
    });
    return particle;
  };
  OBG.assemblers["die"] = function (particle, behaviour, lambda) {
    var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, 
        dt = lambda.dt, t = dt;
    particle.addBehaviour(function(){
      if (t < dt || Math.random() > P) {
        lambda.basesBuffer.deathMark(particle.index);
      }
      if (T) { t += dt; t = t % T; }
      return true;
    });
    return particle;
  };
  OBG.assemblers["fall"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      particle.v[0] += behaviour.a[0];
      particle.v[1] += behaviour.a[1];
      return true;
    });
    return particle;
  };
  OBG.assemblers["randomFall"] = function (particle, behaviour, lambda) {
    var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, 
        dt = lambda.dt, t = dt;
    particle.addBehaviour(function(){
      if (t < dt || Math.random() > P) {
        particle.v[0] += Math.random() * behaviour.a[0] - behaviour.offset[0];
        particle.v[1] += Math.random() * behaviour.a[1] - behaviour.offset[1];
      }
      if (T) { t += dt; t = t % T; }
      return true;
    });
    return particle;
  };
  OBG.assemblers["resistance"] = function (particle, behaviour, lambda) {
    particle.addBehaviour(function(){
      particle.v[0] *= (1 - behaviour.rho[0]);
      particle.v[1] *= (1 - behaviour.rho[1]);
      return true;
    });
    return particle;
  };
  OBG.assemblers["magnet"] = function (particle, behaviour, lambda) {
    var F = [0, 0];
    if (typeof behaviour.F !== "object") {
      F = [behaviour.F, behaviour.F];
    } else {
      F = [behaviour.F[0], behaviour.F[1]];
    }
    function sign(value){
      if (value > 0) { return 1; }
      return (value < 0 ? -1 : 0);
    }

    particle.addBehaviour(function(){
      var d = [
        particle.pos[0] - behaviour.pos[0],
        particle.pos[1] - behaviour.pos[1]
      ], d2, dd = [0, 0], dv = [0, 0];

      d2 = d[0] * d[0] + d[1] * d[1]; 
      if (d2 > 1) { 
        if (d[0] < -1 || d[0] > 1) { 
          dv[0] = -(F[0] * (d[0] / Math.sqrt(d2)) / d2);
        }
        if (d[1] < -1 || d[1] > 1) { 
          dv[1] = -(F[1] * (d[1] / Math.sqrt(d2)) / d2);
        }
      } else {
        particle.v = [0, 0];
        return true;
      }

      if (
        sign(particle.pos[0] + particle.v[0] + dv[0] - behaviour.pos[0]) 
        != sign(d[0])
        && sign(particle.pos[1] + particle.v[1] + dv[1] - behaviour.pos[1]) 
        != sign(d[1])
      ) {
        particle.pos[0] = behaviour.pos[0] - d[0];
        particle.pos[1] = behaviour.pos[1] - d[1];
        return true;
      }


      particle.v[0] += dv[0];
      particle.v[1] += dv[1];
      return true;
    });
    return particle;
  };
  OBG.assemblers["atractor"] = function (particle, behaviour, lambda) {
    var F = [0, 0];
    if (typeof behaviour.F !== "object") {
      F = [behaviour.F, behaviour.F];
    } else {
      F = [behaviour.F[0], behaviour.F[1]];
    }

    particle.addBehaviour(function(){
      var d = [0, 0];
      d = [
        (particle.pos[0] - behaviour.pos[0] < 0 ? -1 : d[0]),
        (particle.pos[1] - behaviour.pos[1] < 0 ? -1 : d[1])
      ];
      d = [
        (particle.pos[0] - behaviour.pos[0] > 0 ? 1 : d[0]),
        (particle.pos[1] - behaviour.pos[1] > 0 ? 1 : d[1])
      ];
      particle.v[0] -= F[0] * d[0];
      particle.v[1] -= F[1] * d[1];
      return true;
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
  module.exports = exports = OBG;
}
