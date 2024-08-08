(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("ignitionTween", [], factory);
	else if(typeof exports === 'object')
		exports["ignitionTween"] = factory();
	else
		root["ignitionTween"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AuxFunctions = (function () {
    function AuxFunctions() {
    }
    AuxFunctions.numberToR = function (p_num) {
        return (p_num & 0xff0000) >> 16;
    };
    AuxFunctions.numberToG = function (p_num) {
        return (p_num & 0xff00) >> 8;
    };
    AuxFunctions.numberToB = function (p_num) {
        return (p_num & 0xff);
    };
    AuxFunctions.getObjectLength = function (p_object) {
        var totalProperties = 0;
        for (var pName in p_object)
            totalProperties++;
        return totalProperties;
    };
    AuxFunctions.concatObjects = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var finalObject = {};
        var currentObject;
        for (var i = 0; i < args.length; i++) {
            currentObject = args[i];
            for (var prop in currentObject) {
                if (currentObject[prop] == null) {
                    delete finalObject[prop];
                }
                else {
                    finalObject[prop] = currentObject[prop];
                }
            }
        }
        return finalObject;
    };
    return AuxFunctions;
}());
exports.AuxFunctions = AuxFunctions;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var TweenListObj_1 = __webpack_require__(2);
var PropertyInfoObject_1 = __webpack_require__(3);
var AuxFunctions_1 = __webpack_require__(0);
var SpecialPropertySplitter_1 = __webpack_require__(4);
var Equations_1 = __webpack_require__(5);
var SpecialProperty_1 = __webpack_require__(6);
var SpecialPropertyModifier_1 = __webpack_require__(7);
var Tweener = (function () {
    function Tweener() {
        throw new Error("Tweener is a static class and should not be instantiated.");
    }
    Tweener.addTween = function (p_scopes, p_parameters) {
        if (p_scopes === void 0) { p_scopes = null; }
        if (p_parameters === void 0) { p_parameters = null; }
        if (p_scopes === null)
            return false;
        var i, j, istr;
        var rScopes;
        if (p_scopes instanceof Array) {
            rScopes = p_scopes.concat();
        }
        else {
            rScopes = [p_scopes];
        }
        var p_obj = TweenListObj_1.TweenListObj.makePropertiesChain(p_parameters);
        if (!Tweener._inited)
            Tweener.init();
        if (!Tweener._engineExists)
            Tweener.startEngine();
        var rTime = (isNaN(p_obj.time) ? 0 : p_obj.time);
        var rDelay = (isNaN(p_obj.delay) ? 0 : p_obj.delay);
        var rProperties = [];
        var restrictedWords = {
            overwrite: true,
            time: true,
            delay: true,
            useFrames: true,
            skipUpdates: true,
            transition: true,
            transitionParams: true,
            onStart: true,
            onUpdate: true,
            onComplete: true,
            onOverwrite: true,
            onError: true,
            rounded: true,
            onStartParams: true,
            onUpdateParams: true,
            onCompleteParams: true,
            onOverwriteParams: true,
            onStartScope: true,
            onUpdateScope: true,
            onCompleteScope: true,
            onOverwriteScope: true,
            onErrorScope: true
        };
        var modifiedProperties = {};
        for (istr in p_obj) {
            if (!restrictedWords[istr]) {
                if (Tweener._specialPropertySplitterList[istr]) {
                    var splitProperties = Tweener._specialPropertySplitterList[istr].splitValues(p_obj[istr], Tweener._specialPropertySplitterList[istr].parameters);
                    for (i = 0; i < splitProperties.length; i++) {
                        if (Tweener._specialPropertySplitterList[splitProperties[i].name]) {
                            var splitProperties2 = Tweener._specialPropertySplitterList[splitProperties[i].name].splitValues(splitProperties[i].value, Tweener._specialPropertySplitterList[splitProperties[i].name].parameters);
                            for (j = 0; j < splitProperties2.length; j++) {
                                rProperties[splitProperties2[j].name] = {
                                    valueStart: undefined,
                                    valueComplete: splitProperties2[j].value,
                                    arrayIndex: splitProperties2[j].arrayIndex,
                                    isSpecialProperty: false
                                };
                            }
                        }
                        else {
                            rProperties[splitProperties[i].name] = {
                                valueStart: undefined,
                                valueComplete: splitProperties[i].value,
                                arrayIndex: splitProperties[i].arrayIndex,
                                isSpecialProperty: false
                            };
                        }
                    }
                }
                else if (Tweener._specialPropertyModifierList[istr] != undefined) {
                    var tempModifiedProperties = Tweener._specialPropertyModifierList[istr].modifyValues(p_obj[istr]);
                    for (i = 0; i < tempModifiedProperties.length; i++) {
                        modifiedProperties[tempModifiedProperties[i].name] = {
                            modifierParameters: tempModifiedProperties[i].parameters,
                            modifierFunction: Tweener._specialPropertyModifierList[istr].getValue
                        };
                    }
                }
                else {
                    rProperties[istr] = { valueStart: undefined, valueComplete: p_obj[istr] };
                }
            }
        }
        for (istr in rProperties) {
            if (Tweener._specialPropertyList[istr] != undefined) {
                rProperties[istr].isSpecialProperty = true;
            }
            else {
                if (rScopes[0][istr] == undefined) {
                    Tweener.printError("The property '" + istr + "' doesn't seem to be a normal object property of " + rScopes[0] + " or a registered special property.");
                }
            }
        }
        for (istr in modifiedProperties) {
            if (rProperties[istr] != undefined) {
                rProperties[istr].modifierParameters = modifiedProperties[istr].modifierParameters;
                rProperties[istr].modifierFunction = modifiedProperties[istr].modifierFunction;
            }
        }
        var rTransition;
        if (typeof p_obj.transition == "string") {
            var trans = p_obj.transition.toLowerCase();
            rTransition = Tweener._transitionList[trans];
        }
        else {
            rTransition = p_obj.transition;
        }
        if (!(rTransition))
            rTransition = Tweener._transitionList["easeoutexpo"];
        var nProperties;
        var nTween;
        var myT;
        for (i = 0; i < rScopes.length; i++) {
            nProperties = new Object();
            for (istr in rProperties) {
                nProperties[istr] = new PropertyInfoObject_1.PropertyInfoObj(rProperties[istr].valueStart, rProperties[istr].valueComplete, rProperties[istr].valueComplete, rProperties[istr].arrayIndex, {}, rProperties[istr].isSpecialProperty, rProperties[istr].modifierFunction, rProperties[istr].modifierParameters);
            }
            if (p_obj.useFrames == true) {
                nTween = new TweenListObj_1.TweenListObj(rScopes[i], Tweener._currentTimeFrame + (rDelay / Tweener._timeScale), Tweener._currentTimeFrame + ((rDelay + rTime) / Tweener._timeScale), true, rTransition, p_obj.transitionParams);
            }
            else {
                nTween = new TweenListObj_1.TweenListObj(rScopes[i], Tweener._currentTime + ((rDelay * 1000) / Tweener._timeScale), Tweener._currentTime + (((rDelay * 1000) + (rTime * 1000)) / Tweener._timeScale), false, rTransition, p_obj.transitionParams);
            }
            nTween.properties = nProperties;
            nTween.onStart = p_obj.onStart;
            nTween.onUpdate = p_obj.onUpdate;
            nTween.onComplete = p_obj.onComplete;
            nTween.onOverwrite = p_obj.onOverwrite;
            nTween.onError = p_obj.onError;
            nTween.onStartParams = p_obj.onStartParams;
            nTween.onUpdateParams = p_obj.onUpdateParams;
            nTween.onCompleteParams = p_obj.onCompleteParams;
            nTween.onOverwriteParams = p_obj.onOverwriteParams;
            nTween.onStartScope = p_obj.onStartScope;
            nTween.onUpdateScope = p_obj.onUpdateScope;
            nTween.onCompleteScope = p_obj.onCompleteScope;
            nTween.onOverwriteScope = p_obj.onOverwriteScope;
            nTween.onErrorScope = p_obj.onErrorScope;
            nTween.rounded = p_obj.rounded;
            nTween.skipUpdates = p_obj.skipUpdates;
            if (p_obj.overwrite == undefined ? Tweener.autoOverwrite : p_obj.overwrite)
                Tweener.removeTweensByTime(nTween.scope, nTween.properties, nTween.timeStart, nTween.timeComplete);
            Tweener._tweenList.push(nTween);
            if (rTime == 0 && rDelay == 0) {
                myT = Tweener._tweenList.length - 1;
                Tweener.updateTweenByIndex(myT);
                Tweener.removeTweenByIndex(myT);
            }
        }
        return true;
    };
    Tweener.addCaller = function (p_scopes, p_parameters) {
        if (p_scopes === void 0) { p_scopes = null; }
        if (p_parameters === void 0) { p_parameters = null; }
        if (!(p_scopes))
            return false;
        var i;
        var rScopes;
        if (p_scopes instanceof Array) {
            rScopes = p_scopes.concat();
        }
        else {
            rScopes = [p_scopes];
        }
        var p_obj = p_parameters;
        if (!Tweener._inited)
            Tweener.init();
        if (!Tweener._engineExists)
            Tweener.startEngine();
        var rTime = (isNaN(p_obj.time) ? 0 : p_obj.time);
        var rDelay = (isNaN(p_obj.delay) ? 0 : p_obj.delay);
        var rTransition;
        if (typeof p_obj.transition == "string") {
            var trans = p_obj.transition.toLowerCase();
            rTransition = Tweener._transitionList[trans];
        }
        else {
            rTransition = p_obj.transition;
        }
        if (!(rTransition))
            rTransition = Tweener._transitionList["easeoutexpo"];
        var nTween;
        var myT;
        for (i = 0; i < rScopes.length; i++) {
            if (p_obj.useFrames == true) {
                nTween = new TweenListObj_1.TweenListObj(rScopes[i], Tweener._currentTimeFrame + (rDelay / Tweener._timeScale), Tweener._currentTimeFrame + ((rDelay + rTime) / Tweener._timeScale), true, rTransition, p_obj.transitionParams);
            }
            else {
                nTween = new TweenListObj_1.TweenListObj(rScopes[i], Tweener._currentTime + ((rDelay * 1000) / Tweener._timeScale), Tweener._currentTime + (((rDelay * 1000) + (rTime * 1000)) / Tweener._timeScale), false, rTransition, p_obj.transitionParams);
            }
            nTween.properties = null;
            nTween.onStart = p_obj.onStart;
            nTween.onUpdate = p_obj.onUpdate;
            nTween.onComplete = p_obj.onComplete;
            nTween.onOverwrite = p_obj.onOverwrite;
            nTween.onStartParams = p_obj.onStartParams;
            nTween.onUpdateParams = p_obj.onUpdateParams;
            nTween.onCompleteParams = p_obj.onCompleteParams;
            nTween.onOverwriteParams = p_obj.onOverwriteParams;
            nTween.onStartScope = p_obj.onStartScope;
            nTween.onUpdateScope = p_obj.onUpdateScope;
            nTween.onCompleteScope = p_obj.onCompleteScope;
            nTween.onOverwriteScope = p_obj.onOverwriteScope;
            nTween.onErrorScope = p_obj.onErrorScope;
            nTween.isCaller = true;
            nTween.count = p_obj.count;
            nTween.waitFrames = p_obj.waitFrames;
            Tweener._tweenList.push(nTween);
            if (rTime == 0 && rDelay == 0) {
                myT = Tweener._tweenList.length - 1;
                Tweener.updateTweenByIndex(myT);
                Tweener.removeTweenByIndex(myT);
            }
        }
        return true;
    };
    Tweener.removeTweensByTime = function (p_scope, p_properties, p_timeStart, p_timeComplete) {
        var removed = false;
        var removedLocally;
        var i;
        var tl = Tweener._tweenList.length;
        var pName;
        for (i = 0; i < tl; i++) {
            if (Tweener._tweenList[i] && p_scope == Tweener._tweenList[i].scope) {
                if (p_timeComplete > Tweener._tweenList[i].timeStart && p_timeStart < Tweener._tweenList[i].timeComplete) {
                    removedLocally = false;
                    for (pName in Tweener._tweenList[i].properties) {
                        if (p_properties[pName]) {
                            if (Tweener._tweenList[i].onOverwrite) {
                                var eventScope = Tweener._tweenList[i].onOverwriteScope ? Tweener._tweenList[i].onOverwriteScope : Tweener._tweenList[i].scope;
                                try {
                                    Tweener._tweenList[i].onOverwrite.apply(eventScope, Tweener._tweenList[i].onOverwriteParams);
                                }
                                catch (e) {
                                    Tweener.handleError(Tweener._tweenList[i], e, "onOverwrite");
                                }
                            }
                            Tweener._tweenList[i].properties[pName] = undefined;
                            delete Tweener._tweenList[i].properties[pName];
                            removedLocally = true;
                            removed = true;
                        }
                    }
                    if (removedLocally) {
                        if (AuxFunctions_1.AuxFunctions.getObjectLength(Tweener._tweenList[i].properties) == 0)
                            Tweener.removeTweenByIndex(i);
                    }
                }
            }
        }
        return removed;
    };
    Tweener.removeTweens = function (p_scope) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var properties = [];
        var i;
        for (i = 0; i < args.length; i++) {
            if (typeof (args[i]) == "string" && properties.indexOf(args[i]) == -1) {
                if (Tweener._specialPropertySplitterList[args[i]]) {
                    var sps = Tweener._specialPropertySplitterList[args[i]];
                    var specialProps = sps.splitValues(p_scope, null);
                    for (var j = 0; j < specialProps.length; j++) {
                        properties.push(specialProps[j].name);
                    }
                }
                else {
                    properties.push(args[i]);
                }
            }
        }
        return Tweener.affectTweens(Tweener.removeTweenByIndex, p_scope, properties);
    };
    Tweener.removeAllTweens = function () {
        if (!(Tweener._tweenList))
            return false;
        var removed = false;
        var i;
        for (i = 0; i < Tweener._tweenList.length; i++) {
            Tweener.removeTweenByIndex(i);
            removed = true;
        }
        return removed;
    };
    Tweener.pauseTweens = function (p_scope) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var properties = new Array();
        var i;
        for (i = 0; i < args.length; i++) {
            if (typeof (args[i]) == "string" && properties.indexOf(args[i]) == -1)
                properties.push(args[i]);
        }
        return Tweener.affectTweens(Tweener.pauseTweenByIndex, p_scope, properties);
    };
    Tweener.pauseAllTweens = function () {
        if (!(Tweener._tweenList))
            return false;
        var paused = false;
        var i;
        for (i = 0; i < Tweener._tweenList.length; i++) {
            Tweener.pauseTweenByIndex(i);
            paused = true;
        }
        return paused;
    };
    Tweener.resumeTweens = function (p_scope) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var properties = new Array();
        var i;
        for (i = 0; i < args.length; i++) {
            if (typeof (args[i]) == "string" && properties.indexOf(args[i]) == -1)
                properties.push(args[i]);
        }
        return Tweener.affectTweens(Tweener.resumeTweenByIndex, p_scope, properties);
    };
    Tweener.resumeAllTweens = function () {
        if (!(Tweener._tweenList))
            return false;
        var resumed = false;
        var i;
        for (i = 0; i < Tweener._tweenList.length; i++) {
            Tweener.resumeTweenByIndex(i);
            resumed = true;
        }
        return resumed;
    };
    Tweener.affectTweens = function (p_affectFunction, p_scope, p_properties) {
        var affected = false;
        var i;
        if (!(Tweener._tweenList))
            return false;
        for (i = 0; i < Tweener._tweenList.length; i++) {
            if (Tweener._tweenList[i] && Tweener._tweenList[i].scope == p_scope) {
                if (p_properties.length == 0) {
                    p_affectFunction(i);
                    affected = true;
                }
                else {
                    var affectedProperties = new Array();
                    var j = void 0;
                    for (j = 0; j < p_properties.length; j++) {
                        if (Tweener._tweenList[i].properties[p_properties[j]]) {
                            affectedProperties.push(p_properties[j]);
                        }
                    }
                    if (affectedProperties.length > 0) {
                        var objectProperties = AuxFunctions_1.AuxFunctions.getObjectLength(Tweener._tweenList[i].properties);
                        if (objectProperties == affectedProperties.length) {
                            p_affectFunction(i);
                            affected = true;
                        }
                        else {
                            var slicedTweenIndex = Tweener.splitTweens(i, affectedProperties);
                            p_affectFunction(slicedTweenIndex);
                            affected = true;
                        }
                    }
                }
            }
        }
        return affected;
    };
    Tweener.splitTweens = function (p_tween, p_properties) {
        var originalTween = Tweener._tweenList[p_tween];
        var newTween = originalTween.clone(false);
        var i;
        var pName;
        for (i = 0; i < p_properties.length; i++) {
            pName = p_properties[i];
            if (originalTween.properties[pName]) {
                originalTween.properties[pName] = undefined;
                delete originalTween.properties[pName];
            }
        }
        var found;
        for (pName in newTween.properties) {
            found = false;
            for (i = 0; i < p_properties.length; i++) {
                if (p_properties[i] == pName) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                newTween.properties[pName] = undefined;
                delete newTween.properties[pName];
            }
        }
        Tweener._tweenList.push(newTween);
        return (Tweener._tweenList.length - 1);
    };
    Tweener.updateTweens = function () {
        if (Tweener._tweenList.length == 0)
            return false;
        var i;
        for (i = 0; i < Tweener._tweenList.length; i++) {
            if (Tweener._tweenList[i] == undefined || !Tweener._tweenList[i].isPaused) {
                if (!Tweener.updateTweenByIndex(i))
                    Tweener.removeTweenByIndex(i);
                if (Tweener._tweenList[i] == null) {
                    Tweener.removeTweenByIndex(i, true);
                    i--;
                }
            }
        }
        return true;
    };
    Tweener.removeTweenByIndex = function (i, p_finalRemoval) {
        if (p_finalRemoval === void 0) { p_finalRemoval = false; }
        Tweener._tweenList[i] = null;
        if (p_finalRemoval)
            Tweener._tweenList.splice(i, 1);
        return true;
    };
    Tweener.pauseTweenByIndex = function (p_tween) {
        var tTweening = Tweener._tweenList[p_tween];
        if (tTweening == null || tTweening.isPaused)
            return false;
        tTweening.timePaused = Tweener.getCurrentTweeningTime(tTweening);
        tTweening.isPaused = true;
        return true;
    };
    Tweener.resumeTweenByIndex = function (p_tween) {
        var tTweening = Tweener._tweenList[p_tween];
        if (tTweening == null || !tTweening.isPaused)
            return false;
        var cTime = Tweener.getCurrentTweeningTime(tTweening);
        tTweening.timeStart += cTime - tTweening.timePaused;
        tTweening.timeComplete += cTime - tTweening.timePaused;
        tTweening.timePaused = undefined;
        tTweening.isPaused = false;
        return true;
    };
    Tweener.updateTweenByIndex = function (i) {
        var tTweening = Tweener._tweenList[i];
        if (tTweening == null || !(tTweening.scope))
            return false;
        var isOver = false;
        var mustUpdate;
        var nv;
        var t;
        var b;
        var c;
        var d;
        var pName;
        var eventScope;
        var tScope;
        var cTime = Tweener.getCurrentTweeningTime(tTweening);
        var tProperty;
        if (cTime >= tTweening.timeStart) {
            tScope = tTweening.scope;
            if (tTweening.isCaller) {
                do {
                    t = ((tTweening.timeComplete - tTweening.timeStart) / tTweening.count) * (tTweening.timesCalled + 1);
                    b = tTweening.timeStart;
                    c = tTweening.timeComplete - tTweening.timeStart;
                    d = tTweening.timeComplete - tTweening.timeStart;
                    nv = tTweening.transition(t, b, c, d);
                    if (cTime >= nv) {
                        if (tTweening.onUpdate) {
                            eventScope = tTweening.onUpdateScope ? tTweening.onUpdateScope : tScope;
                            try {
                                tTweening.onUpdate.apply(eventScope, tTweening.onUpdateParams);
                            }
                            catch (e1) {
                                Tweener.handleError(tTweening, e1, "onUpdate");
                            }
                        }
                        tTweening.timesCalled++;
                        if (tTweening.timesCalled >= tTweening.count) {
                            isOver = true;
                            break;
                        }
                        if (tTweening.waitFrames)
                            break;
                    }
                } while (cTime >= nv);
            }
            else {
                mustUpdate = tTweening.skipUpdates < 1 || !tTweening.skipUpdates || tTweening.updatesSkipped >= tTweening.skipUpdates;
                if (cTime >= tTweening.timeComplete) {
                    isOver = true;
                    mustUpdate = true;
                }
                if (!tTweening.hasStarted) {
                    if (tTweening.onStart) {
                        eventScope = tTweening.onStartScope ? tTweening.onStartScope : tScope;
                        try {
                            tTweening.onStart.apply(eventScope, tTweening.onStartParams);
                        }
                        catch (e2) {
                            Tweener.handleError(tTweening, e2, "onStart");
                        }
                    }
                    var pv = void 0;
                    for (pName in tTweening.properties) {
                        if (tTweening.properties[pName].isSpecialProperty) {
                            if (Tweener._specialPropertyList[pName].preProcess) {
                                tTweening.properties[pName].valueComplete = Tweener._specialPropertyList[pName].preProcess(tScope, Tweener._specialPropertyList[pName].parameters, tTweening.properties[pName].originalValueComplete, tTweening.properties[pName].extra);
                            }
                            pv = Tweener._specialPropertyList[pName].getValue(tScope, Tweener._specialPropertyList[pName].parameters, tTweening.properties[pName].extra);
                        }
                        else {
                            pv = tScope[pName];
                        }
                        tTweening.properties[pName].valueStart = isNaN(pv) ? tTweening.properties[pName].valueComplete : pv;
                    }
                    mustUpdate = true;
                    tTweening.hasStarted = true;
                }
                if (mustUpdate) {
                    for (pName in tTweening.properties) {
                        tProperty = tTweening.properties[pName];
                        if (isOver) {
                            nv = tProperty.valueComplete;
                        }
                        else {
                            if (tProperty.hasModifier) {
                                t = cTime - tTweening.timeStart;
                                d = tTweening.timeComplete - tTweening.timeStart;
                                nv = tTweening.transition(t, 0, 1, d, tTweening.transitionParams);
                                nv = tProperty.modifierFunction(tProperty.valueStart, tProperty.valueComplete, nv, tProperty.modifierParameters);
                            }
                            else {
                                t = cTime - tTweening.timeStart;
                                b = tProperty.valueStart;
                                c = tProperty.valueComplete - tProperty.valueStart;
                                d = tTweening.timeComplete - tTweening.timeStart;
                                nv = tTweening.transition(t, b, c, d, tTweening.transitionParams);
                            }
                        }
                        if (tTweening.rounded)
                            nv = Math.round(nv);
                        if (tProperty.isSpecialProperty) {
                            Tweener._specialPropertyList[pName].setValue(tScope, nv, Tweener._specialPropertyList[pName].parameters, tTweening.properties[pName].extra);
                        }
                        else {
                            tScope[pName] = nv;
                        }
                    }
                    tTweening.updatesSkipped = 0;
                    if (tTweening.onUpdate) {
                        eventScope = tTweening.onUpdateScope ? tTweening.onUpdateScope : tScope;
                        try {
                            tTweening.onUpdate.apply(eventScope, tTweening.onUpdateParams);
                        }
                        catch (e3) {
                            Tweener.handleError(tTweening, e3, "onUpdate");
                        }
                    }
                }
                else {
                    tTweening.updatesSkipped++;
                }
            }
            if (isOver && tTweening.onComplete) {
                eventScope = tTweening.onCompleteScope ? tTweening.onCompleteScope : tScope;
                try {
                    tTweening.onComplete.apply(eventScope, tTweening.onCompleteParams);
                }
                catch (e4) {
                    Tweener.handleError(tTweening, e4, "onComplete");
                }
            }
            return (!isOver);
        }
        return (true);
    };
    Tweener.init = function () {
        var rest = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            rest[_i] = arguments[_i];
        }
        Tweener._inited = true;
        Tweener._transitionList = new Object();
        Equations_1.Equations.init();
        Tweener._specialPropertyList = new Object();
        Tweener._specialPropertyModifierList = new Object();
        Tweener._specialPropertySplitterList = new Object();
    };
    Tweener.registerTransition = function (p_name, p_function) {
        if (!Tweener._inited)
            Tweener.init();
        Tweener._transitionList[p_name] = p_function;
    };
    Tweener.registerSpecialProperty = function (p_name, p_getFunction, p_setFunction, p_parameters, p_preProcessFunction) {
        if (p_parameters === void 0) { p_parameters = null; }
        if (p_preProcessFunction === void 0) { p_preProcessFunction = null; }
        if (!Tweener._inited)
            Tweener.init();
        var sp = new SpecialProperty_1.SpecialProperty(p_getFunction, p_setFunction, p_parameters, p_preProcessFunction);
        Tweener._specialPropertyList[p_name] = sp;
    };
    Tweener.registerSpecialPropertyModifier = function (p_name, p_modifyFunction, p_getFunction) {
        if (!Tweener._inited)
            Tweener.init();
        var spm = new SpecialPropertyModifier_1.SpecialPropertyModifier(p_modifyFunction, p_getFunction);
        Tweener._specialPropertyModifierList[p_name] = spm;
    };
    Tweener.registerSpecialPropertySplitter = function (p_name, p_splitFunction, p_parameters) {
        if (p_parameters === void 0) { p_parameters = null; }
        if (!Tweener._inited)
            Tweener.init();
        var sps = new SpecialPropertySplitter_1.SpecialPropertySplitter(p_splitFunction, p_parameters);
        Tweener._specialPropertySplitterList[p_name] = sps;
    };
    Tweener.startEngine = function () {
        Tweener._engineExists = true;
        Tweener._tweenList = [];
        if (window.requestAnimationFrame == null)
            window.requestAnimationFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window["mozRequestAnimationFrame"] ||
                    window["oRequestAnimationFrame"] ||
                    window["msRequestAnimationFrame"] ||
                    function (callback, element) {
                        window.setTimeout(callback, 1000 / 60);
                    };
            })();
        window.requestAnimationFrame(Tweener.onEnterFrame);
        Tweener._currentTimeFrame = 0;
        Tweener.updateTime();
    };
    Tweener.stopEngine = function () {
        Tweener._engineExists = false;
        Tweener._tweenList = null;
        Tweener._currentTime = 0;
        Tweener._currentTimeFrame = 0;
    };
    Tweener.updateTime = function () {
        Tweener._currentTime = new Date().getTime();
    };
    Tweener.updateFrame = function () {
        Tweener._currentTimeFrame++;
    };
    Tweener.onEnterFrame = function () {
        Tweener.updateTime();
        Tweener.updateFrame();
        var hasUpdated = false;
        hasUpdated = Tweener.updateTweens();
        if (!hasUpdated) {
            Tweener.stopEngine();
        }
        else {
            requestAnimationFrame(Tweener.onEnterFrame);
        }
    };
    Tweener.setTimeScale = function (p_time) {
        var i;
        var cTime;
        if (isNaN(p_time))
            p_time = 1;
        if (p_time < 0.00001)
            p_time = 0.00001;
        if (p_time != Tweener._timeScale) {
            if (Tweener._tweenList != null) {
                for (i = 0; i < Tweener._tweenList.length; i++) {
                    cTime = Tweener.getCurrentTweeningTime(Tweener._tweenList[i]);
                    Tweener._tweenList[i].timeStart = cTime - ((cTime - Tweener._tweenList[i].timeStart) * Tweener._timeScale / p_time);
                    Tweener._tweenList[i].timeComplete = cTime - ((cTime - Tweener._tweenList[i].timeComplete) * Tweener._timeScale / p_time);
                    if (Tweener._tweenList[i].timePaused != undefined)
                        Tweener._tweenList[i].timePaused = cTime - ((cTime - Tweener._tweenList[i].timePaused) * Tweener._timeScale / p_time);
                }
            }
            Tweener._timeScale = p_time;
        }
    };
    Tweener.isTweening = function (p_scope) {
        if (!(Tweener._tweenList))
            return false;
        var i;
        for (i = 0; i < Tweener._tweenList.length; i++) {
            if (Tweener._tweenList[i] && Tweener._tweenList[i].scope == p_scope) {
                return true;
            }
        }
        return false;
    };
    Tweener.getTweens = function (p_scope) {
        if (!(Tweener._tweenList))
            return [];
        var i;
        var pName;
        var tList = new Array();
        for (i = 0; i < Tweener._tweenList.length; i++) {
            if (Tweener._tweenList[i] && Tweener._tweenList[i].scope == p_scope) {
                for (pName in Tweener._tweenList[i].properties)
                    tList.push(pName);
            }
        }
        return tList;
    };
    Tweener.getTweenCount = function (p_scope) {
        if (!(Tweener._tweenList))
            return 0;
        var i;
        var c = 0;
        for (i = 0; i < Tweener._tweenList.length; i++) {
            if (Tweener._tweenList[i] && Tweener._tweenList[i].scope == p_scope) {
                c += AuxFunctions_1.AuxFunctions.getObjectLength(Tweener._tweenList[i].properties);
            }
        }
        return c;
    };
    Tweener.handleError = function (pTweening, pError, pCallBackName) {
        if (pTweening.onError && (pTweening.onError instanceof Function)) {
            var eventScope = pTweening.onErrorScope ? pTweening.onErrorScope : pTweening.scope;
            try {
                pTweening.onError.apply(eventScope, [pTweening.scope, pError]);
            }
            catch (metaError) {
                Tweener.printError(pTweening.scope + " raised an error while executing the 'onError' handler. Original error:\n " + pError.stack + "\nonError error: " + metaError.stack);
            }
        }
        else {
            if (!(pTweening.onError)) {
                Tweener.printError(pTweening.scope + " raised an error while executing the '" + pCallBackName + "'handler. \n" + pError.stack);
            }
        }
    };
    Tweener.getCurrentTweeningTime = function (p_tweening) {
        return p_tweening.useFrames ? Tweener._currentTimeFrame : Tweener._currentTime;
    };
    Tweener.getVersion = function () {
        return "JS 0.0.1";
    };
    Tweener.printError = function (p_message) {
        console.log("## [Tweener] Error: " + p_message);
    };
    Tweener._engineExists = false;
    Tweener._inited = false;
    Tweener._timeScale = 1;
    Tweener.autoOverwrite = true;
    return Tweener;
}());
exports.Tweener = Tweener;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var AuxFunctions_1 = __webpack_require__(0);
var TweenListObj = (function () {
    function TweenListObj(p_scope, p_timeStart, p_timeComplete, p_useFrames, p_transition, p_transitionParams) {
        this.scope = p_scope;
        this.timeStart = p_timeStart;
        this.timeComplete = p_timeComplete;
        this.useFrames = p_useFrames;
        this.transition = p_transition;
        this.transitionParams = p_transitionParams;
        this.properties = new Object();
        this.isPaused = false;
        this.timePaused = undefined;
        this.isCaller = false;
        this.updatesSkipped = 0;
        this.timesCalled = 0;
        this.skipUpdates = 0;
        this.hasStarted = false;
    }
    TweenListObj.prototype.clone = function (omitEvents) {
        var nTween = new TweenListObj(this.scope, this.timeStart, this.timeComplete, this.useFrames, this.transition, this.transitionParams);
        nTween.properties = new Array();
        for (var pName in this.properties) {
            nTween.properties[pName] = this.properties[pName].clone();
        }
        nTween.skipUpdates = this.skipUpdates;
        nTween.updatesSkipped = this.updatesSkipped;
        if (!omitEvents) {
            nTween.onStart = this.onStart;
            nTween.onUpdate = this.onUpdate;
            nTween.onComplete = this.onComplete;
            nTween.onOverwrite = this.onOverwrite;
            nTween.onError = this.onError;
            nTween.onStartParams = this.onStartParams;
            nTween.onUpdateParams = this.onUpdateParams;
            nTween.onCompleteParams = this.onCompleteParams;
            nTween.onOverwriteParams = this.onOverwriteParams;
            nTween.onStartScope = this.onStartScope;
            nTween.onUpdateScope = this.onUpdateScope;
            nTween.onCompleteScope = this.onCompleteScope;
            nTween.onOverwriteScope = this.onOverwriteScope;
            nTween.onErrorScope = this.onErrorScope;
        }
        nTween.rounded = this.rounded;
        nTween.isPaused = this.isPaused;
        nTween.timePaused = this.timePaused;
        nTween.isCaller = this.isCaller;
        nTween.count = this.count;
        nTween.timesCalled = this.timesCalled;
        nTween.waitFrames = this.waitFrames;
        nTween.hasStarted = this.hasStarted;
        return nTween;
    };
    TweenListObj.prototype.toString = function () {
        var returnStr = "\n[TweenListObj ";
        returnStr += "scope:" + this.scope;
        returnStr += ", properties:";
        var isFirst = true;
        for (var i in this.properties) {
            if (!isFirst)
                returnStr += ",";
            returnStr += "[name:" + this.properties[i].name;
            returnStr += ",valueStart:" + this.properties[i].valueStart;
            returnStr += ",valueComplete:" + this.properties[i].valueComplete;
            returnStr += "]";
            isFirst = false;
        }
        returnStr += ", timeStart:" + this.timeStart;
        returnStr += ", timeComplete:" + this.timeComplete;
        returnStr += ", useFrames:" + this.useFrames;
        returnStr += ", transition:" + this.transition;
        returnStr += ", transitionParams:" + this.transitionParams;
        if (this.skipUpdates)
            returnStr += ", skipUpdates:" + this.skipUpdates;
        if (this.updatesSkipped)
            returnStr += ", updatesSkipped:" + this.updatesSkipped;
        if (this.onStart !== null)
            returnStr += ", onStart:" + this.onStart;
        if (this.onUpdate !== null)
            returnStr += ", onUpdate:" + this.onUpdate;
        if (this.onComplete !== null)
            returnStr += ", onComplete:" + this.onComplete;
        if (this.onOverwrite !== null)
            returnStr += ", onOverwrite:" + this.onOverwrite;
        if (this.onError !== null)
            returnStr += ", onError:" + this.onError;
        if (this.onStartParams)
            returnStr += ", onStartParams:" + this.onStartParams;
        if (this.onUpdateParams)
            returnStr += ", onUpdateParams:" + this.onUpdateParams;
        if (this.onCompleteParams)
            returnStr += ", onCompleteParams:" + this.onCompleteParams;
        if (this.onOverwriteParams)
            returnStr += ", onOverwriteParams:" + this.onOverwriteParams;
        if (this.onStartScope)
            returnStr += ", onStartScope:" + this.onStartScope;
        if (this.onUpdateScope)
            returnStr += ", onUpdateScope:" + this.onUpdateScope;
        if (this.onCompleteScope)
            returnStr += ", onCompleteScope:" + this.onCompleteScope;
        if (this.onOverwriteScope)
            returnStr += ", onOverwriteScope:" + this.onOverwriteScope;
        if (this.onErrorScope)
            returnStr += ", onErrorScope:" + this.onErrorScope;
        if (this.rounded)
            returnStr += ", rounded:" + this.rounded;
        if (this.isPaused)
            returnStr += ", isPaused:" + this.isPaused;
        if (this.timePaused)
            returnStr += ", timePaused:" + this.timePaused;
        if (this.isCaller)
            returnStr += ", isCaller:" + this.isCaller;
        if (this.count)
            returnStr += ", count:" + this.count;
        if (this.timesCalled)
            returnStr += ", timesCalled:" + this.timesCalled;
        if (this.waitFrames)
            returnStr += ", waitFrames:" + this.waitFrames;
        if (this.hasStarted)
            returnStr += ", hasStarted:" + this.hasStarted;
        returnStr += "]\n";
        return returnStr;
    };
    TweenListObj.makePropertiesChain = function (p_obj) {
        var baseObject = p_obj.base;
        if (baseObject) {
            var chainedObject = {};
            var chain = void 0;
            if (baseObject instanceof Array) {
                chain = [];
                for (var k = 0; k < baseObject.length; k++)
                    chain.push(baseObject[k]);
            }
            else {
                chain = [baseObject];
            }
            chain.push(p_obj);
            var currChainObj = void 0;
            var len = chain.length;
            for (var i = 0; i < len; i++) {
                if (chain[i]["base"]) {
                    currChainObj = AuxFunctions_1.AuxFunctions.concatObjects(this.makePropertiesChain(chain[i]["base"]), chain[i]);
                }
                else {
                    currChainObj = chain[i];
                }
                chainedObject = AuxFunctions_1.AuxFunctions.concatObjects(chainedObject, currChainObj);
            }
            if (chainedObject["base"]) {
                delete chainedObject["base"];
            }
            return chainedObject;
        }
        else {
            return p_obj;
        }
    };
    return TweenListObj;
}());
exports.TweenListObj = TweenListObj;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var PropertyInfoObj = (function () {
    function PropertyInfoObj(p_valueStart, p_valueComplete, p_originalValueComplete, p_arrayIndex, p_extra, p_isSpecialProperty, p_modifierFunction, p_modifierParameters) {
        this.valueStart = p_valueStart;
        this.valueComplete = p_valueComplete;
        this.originalValueComplete = p_originalValueComplete;
        this.arrayIndex = p_arrayIndex;
        this.extra = p_extra;
        this.isSpecialProperty = p_isSpecialProperty;
        this.hasModifier = (p_modifierFunction != null);
        this.modifierFunction = p_modifierFunction;
        this.modifierParameters = p_modifierParameters;
    }
    PropertyInfoObj.prototype.clone = function () {
        var nProperty = new PropertyInfoObj(this.valueStart, this.valueComplete, this.originalValueComplete, this.arrayIndex, this.extra, this.isSpecialProperty, this.modifierFunction, this.modifierParameters);
        return nProperty;
    };
    PropertyInfoObj.prototype.toString = function () {
        var returnStr = "\n[PropertyInfoObj ";
        returnStr += "valueStart:" + this.valueStart;
        returnStr += ", ";
        returnStr += "valueComplete:" + this.valueComplete;
        returnStr += ", ";
        returnStr += "originalValueComplete:" + this.originalValueComplete;
        returnStr += ", ";
        returnStr += "arrayIndex:" + this.arrayIndex;
        returnStr += ", ";
        returnStr += "extra:" + this.extra;
        returnStr += ", ";
        returnStr += "isSpecialProperty:" + this.isSpecialProperty;
        returnStr += ", ";
        returnStr += "hasModifier:" + this.hasModifier;
        returnStr += ", ";
        returnStr += "modifierFunction:" + this.modifierFunction;
        returnStr += ", ";
        returnStr += "modifierParameters:" + this.modifierParameters;
        returnStr += "]\n";
        return returnStr;
    };
    return PropertyInfoObj;
}());
exports.PropertyInfoObj = PropertyInfoObj;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SpecialPropertySplitter = (function () {
    function SpecialPropertySplitter(p_splitFunction, p_parameters) {
        this.splitValues = p_splitFunction;
        this.parameters = p_parameters;
    }
    SpecialPropertySplitter.prototype.toString = function () {
        var value = "";
        value += "[SpecialPropertySplitter ";
        value += "splitValues:" + this.splitValues;
        value += ", ";
        value += "parameters:" + this.parameters;
        value += "]";
        return value;
    };
    return SpecialPropertySplitter;
}());
exports.SpecialPropertySplitter = SpecialPropertySplitter;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Tweener_1 = __webpack_require__(1);
var Equations = (function () {
    function Equations() {
        throw new Error("Equations is a static class and should not be instantiated.");
    }
    Equations.init = function () {
        Tweener_1.Tweener.registerTransition("easenone", Equations.easeNone);
        Tweener_1.Tweener.registerTransition("linear", Equations.easeNone);
        Tweener_1.Tweener.registerTransition("easeinquad", Equations.easeInQuad);
        Tweener_1.Tweener.registerTransition("easeoutquad", Equations.easeOutQuad);
        Tweener_1.Tweener.registerTransition("easeinoutquad", Equations.easeInOutQuad);
        Tweener_1.Tweener.registerTransition("easeoutinquad", Equations.easeOutInQuad);
        Tweener_1.Tweener.registerTransition("easeincubic", Equations.easeInCubic);
        Tweener_1.Tweener.registerTransition("easeoutcubic", Equations.easeOutCubic);
        Tweener_1.Tweener.registerTransition("easeinoutcubic", Equations.easeInOutCubic);
        Tweener_1.Tweener.registerTransition("easeoutincubic", Equations.easeOutInCubic);
        Tweener_1.Tweener.registerTransition("easeinquart", Equations.easeInQuart);
        Tweener_1.Tweener.registerTransition("easeoutquart", Equations.easeOutQuart);
        Tweener_1.Tweener.registerTransition("easeinoutquart", Equations.easeInOutQuart);
        Tweener_1.Tweener.registerTransition("easeoutinquart", Equations.easeOutInQuart);
        Tweener_1.Tweener.registerTransition("easeinquint", Equations.easeInQuint);
        Tweener_1.Tweener.registerTransition("easeoutquint", Equations.easeOutQuint);
        Tweener_1.Tweener.registerTransition("easeinoutquint", Equations.easeInOutQuint);
        Tweener_1.Tweener.registerTransition("easeoutinquint", Equations.easeOutInQuint);
        Tweener_1.Tweener.registerTransition("easeinsine", Equations.easeInSine);
        Tweener_1.Tweener.registerTransition("easeoutsine", Equations.easeOutSine);
        Tweener_1.Tweener.registerTransition("easeinoutsine", Equations.easeInOutSine);
        Tweener_1.Tweener.registerTransition("easeoutinsine", Equations.easeOutInSine);
        Tweener_1.Tweener.registerTransition("easeincirc", Equations.easeInCirc);
        Tweener_1.Tweener.registerTransition("easeoutcirc", Equations.easeOutCirc);
        Tweener_1.Tweener.registerTransition("easeinoutcirc", Equations.easeInOutCirc);
        Tweener_1.Tweener.registerTransition("easeoutincirc", Equations.easeOutInCirc);
        Tweener_1.Tweener.registerTransition("easeinexpo", Equations.easeInExpo);
        Tweener_1.Tweener.registerTransition("easeoutexpo", Equations.easeOutExpo);
        Tweener_1.Tweener.registerTransition("easeinoutexpo", Equations.easeInOutExpo);
        Tweener_1.Tweener.registerTransition("easeoutinexpo", Equations.easeOutInExpo);
        Tweener_1.Tweener.registerTransition("easeinelastic", Equations.easeInElastic);
        Tweener_1.Tweener.registerTransition("easeoutelastic", Equations.easeOutElastic);
        Tweener_1.Tweener.registerTransition("easeinoutelastic", Equations.easeInOutElastic);
        Tweener_1.Tweener.registerTransition("easeoutinelastic", Equations.easeOutInElastic);
        Tweener_1.Tweener.registerTransition("easeinback", Equations.easeInBack);
        Tweener_1.Tweener.registerTransition("easeoutback", Equations.easeOutBack);
        Tweener_1.Tweener.registerTransition("easeinoutback", Equations.easeInOutBack);
        Tweener_1.Tweener.registerTransition("easeoutinback", Equations.easeOutInBack);
        Tweener_1.Tweener.registerTransition("easeinbounce", Equations.easeInBounce);
        Tweener_1.Tweener.registerTransition("easeoutbounce", Equations.easeOutBounce);
        Tweener_1.Tweener.registerTransition("easeinoutbounce", Equations.easeInOutBounce);
        Tweener_1.Tweener.registerTransition("easeoutinbounce", Equations.easeOutInBounce);
    };
    Equations.easeNone = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * t / d + b;
    };
    Equations.easeInQuad = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * (t /= d) * t + b;
    };
    Equations.easeOutQuad = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return -c * (t /= d) * (t - 2) + b;
    };
    Equations.easeInOutQuad = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if ((t /= d / 2) < 1)
            return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    };
    Equations.easeOutInQuad = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutQuad(t * 2, b, c / 2, d, p_params);
        return Equations.easeInQuad((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInCubic = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * (t /= d) * t * t + b;
    };
    Equations.easeOutCubic = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * ((t = t / d - 1) * t * t + 1) + b;
    };
    Equations.easeInOutCubic = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };
    Equations.easeOutInCubic = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutCubic(t * 2, b, c / 2, d, p_params);
        return Equations.easeInCubic((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInQuart = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * (t /= d) * t * t * t + b;
    };
    Equations.easeOutQuart = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    Equations.easeInOutQuart = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    };
    Equations.easeOutInQuart = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutQuart(t * 2, b, c / 2, d, p_params);
        return Equations.easeInQuart((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInQuint = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * (t /= d) * t * t * t * t + b;
    };
    Equations.easeOutQuint = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    };
    Equations.easeInOutQuint = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    };
    Equations.easeOutInQuint = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutQuint(t * 2, b, c / 2, d, p_params);
        return Equations.easeInQuint((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInSine = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    };
    Equations.easeOutSine = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * Math.sin(t / d * (Math.PI / 2)) + b;
    };
    Equations.easeInOutSine = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    };
    Equations.easeOutInSine = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutSine(t * 2, b, c / 2, d, p_params);
        return Equations.easeInSine((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInExpo = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
    };
    Equations.easeOutExpo = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
    };
    Equations.easeInOutExpo = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t == 0)
            return b;
        if (t == d)
            return b + c;
        if ((t /= d / 2) < 1)
            return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
        return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
    };
    Equations.easeOutInExpo = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutExpo(t * 2, b, c / 2, d, p_params);
        return Equations.easeInExpo((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInCirc = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    };
    Equations.easeOutCirc = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    };
    Equations.easeInOutCirc = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if ((t /= d / 2) < 1)
            return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    };
    Equations.easeOutInCirc = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutCirc(t * 2, b, c / 2, d, p_params);
        return Equations.easeInCirc((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInElastic = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t == 0)
            return b;
        if ((t /= d) == 1)
            return b + c;
        var p = !Boolean(p_params) || isNaN(p_params.period) ? d * .3 : p_params.period;
        var s;
        var a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
        if (!Boolean(a) || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    };
    Equations.easeOutElastic = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t == 0)
            return b;
        if ((t /= d) == 1)
            return b + c;
        var p = !Boolean(p_params) || isNaN(p_params.period) ? d * .3 : p_params.period;
        var s;
        var a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
        if (!Boolean(a) || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
    };
    Equations.easeInOutElastic = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t == 0)
            return b;
        if ((t /= d / 2) == 2)
            return b + c;
        var p = !Boolean(p_params) || isNaN(p_params.period) ? d * (.3 * 1.5) : p_params.period;
        var s;
        var a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
        if (!Boolean(a) || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        }
        else {
            s = p / (2 * Math.PI) * Math.asin(c / a);
        }
        if (t < 1)
            return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
    };
    Equations.easeOutInElastic = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutElastic(t * 2, b, c / 2, d, p_params);
        return Equations.easeInElastic((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInBack = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        var s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
        return c * (t /= d) * t * ((s + 1) * t - s) + b;
    };
    Equations.easeOutBack = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        var s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    };
    Equations.easeInOutBack = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        var s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
        if ((t /= d / 2) < 1)
            return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    };
    Equations.easeOutInBack = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutBack(t * 2, b, c / 2, d, p_params);
        return Equations.easeInBack((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    Equations.easeInBounce = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        return c - Equations.easeOutBounce(d - t, 0, c, d) + b;
    };
    Equations.easeOutBounce = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if ((t /= d) < (1 / 2.75)) {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < (2 / 2.75)) {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
        }
        else if (t < (2.5 / 2.75)) {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
        }
        else {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
        }
    };
    Equations.easeInOutBounce = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeInBounce(t * 2, 0, c, d) * .5 + b;
        else
            return Equations.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
    };
    Equations.easeOutInBounce = function (t, b, c, d, p_params) {
        if (p_params === void 0) { p_params = null; }
        if (t < d / 2)
            return Equations.easeOutBounce(t * 2, b, c / 2, d, p_params);
        return Equations.easeInBounce((t * 2) - d, b + c / 2, c / 2, d, p_params);
    };
    return Equations;
}());
exports.Equations = Equations;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SpecialProperty = (function () {
    function SpecialProperty(p_getFunction, p_setFunction, p_parameters, p_preProcessFunction) {
        if (p_parameters === void 0) { p_parameters = null; }
        if (p_preProcessFunction === void 0) { p_preProcessFunction = null; }
        this.getValue = p_getFunction;
        this.setValue = p_setFunction;
        this.parameters = p_parameters;
        this.preProcess = p_preProcessFunction;
    }
    SpecialProperty.prototype.toString = function () {
        var value = "";
        value += "[SpecialProperty ";
        value += "getValue:" + this.getValue;
        value += ", ";
        value += "setValue:" + this.setValue;
        value += ", ";
        value += "parameters:" + this.parameters;
        value += ", ";
        value += "preProcess:" + this.preProcess;
        value += "]";
        return value;
    };
    return SpecialProperty;
}());
exports.SpecialProperty = SpecialProperty;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var SpecialPropertyModifier = (function () {
    function SpecialPropertyModifier(p_modifyFunction, p_getFunction) {
        this.modifyValues = p_modifyFunction;
        this.getValue = p_getFunction;
    }
    SpecialPropertyModifier.prototype.toString = function () {
        var value = "";
        value += "[SpecialPropertyModifier ";
        value += "modifyValues:" + this.modifyValues;
        value += ", ";
        value += "getValue:" + this.getValue;
        value += "]";
        return value;
    };
    return SpecialPropertyModifier;
}());
exports.SpecialPropertyModifier = SpecialPropertyModifier;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Tweener_1 = __webpack_require__(1);
exports.Tweener = Tweener_1.Tweener;
var TweenListObj_1 = __webpack_require__(2);
exports.TweenListObj = TweenListObj_1.TweenListObj;
var PropertyInfoObject_1 = __webpack_require__(3);
exports.PropertyInfoObj = PropertyInfoObject_1.PropertyInfoObj;
var AuxFunctions_1 = __webpack_require__(0);
exports.AuxFunctions = AuxFunctions_1.AuxFunctions;
var SpecialPropertySplitter_1 = __webpack_require__(4);
exports.SpecialPropertySplitter = SpecialPropertySplitter_1.SpecialPropertySplitter;
var Equations_1 = __webpack_require__(5);
exports.Equations = Equations_1.Equations;
var SpecialProperty_1 = __webpack_require__(6);
exports.SpecialProperty = SpecialProperty_1.SpecialProperty;
var SpecialPropertyModifier_1 = __webpack_require__(7);
exports.SpecialPropertyModifier = SpecialPropertyModifier_1.SpecialPropertyModifier;


/***/ })
/******/ ]);
});
//# sourceMappingURL=ignitionTween.js.map