"use strict";

let exerciseUtils = require("./utils");

let args = process.argv.slice(2).map(function (st) {
  return st.toUpperCase();
});

module.exports = {
  problemAx: problemA,
  problemBx: problemB
};

// corre cada problema dado como un argumento del command-line para procesar
args.forEach(function (arg) {
  let problem = module.exports["problem" + arg];
  if (problem) problem();
});

function problemA() {
  // callback version
  exerciseUtils.readFile("poem-two/stanza-01.txt", function (err, stanza) {
    exerciseUtils.blue(stanza);
  });
  exerciseUtils.readFile("poem-two/stanza-02.txt", function (err, stanza) {
    exerciseUtils.blue(stanza);
  });

  // promise version
  // Tu código acá:

  const stanza01 = exerciseUtils
    .promisifiedReadFile("poem-two/stanza-01.txt")
    .then((stanza01) => {
      exerciseUtils.blue(stanza01);
    });
  const stanza02 = exerciseUtils
    .promisifiedReadFile("poem-two/stanza-02.txt")
    .then((stanza02) => {
      exerciseUtils.blue(stanza02);
    });

  Promise.all([stanza01, stanza02]).then((values) => {
    exerciseUtils.blue(values[0]);
    exerciseUtils.blue(values[1]);
    console.log("done");
  });
}

function problemB() {
  let filenames = [1, 2, 3, 4, 5, 6, 7, 8].map(function (n) {
    return "poem-two/" + "stanza-0" + n + ".txt";
  });
  let randIdx = Math.floor(Math.random() * filenames.length);
  filenames[randIdx] = "wrong-file-name-" + (randIdx + 1) + ".txt";

  // callback version
  filenames.forEach((filename) => {
    exerciseUtils.readFile(filename, function (err, stanza) {
      exerciseUtils.blue(stanza);
      if (err) exerciseUtils.magenta(new Error(err));
    });
  });

  // promise version
  // Tu código acá:
  const promisifiedReadFilePromises = filenames.map((filename) => {
    return exerciseUtils
      .promisifiedReadFile(filename)
      .then((stanza) => {
        exerciseUtils.blue(stanza);
      })
      .catch((err) => {
        exerciseUtils.magenta(new Error(err));
      });
  });

  promisifiedReadFilePromises.reduce((chain, currentPromise)=>{ // [1, 2, 3, 4, 5, 6] = ((acc, current) => acc += current), 0
    return chain.then(()=> currentPromise, err => console.log(err))
  }, Promise.resolve())

  // Promise.then(promesa1).then(promesa2).then(promesa3)
  .then(()=>{
    console.log("done");
  })
  .catch((err) => {
    exerciseUtils.magenta(new Error(err));
  });
}

// EJERCICIO EXTRA
function problemC() {
  let fs = require("fs");
  function promisifiedWriteFile(filename, str) {
    // tu código acá:
  }
}
