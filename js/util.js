'use strict'

function getRandId(){
    var possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var randId = ''
    for (let i=0; i<6; i++){
        randId+=possible.charAt(getRandomInt(0,possible.length))
    }
    return randId;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}