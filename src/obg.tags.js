/**
* Background animator by https://github.com/xilix
*
* this code is distributed under LGPL licence
* http://www.gnu.org/licenses/lgpl.html
* 
*/
if (OBG === undefined) { throw "OBG not dfined. First include organicbg.js"; }

if (PXE === undefined) {
  // Reciclem de la llibreria Pixel Eater que un dia haure de pnejar al github
  var PXE = (function (PXE) {
    "use strict";
  
    /** Parametre per defecte */
    PXE.def = function (opt, def) {
      if (typeof opt !== "undefined") {
        return opt;
      } else {
        return def;
      }
    };

    /*
     * @Classe Iterators Permet la utilització i iteració d'arrays
     *           amb javascript de manera eficient i rápida
     *           sense tenir que recorre a forEach o for
     *           (ind in arr). Here we use the Iterator
     *           pattern not to abstract the content but
     *           for performance as in javascript the array
     *           random access is much more faster when the
     *           index is an integer rather than a string.
     *           See PXE.Layers to undertand better why.
     */
    PXE.IteratorCell = function (prev, next, d) {
      this.prev = PXE.def(prev, null);
      this.next = PXE.def(next, null);
      this.d = PXE.def(d, []);
    };
   
    PXE.Iterator = function () {
      this.first = null;
      this.content = {};
      
      this.add = function (ind, elem) {
        if (this.content[ind] === undefined) {
          this.content[ind] = new PXE.IteratorCell(
            null, this.first, elem
          );
          if (this.first !== null) {
            this.content[this.first].prev = ind;
          }
          this.first = ind;
        } else {
          if (elem !== undefined) {
            this.content[ind].d = elem;
          }
        }
      };

      this.remove = function (ind) {
        if (this.content[ind] === undefined) { return false; }
        if (this.content[ind].next !== null) {
          this.content[this.content[ind].next].prev = 
            this.content[ind].prev;
        }
        if (this.content[ind].prev !== null){
          this.content[this.content[ind].prev].next = 
            this.content[ind].next;
        }
        if (this.first === ind) {
          this.first = this.content[ind].next;
        }
        delete this.content[ind];
      };
    };

    /**
     * @class Els Gestion un sistema de id's únic per
     *    tots una colecció d'elements
     *
     * @property {int} length número d'elements carregats al motor.
     * @property {array} data array associatiu amb els elemetns carregats al motor i indexats per un id únic.
     *
     */
    PXE.Identifier = function () {
      this.length = 0;
      this.idCount = 0;
      this.data = new PXE.Iterator();
      this.semaforo = false;
      this.dataLliures = [];

      this.id = null;// per una millor interface
    };
  
    /** Genera un id únic per l'element */
    PXE.Identifier.prototype.genId = function (index) {
      return "id_" + index + "_" + Math.floor(Math.random() * 99999);
    }
    
    PXE.Identifier.prototype.register = function (El) {
      var id = null,prev = this.dataLliures.length - 1;

      if(this.semaforo) { console.log("bloquejat"); return this; }
      this.semaforo = true;

      if (El.id !== undefined && this.data[El.id] !== undefined) {
        this.semaforo = false;
        console.log("Element " + El.id + " already exists :" + El.toString());
        return this;
      }

      if (prev >= 0) {
        id = this.dataLliures[prev];
        this.dataLliures.pop();
      } else {
        id = this.genId(this.idCount);
      }

      El.id = id;
      this.data.add(id, El);
      this.length += 1;
      this.idCount += 1;
      this.id = idEl;

      this.semaforo = false;

      return this;
    };
 
    PXE.Identifier.prototype.leave = function (idEl) {
      if (this.exist(idEl)) {
        this.data.remove(idEl);
        this.length -= 1;
        this.dataLliures.push(idEl);
      }

      return this;
    };
    
    PXE.Identifier.prototype.get = function (idEl) {
      return this.data[idEl].d;
    };
    
    PXE.Els.prototype.exist = function (idEl) {
      return (this.data[idEl] !== undefined);
    };

    return PXE;
  })({});

}

OBG = (function (OBG) {
  "use strict";

  OBG.instancesHash = new PXE.Iterator();

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

  return OBG;
})(OBG);


// Support CommonJS require()
if (typeof module !== "undefined" && ('exports' in module)) { 
  module.exports = exports = OBG;
}
