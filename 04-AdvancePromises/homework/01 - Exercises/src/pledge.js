'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

// let promesa = new Promise((resolve, reject) => { // ._value = 2
//     resolve(2)
// })
// let promesa2 = promesa.then(data => data + 2, data => data - 2) // ._value = 4
// let promesa3 = promesa.then(data => data + 4) // ._value = 6
// console.log(
//     promesa, // 2 
//     promesa2, // 4
//     promesa3, // 6
// )

// promesa.then(data => data + 2, data => data - 2) // ._value = 4
// .then(data => data + 4) // ._value = 6
// [{}, {}, {}]

function $Promise(executor) { // (resolve, reject) => promise
    this._state = "pending"
    this._handlerGroups = [] // [resolve, reject]

    if (typeof executor !== "function") {
        throw TypeError("executor function mala")
    }

    executor(this._internalResolve.bind(this), this._internalReject.bind(this)) // () => this._internalResolve()
} 

$Promise.prototype._internalResolve = function(data) {
    if (this._state === "pending") {
        this._state = "fulfilled"
        this._value = data
        this._callHandlers()
    }
}

$Promise.prototype._internalReject = function(error) {
    if (this._state === "pending") {
        this._state = "rejected"
        this._value = error
        this._callHandlers()
    }
}

// $Promise.prototype.then = function(successCb, errorCb) {
//     if (typeof successCb === "function" && typeof errorCb === "function") {
//         const cbs = { successCb, errorCb }
//         this._handlerGroups.push(cbs)
//     }
// }

$Promise.prototype.then = function(successCb, errorCb) {
    successCb = typeof successCb === "function" ? successCb : false; // successCb = undefined // successCb = successCb ?? false
    errorCb = typeof errorCb === "function" ? errorCb : false;

    const downstreamPromise = new $Promise(() => {})

    this._handlerGroups.push({successCb, errorCb, downstreamPromise
        // successCb: typeof successCb === "function" ? successCb : false,
        // errorCb: typeof errorCb === "function" ? errorCb : false,
    })

    if (this._state !== "pending") {
        this._callHandlers()
    }

    return downstreamPromise
}

$Promise.prototype.catch = function(errorCb) {
    return this.then(null, errorCb)
}

$Promise.prototype._callHandlers = function() {
    while (this._handlerGroups.length) { // /!!3 == true
        const {successCb, errorCb, downstreamPromise} = this._handlerGroups.shift()

        // if (this._state === "fulfilled") {
        //     if(successCb) {
        //         const result = successCb(this._value)
        //         if (result instanceof $Promise) {
        //             result.then(
        //                 () => downstreamPromise._internalResolve
        //             )
        //         }
        //     }
        // }

        // if (this._state === "rejected") {
        //     errorCb && errorCb(this._value)
        // }

        if (this._state === "fulfilled") { //.then() -- // .then(null, () => {})
            if (successCb) {
              try {
                const x = successCb(this._value);
                if (x instanceof $Promise) {
                  x.then(
                    (value) => downstreamPromise._internalResolve(value),
                    (reason) => downstreamPromise._internalReject(reason)
                  );
                } else {
                  downstreamPromise._internalResolve(x);
                }
              } catch (e) {
                downstreamPromise._internalReject(e);
              }
            } else {
              downstreamPromise._internalResolve(this._value);
            }
        }  else if (this._state === "rejected") { 
            if (errorCb) {
              try {
                const x = errorCb(this._value);
                if (x instanceof $Promise) {
                  x.then(
                    (value) => downstreamPromise._internalResolve(value),
                    (reason) => downstreamPromise._internalReject(reason)
                  );
                } else {
                  downstreamPromise._internalResolve(x);
                }
              } catch (e) {
                downstreamPromise._internalReject(e);
              }
            } else {
              downstreamPromise._internalReject(this._value);
            }
        }
    }
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
