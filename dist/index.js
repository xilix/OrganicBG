exports["OBG"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! ./obg.behaviours */ \"./src/obg.behaviours.js\");\n\n\n//# sourceURL=webpack://OBG/./src/index.js?");

/***/ }),

/***/ "./src/obg.behaviours.js":
/*!*******************************!*\
  !*** ./src/obg.behaviours.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var OBG = __webpack_require__(/*! ./obg */ \"./src/obg.js\");\n\nOBG.assemblers = [];\n/**\n* Asemble the keep inside behaviour\n*/\nOBG.assemblers[\"keepInside\"] = function (particle, behaviour, lambda) {\n  var limits = [999, 999], how = function () { };\n\n  if (typeof behaviour.content === \"string\") {\n    switch (behaviour.content) {\n      case \"viewport\":\n        behaviour.W = lambda.W;\n        behaviour.H = lambda.H;\n        behaviour.offX = 0;\n        behaviour.offY = 0;\n\n        limits = [\n          [behaviour.offX, behaviour.offY]\n          , [behaviour.W + behaviour.offX , behaviour.H + behaviour.offY]\n        ];\n        limits[1][0] -= particle.size[0];\n        limits[1][1] -= particle.size[1];\n        break;\n    }\n  } else {\n    switch (behaviour.content.shape) {\n      case \"square\":\n        behaviour.W = behaviour.content.size[0];\n        behaviour.H = behaviour.content.size[1];\n        behaviour.offX = behaviour.content.pos[0];\n        behaviour.offY = behaviour.content.pos[1];\n\n        limits = [\n          [behaviour.offX, behaviour.offY]\n          , [behaviour.W + behaviour.offX, behaviour.H + behaviour.offY]\n        ];\n        limits[1][0] -= particle.size[0];\n        limits[1][1] -= particle.size[1];\n        break;\n    }\n  }\n\n  switch (behaviour.how) {\n    case \"stop\":\n      how = function (behaviour) {\n        particle.pos = behaviour.pos;\n        particle.v = [0, 0];\n      };\n      break;\n    case \"update\":\n      how = function (behaviour) {\n        particle.pos = behaviour.pos;\n        // diabled due to posible infinity inhritance. Too dangerous\n        //particle.update();\n      };\n      break;\n    case \"bounce\":\n      how = function (behaviour) {\n        particle.pos = behaviour.pos;\n        if (behaviour.hit[0]) { particle.v[0] = -particle.v[0]; }\n        if (behaviour.hit[1]) { particle.v[1] = -particle.v[1]; }\n      };\n      break;\n    case \"die\":\n      how = function (behaviour) {\n        lambda.basesBuffer.deathMark(particle.index);\n      };\n  }\n\n  particle.addBehaviour(function () {\n    var isInside = true, limit = {\"pos\": particle.pos, \"hit\": [false, false]};\n    if (particle.pos[0] > limits[1][0]) { \n      limit.pos[0] = limits[1][0]; limit.hit[0] = true; isInside = false; \n    }\n    if (particle.pos[1] > limits[1][1]) { \n      limit.pos[1] = limits[1][1]; limit.hit[1] = true; isInside = false; \n    }\n    if (particle.pos[0] < limits[0][0]) { \n      limit.pos[0] = limits[0][0]; limit.hit[0] = true; isInside = false; \n    }\n    if (particle.pos[1] < limits[0][1]) { \n      limit.pos[1] = limits[0][1]; limit.hit[1] = true; isInside = false; \n    }\n\n    if (!isInside) {\n      how(limit);\n    }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"move\"] = function (particle, behaviour, lambda) {\n  particle.v = [0, 0];\n  if (behaviour.v !== undefined) {\n    particle.v[0] = behaviour.v[0];\n    particle.v[1] = behaviour.v[1];\n  }\n  if (particle.DNA.v !== undefined) {\n    particle.v[0] = particle.DNA.v[0];\n    particle.v[1] = particle.DNA.v[1];\n  }\n\n  particle.addBehaviour(function (){\n    particle.pos[0] += particle.v[0];\n    particle.pos[1] += particle.v[1];\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"randomMovment\"] = function (particle, behaviour, lambda) {\n  var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, \n      dt = lambda.dt, t = dt;\n  particle.addBehaviour(function (){\n    if (t < dt || Math.random() > P) {\n      particle.v = [\n        Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2)), \n        Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2))\n      ];\n    }\n    if (T) { t += dt; t = t % T; }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"randomTeleport\"] = function (particle, behaviour, lambda) {\n  var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, \n      dt = lambda.dt, t = dt;\n  particle.addBehaviour(function (){\n    if (t < dt || Math.random() > P) {\n      particle.pos = [\n        Math.round(lambda.W * Math.random()), \n        Math.round(lambda.H * Math.random()) \n      ];\n    }\n    if (T) { t += dt; t = t % T; }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"brownianMovment\"] = function (particle, behaviour, lambda) {\n  var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, \n      dt = lambda.dt, t = dt;\n  particle.addBehaviour(function(){\n    if (t < dt || Math.random() > P) {\n      particle.v = [\n        particle.v[0] + Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2)), \n        particle.v[1] + Math.round(behaviour.v * Math.random() * (1 - Math.random() * 2))\n      ];\n    }\n    if (T) { t += dt; t = t % T; }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"randomWalker\"] = function (particle, behaviour, lambda) {\n  var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, \n      dt = lambda.dt, t = dt;\n  particle.addBehaviour(function(){\n    if (t < dt || Math.random() > P) {\n      particle.pos = [\n        particle.pos[0] + Math.round(behaviour.d * Math.random() * (1 - Math.random() * 2)), \n        particle.pos[1] + Math.round(behaviour.d * Math.random() * (1 - Math.random() * 2))\n      ];\n    }\n    if (T) { t += dt; t = t % T; }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"clone\"] = function (particle, behaviour, lambda) {\n  var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, \n      dt = lambda.dt, t = dt;\n  particle.addBehaviour(function(){\n    if (t < dt || Math.random() > P) {\n      lambda.basesBuffer.prepareKid(particle.DNA);\n    }\n    if (T) { t += dt; t = t % T; }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"eject\"] = function (particle, behaviour, lambda) {\n  var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, \n      dt = lambda.dt, t = dt;\n  particle.addBehaviour(function(){\n    if (t < dt || Math.random() > P) {\n      lambda.basesBuffer.prepareKid(lambda.mitosis(\n        behaviour[\"DNA\"], \n        lambda.mutagen({\n          \"pos\":[\n            particle.pos[0] + Math.round(particle.size[0] / 2), \n            particle.pos[1] + Math.round(particle.size[1] / 2)\n        ]})\n      ));\n    }\n    if (T) { t += dt; t = t % T; }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"die\"] = function (particle, behaviour, lambda) {\n  var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, \n      dt = lambda.dt, t = dt;\n  particle.addBehaviour(function(){\n    if (t < dt || Math.random() > P) {\n      lambda.basesBuffer.deathMark(particle.index);\n    }\n    if (T) { t += dt; t = t % T; }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"fall\"] = function (particle, behaviour, lambda) {\n  particle.addBehaviour(function(){\n    particle.v[0] += behaviour.a[0];\n    particle.v[1] += behaviour.a[1];\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"randomFall\"] = function (particle, behaviour, lambda) {\n  var P = (1 - behaviour.P / lambda.fps), T = behaviour.T, \n      dt = lambda.dt, t = dt;\n  particle.addBehaviour(function(){\n    if (t < dt || Math.random() > P) {\n      particle.v[0] += Math.random() * behaviour.a[0] - behaviour.offset[0];\n      particle.v[1] += Math.random() * behaviour.a[1] - behaviour.offset[1];\n    }\n    if (T) { t += dt; t = t % T; }\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"resistance\"] = function (particle, behaviour, lambda) {\n  particle.addBehaviour(function(){\n    particle.v[0] *= (1 - behaviour.rho[0]);\n    particle.v[1] *= (1 - behaviour.rho[1]);\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"magnet\"] = function (particle, behaviour, lambda) {\n  var F = [0, 0];\n  if (typeof behaviour.F !== \"object\") {\n    F = [behaviour.F, behaviour.F];\n  } else {\n    F = [behaviour.F[0], behaviour.F[1]];\n  }\n  function sign(value){\n    if (value > 0) { return 1; }\n    return (value < 0 ? -1 : 0);\n  }\n\n  particle.addBehaviour(function(){\n    var d, d2, dd, dv;\n\n    function compute() {\n      d = [\n        particle.pos[0] - behaviour.pos[0],\n        particle.pos[1] - behaviour.pos[1]\n      ];\n      dd = [0, 0]; dv = [0, 0];\n\n      d2 = d[0] * d[0] + d[1] * d[1]; \n      if (d2 > 1) { \n        if (d[0] < -1 || d[0] > 1) { \n          dv[0] = -(F[0] * (d[0] / Math.sqrt(d2)) / d2);\n        }\n        if (d[1] < -1 || d[1] > 1) { \n          dv[1] = -(F[1] * (d[1] / Math.sqrt(d2)) / d2);\n        }\n      } else {\n        particle.v = [0, 0];\n        return true;\n      }\n    }\n    compute();\n\n    if (\n      sign(particle.pos[0] + particle.v[0] + dv[0] - behaviour.pos[0]) \n      != sign(d[0])\n      && sign(particle.pos[1] + particle.v[1] + dv[1] - behaviour.pos[1]) \n      != sign(d[1])\n    ) {\n      particle.pos[0] = behaviour.pos[0] - d[0];\n      particle.pos[1] = behaviour.pos[1] - d[1];\n      compute();\n      return true;\n    }\n\n\n    particle.v[0] += dv[0];\n    particle.v[1] += dv[1];\n    return true;\n  });\n  return particle;\n};\nOBG.assemblers[\"atractor\"] = function (particle, behaviour, lambda) {\n  var F = [0, 0];\n  if (typeof behaviour.F !== \"object\") {\n    F = [behaviour.F, behaviour.F];\n  } else {\n    F = [behaviour.F[0], behaviour.F[1]];\n  }\n\n  particle.addBehaviour(function(){\n    var d = [-1, 0];\n    d = [\n      (particle.pos[0] - behaviour.pos[0] < 0 ? -1 : d[0]),\n      (particle.pos[1] - behaviour.pos[1] < 0 ? -1 : d[1])\n    ];\n    d = [\n      (particle.pos[0] - behaviour.pos[0] > 0 ? 1 : d[0]),\n      (particle.pos[1] - behaviour.pos[1] > 0 ? 1 : d[1])\n    ];\n    particle.v[0] -= F[0] * d[0];\n    particle.v[1] -= F[1] * d[1];\n    return true;\n  });\n  return particle;\n};\n\nOBG.assemblers[\"dummy\"] = function (particle, behaviour, lambda) {\n  return particle;\n};\n\nmodule.exports = OBG;\n\n\n//# sourceURL=webpack://OBG/./src/obg.behaviours.js?");

