'use strict';

var gNextId = 0
var gImgs = [];

var gMeme = {
    selectedImgId: 5,
    txts: [
        {
            line: 'I never eat Falafel',
            size: 20,
            align: 'left',
            color: 'red',
        }
    ]
}
var gKeyWords = [
    'happy', 'fat','sad','baby','cool','shit'
];

function init(){
    createImages();
    renderGallery();
}
function createImg(id) {
    return {
        id: id,
        url: `img/${id}.jpg`,
        keywords: [],
    }
}
function createImages() {
    for (let i = 0; i < 10; i++) {
        let img = createImg(gNextId);
        img.keywords = getRandKeyWord();
        gNextId++;
        gImgs.push(img);
    }
}

function getRandKeyWord(){
    let keys = [];
    let rand1 = parseInt(Math.random() * gKeyWords.length);
    let rand2 = parseInt(Math.random() * gKeyWords.length);
    keys.push(gKeyWords[rand1]);    
    keys.push(gKeyWords[rand2]);    
    return keys;
}
