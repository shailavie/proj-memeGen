'use strict';
var gCanvas; 
var gCtx;
var gIsDrawing = false;
var gIsErasing = false;
var gTool = 'pencil';


function getRandImg() {
    let rand = parseInt(Math.random() * 5);
    // let img = new Image();
    // return `./img/${rand}.jpg`;
    return `img/${rand}.jpg`;
}

 

function generateMeme() {
    var elTopLine = document.querySelector('#txt-top-line')
    var txtPos = elTopLine.getBoundingClientRect();
    var elMemeImg = document.querySelector('#meme-img');
    var imgPos = elMemeImg.getBoundingClientRect();

    // console.log('txt top',txtPos.top)
    // console.log('imgPos top:',imgPos.top)
    // console.log('txt on img :',txtPos.top-imgPos.top)
    let img = new Image();
    img.src = gMemeImgSrc;
    renderCanvas()
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d');
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    gCtx.font = "30px Impact";
    gCtx.fillStyle = 'white'
    gCtx.shadowColor = 'black'
    gCtx.shadowOffsetX = 0;
    gCtx.shadowOffsetY = 0;
    gCtx.shadowBlur = 10;
    gCtx.fillText(elTopLine.value, txtPos.left-imgPos.left, txtPos.top-imgPos.top+30);

}


function renderCanvas() {
    var elImg = document.querySelector('#meme-img')
    var imgWidth = elImg.clientWidth;
    var imgHeight = elImg.clientHeight;
    // console.log('imgWidth: ',imgWidth)
    // console.log('imgHeight: ',imgHeight)
    var strHtml = ''
    strHtml = `
    <canvas id="canvas" width="${imgWidth}" height="${imgHeight}"></canvas>
    `
    document.querySelector('#canvas-container').innerHTML = strHtml;
}



/*
function onMouseMovement(ev) {
    var x = ev.offsetX;
    var y = ev.offsetY;
    if (gIsDrawing) {
        gCtx.lineTo(x, y);
        if (gIsErasing) erasePath(x, y);
        else if (gTool === 'pencil') drawPencil();
        else if (gTool === 'brush') drawBrush(x, y);
        else if (gTool === 'rect') drawRect(x, y);
    } else return;
}

function drawPencil() {
    gCtx.stroke();
}

function erasePath(x, y) {
    gCtx.save();
    gCtx.strokeStyle = '#ffffff';
    gCtx.fillStyle = '#ffffff';
    gCtx.arc(x, y, 5, 0, 2 * Math.PI);
    gCtx.stroke();
    gCtx.closePath();
    gCtx.fill();
    gCtx.restore();
    gCtx.beginPath();
}

function drawBrush(x, y) {
    gCtx.save();
    gCtx.strokeStyle = gCtx.fillStyle;
    gCtx.arc(x, y, 10, 0, 2 * Math.PI);
    gCtx.stroke();
    gCtx.closePath();
    gCtx.fill();
    gCtx.beginPath();
    gCtx.restore();
}

function drawRect(x, y) {
    gCtx.rect(x - 5, y - 10, x + 5, y + 10);
    gCtx.stroke();
    gCtx.fill();
    gCtx.closePath();
    gCtx.beginPath();
}

function onMouseUp(ev) {
    ev.stopPropagation();
    gIsDrawing = false;
    gCtx.closePath();
}
function onMouseDown(ev) {
    ev.stopPropagation();
    var x = ev.offsetX;
    var y = ev.offsetY;
    gCtx.beginPath();
    gCtx.moveTo(x, y);
    gIsDrawing = true;
}

function onColorChange(color, property) {
    if (property === 'fill') gCtx.fillStyle = color;
    else gCtx.strokeStyle = color;
}

function onResetCanvas() {
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
}

function onToggleEraser() {
    if (!gIsErasing) {
        gIsErasing = true
        document.querySelector('.btn-eraser').classList.add('clicked');
    } else {
        gIsErasing = false;
        document.querySelector('.btn-eraser').classList.remove('clicked');
    }
}

function onSetRandImage() {
    let rand = parseInt(Math.random() * 4);
    let img = new Image();
    img.src = `./img/${rand}.jpg`;
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}



function onCheckMousePos(ev) {
    let targetId = ev.target.id;
    if (targetId !== 'canvas') {
        gIsDrawing = false;
        gCtx.closePath();
    }
}

function onChooseDrawTool(tool) {
    gTool = tool;
}
*/