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
['fry','money'],
['satisfied','seal'],
['austin','powers','behave'],
['scumbag','steve'],
['happy','africa']
];

function init(){
    createImages();
    renderGallery();
    renderWordCloud();
}
function createImg(id) {
    return {
        id: id,
        url: `img/${id}.jpg`,
        keywords: gKeyWords[id]
    }
}
function createImages() {
    for (let i = 0; i < 14; i++) {
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

function addMeme(url,keyWords){
    var newImage = createImg(gNextId);
    console.log(newImage);
    newImage.url = url;
    gKeyWords.push(keyWords);
    newImage.keywords = keyWords; 
}


