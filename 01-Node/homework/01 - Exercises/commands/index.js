const fs = require("fs");
const utils = require("../utils/request");
const process = require("process");
const { throws } = require("assert");

function pwd(print) {
    print(process.cwd())
}

function date(print) {
    // print(typeof new Date()) object
    // print(typeof Date()) string
    print(Date())
}

function echo(print, args) {
    print(args)
}

function ls(print) {
    fs.readdir(".", (err, files) => {
        if(err) throw Error(err)
        print(files.join(' '))
    })
}

function cat(print, args) {
    fs.readFile(args, 'utf-8', (err, data) => {
        if (err) throw Error(err)
        print(data)
    })
}

function head(print, args) {
    fs.readFile(args, 'utf-8', (err, data) => {
        if (err) throw Error(err)
        // let lines = data.split("\n").slice(0, 8).join('\n') 
        let lines = data.split("\n")[0] // Solo imprimir la primer linea
        print(lines)
    })
}

function tail(print, args) {
    fs.readFile(args, 'utf-8', (err, data) => {
        if (err) throw Error(err)
        let line = data.split("\n").at(-1).trim() // [-1]
        // let lastLine = line[line.length - 1]
        print(line)
    })
}

function curl(print, args) { // https://google.com
    utils.request(args, (err, response) => {
        if (err) throw Error(err)
        print(response)
    })
}

function curl2(print, args) { // google.com
    utils.request(`https://${args}`, (err, response) => {
        if(err) throw Error(err)
        print(response) 
    })
}

module.exports = {
    pwd,
    date,
    echo,
    ls,
    cat,
    head,
    tail,
    curl,
    curl2
};
