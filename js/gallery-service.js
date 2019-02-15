'use strict';

var gNextId = 0
var gImgs = [];

var gKeyWords = [
['xzibit','dawg'],
['butterfly','anime'],
['child','africa'],
['did','smile'],
['nicholas','cage'],
['aliens','history'],
['success','kid'],
['medival','poetry'],
['wonka','telling'],
['fry','money']
];

function init(){
    createImages();
    renderGallery();
}
function createImg(id) {
    return {
        id: id,
        url: `img/${id}.jpg`,
        keywords: gKeyWords[id]
    }
}
function createImages() {
    for (let i = 0; i < 10; i++) {
        let img = createImg(gNextId);
        img.keywords = gKeyWords[i];
        gNextId++;
        gImgs.push(img);
    }
}

function getKeyWords(){
    return gKeyWords;
}

function getImages(){
    return gImgs;
}