/***/ }),

/***/ "./src/obg.js":
/*!********************!*\
  !*** ./src/obg.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("var OBG = {};\nvar quickLaunch = null;\n\nOBG.bases = [];\n\n// \"clone\" an object\nfunction cloneObj (obj) {\n  var copy = {};\n  if (\"create\" in Object) {// ECMA script 5 way\n    copy = Object.create(obj);\n  } else if (typeof JSON === \"object\") {// JSON way\n    copy = (JSON.parse(JSON.stringify(obj)));\n  } else {\n    // If not then prototyping. Yeah i know is not exactly to clone\n    // but is better than nothing\n    copy.prototype = obj; \n  }\n  return copy;\n}\n\n/**\n * Base class for partcile\n */\nOBG.bases.Particle = function (lambda) {\n  var i = 0, Nbehaviours = 0 // For performance\n  ,   behaviours = [];// behabiours clousures\n\n  this.pos = lambda.pos;// Initial pos\n  this.img = lambda.img;\n  this.DNA = lambda;// for cloning\n  this.size = [\n    parseInt(lambda.img.size[0].split(\"px\")[0]),\n    parseInt(lambda.img.size[1].split(\"px\")[0])\n  ];\n\n  this.addBehaviour = function (behaviour) {\n    behaviours.push(behaviour);\n    Nbehaviours += 1;\n  };\n\n  this.getBehaviours = function () { return behaviours; };\n\n  this.update = function () { \n    var i;\n    for (i = 0; i < Nbehaviours; i++) {\n      if (!behaviours[i]()) { break; };\n    }\n  };\n  this.getPos = function () {\n    return this.pos[0]+\"px \"+this.pos[1]+\"px\";\n  };\n  this.getImg = function () {\n    return \"url(\"+this.img.src+\")\";\n  };      \n  this.loop = function () {\n    this.update();\n  };\n};\n\n/**\n* Particle factory\n*/\nOBG.PaticleFactory = function (lambda) {\n  var particle, i\n  ,   Nbehaviours = lambda.behaviours.length;\n\n  particle = new OBG.bases[lambda.base](lambda);\n\n  for (i = 0; i < Nbehaviours; i += 1) {\n    OBG.assemblers[lambda.behaviours[i].behaviour](particle, lambda.behaviours[i], lambda); \n  }\n\n  particle.index = lambda.index\n\n  return particle;\n};\n\nOBG.DNA = function (settings) {\n  Object.defineProperty(this, \"settings\", {\n    \"value\": settings,\n    \"writable\": false,\n    \"enumerable\": true,\n    \"configurable\": false,\n  });\n  //this.settings = settings;\n  \n  this.mitosis = function (baseDNA, mutate) {\n    var DNA = cloneObj(this.settings.DNA[baseDNA]), gen;\n\n    for (gen in mutate) {\n      DNA[gen] = mutate[gen];\n    }\n\n    return DNA;\n  };\n};\n\n// Bases buffer\nfunction BaseBuffer(lambda) {\n  this.limit = lambda.to;\n  this.limitReach = lambda.reach;\n  this.length = 0;\n  this.data = [];\n  this.pregnants = [];\n  this.deathMarks = [];\n}\nBaseBuffer.prototype.clear = function () {\n  this.length = 0;\n  this.paricles = [];\n  this.pregnants = [];\n  this.deathMarks = [];\n\n  return this;\n};\nBaseBuffer.prototype.add = function (lambda, now) {\n  if (now === undefined || !now) {\n    this.prepareKid(index); return this;\n  }\n\n  if (this.length > this.limit) {\n    switch (this.limitReach) {\n      case \"clear\":\n        this.clear();\n        break;\n      case \"dontAdd\":\n        break;\n    }\n    return null;\n  }\n\n  lambda.index = this.data.length;\n  lambda.basesBuffer = this;\n  this.data.push(new OBG.PaticleFactory(lambda));  \n  this.length += 1;\n\n  return this.data[this.length - 1];\n};\nBaseBuffer.prototype.prepareKid = function (index) {\n  this.pregnants.push(index);\n};\nBaseBuffer.prototype.giveBirthToAll = function () {\n  var i, N = this.pregnants.length;\n\n  for(i = 0; i < N; i += 1) {\n    this.add(this.pregnants[i], true);\n  }\n  this.pregnants = [];\n};\nBaseBuffer.prototype.deathMark = function (index) {\n  this.deathMarks.push(index);\n};\nBaseBuffer.prototype.executeDeathMarks = function () {\n  var i, N = this.deathMarks.length;\n\n  for(i = 0; i < N; i += 1) {\n    this.remove(this.deathMarks[i], true);\n  }\n  this.deathMarks = [];\n};\nBaseBuffer.prototype.remove = function (index, now) {\n  var Ndata = this.data.length, i;\n\n  if (now === undefined || !now) {\n    this.deathMark(index); return this;\n  }\n\n  // update the data index as the buffer have change\n  for (i = index; i < Ndata; i++ ) { \n    this.data[i].index -= 1; \n  }\n  this.data.splice(index,1);\n  this.length -= 1;\n\n  return this;\n};\n\n\nfunction OrganicBG(settings) \n{\n  var particles\n  ,   content = settings.content\n  ,   basesBuffer = null\n  ,   bases = null;\n\n  this.settings = settings;\n  this.animId = null;\n  this.DNA = null;\n  this.basesBuffer = new BaseBuffer(settings.limit);\n\n  basesBuffer = this.basesBuffer;\n  bases = this.basesBuffer.data;// beacuse performance\n\n  this.mutagen = function (mutate) {\n    var mutagen = {\n      \"mitosis\": this.DNA.mitosis.bind(this.DNA),\n      \"mutagen\": this.mutagen.bind(this),\n      \"W\": parseInt(settings.content.style.width.split(\"px\")[0]),\n      \"H\": parseInt(settings.content.style.height.split(\"px\")[0]),\n      \"fps\": settings.fps,\n      \"dt\": 1 / settings.fps\n    }, gen;\n\n    for (gen in mutate) {\n      mutagen[gen] = mutate[gen];\n    }\n\n    return mutagen;\n  };\n\n  // Here for perfomance\n  this.loop = function () {\n    var i, N\n    ,   backStyle = \"\"\n    ,   backImg = \"\";\n\n    N = bases.length;\n    for (i = 0; i < N; i++) {\n      bases[i].loop();\n      backStyle += bases[i].getPos() + \",\";\n      backImg   += bases[i].getImg() + \",\";\n    }\n\n    basesBuffer.executeDeathMarks();\n    basesBuffer.giveBirthToAll();\n    content.style.backgroundImage = backImg.slice(0, - 1);\n    content.style.backgroundPosition = backStyle.slice(0, - 1);\n  };\n\n  function __construct(parent) {\n    var initPos = [], Nparticles, i, gen, gens = {};\n    parent.DNA = new OBG.DNA(settings);\n\n    Nparticles = settings.instances.length;\n    for (i = 0; i < Nparticles; i++) {\n      gens = {};\n      for (gen in settings.instances[i]) {\n        gens[gen] = settings.instances[i][gen];\n      }\n\n      gens[\"pos\"] = [];\n      gens[\"pos\"][0] = parseInt(settings.instances[i].pos.split(\"px \")[0]);\n      gens[\"pos\"][1] = settings.instances[i].pos.split(\"px \")[1];\n      gens[\"pos\"][1] = parseInt(gens[\"pos\"][1].split(\"px \")[0]);\n\n      parent.basesBuffer.add(\n        parent.DNA.mitosis(settings.instances[i].DNA, parent.mutagen(gens))\n        , true\n      );\n    }\n  }\n  __construct(this);\n}\n\nOrganicBG.prototype.setContent = function (value) {\n  content = value;\n  this.basesBuffer.clear();\n};\n\nOrganicBG.prototype.start = function () {\n  var loop = this.loop, id;\n  id  = setInterval(function () {\n    try {\n      loop();\n    } catch (e) {\n      this.stop();\n      throw e;\n    }\n  }, Math.round(1000 / this.settings.fps));\n  this.animId = id;\n};\n\nOrganicBG.prototype.stop = function () {\n  window.clearInterval(this.animId);\n};\n\nOBG.create = function (settings) {\n  return new OrganicBG(settings);\n}\n\nOBG.start = function (settings) {\n  quickLaunch = new OrganicBG(settings);\n  quickLaunch.start();\n\n  return quickLaunch;\n};\n\nOBG.stop = function (settings) {\n  if (quickLaunch !== null) { quickLaunch.stop(); }\n\n  return quickLaunch;\n};\n\nmodule.exports = OBG;\n\n\n//# sourceURL=webpack://OBG/./src/obg.js?");

/***/ })

/******/ });