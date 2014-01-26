/**
* Background animator by https://github.com/xilix
*
* this code is distributed under LGPL licence
* http://www.gnu.org/licenses/lgpl.html
* 
*/
if (OBG === undefined) { throw "OBG not dfined. First include organicbg.js"; }

OBG = (function (OBG) {
  "use strict";

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
      var d, d2, dd, dv;

      function compute() {
        d = [
          particle.pos[0] - behaviour.pos[0],
          particle.pos[1] - behaviour.pos[1]
        ];
        dd = [0, 0]; dv = [0, 0];

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
      }
      compute();

      if (
        sign(particle.pos[0] + particle.v[0] + dv[0] - behaviour.pos[0]) 
        != sign(d[0])
        && sign(particle.pos[1] + particle.v[1] + dv[1] - behaviour.pos[1]) 
        != sign(d[1])
      ) {
        particle.pos[0] = behaviour.pos[0] - d[0];
        particle.pos[1] = behaviour.pos[1] - d[1];
        compute();
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
