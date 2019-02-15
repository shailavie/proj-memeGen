'use strict';
var gCanvas;
var gCtx;
var gIsDrawing = false;
var gIsErasing = false;
var gTool = 'pencil';
var gNextId = 100;

var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];
var gMeme = {
    selectedImgId: 5,
    txts: [
        {
            id: getRandId(),
            line: 'Top Line',
            left: 40,
            top: 20,
            size: 40,
            align: 'left',
            color: 'white',
            strokeColor: 'black',
            font: 'Impact'
        },
        {
            id: getRandId(),
            line: 'Bottom Line',
            left: 40,
            top: 160,
            size: 40,
            align: 'left',
            color: 'white',
            strokeColor: 'black',
            font: 'Impact'
        }
    ]
}


function onQaFunc() {
    calcImgCenter()
}

function calcImgCenter() {
    let img = new Image();
    img.src = gMemeImgSrc;
    var w = img.width;
    var wC = img.clientWidth;
    console.log('w', w)
    console.log('wc', wC)

    var elImg = document.querySelector('#meme-img')
    var imgPos = elImg.getBoundingClientRect();

    console.log('elImg', elImg)
    console.log('imgPos', imgPos)
}


function getImgId() {
    var url = window.location.href;
    var params = url.split('?');
    var id = params[1]
    return `img/${id}.jpg`;
}

function onLineInput() {

}


function getLinePos() {

}


function generateMeme() {
    // var elTxtTop = document.querySelector('#txt-top-line')
    // var txtTopPos = elTxtTop.getBoundingClientRect();
    // var elTxtBottom = document.querySelector('#txt-bottom-line')
    // var txtBottomPos = elTxtBottom.getBoundingClientRect();
    // var elMemeImg = document.querySelector('#meme-img');
    // var imgPos = elMemeImg.getBoundingClientRect();
    let img = new Image();
    img.src = gMemeImgSrc;
    renderCanvas()
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d')
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
    drawTheLines()
}

function drawTheLines() {
    console.log('potato');
    var lines = gMeme.txts;
    lines.forEach(function (line) {
        drawStroked(line)
    })
}


function drawStroked({ line, size, color, strokeColor, font, left, top }) {
    gCtx.font = `${size}px ${font}`
    gCtx.strokeStyle = strokeColor;
    gCtx.lineWidth = Math.floor(size / 10);
    gCtx.strokeText(line, left, top + size);
    gCtx.fillStyle = color;
    gCtx.fillText(line, left, top + size);
}


function renderCanvas() {
    var elImg = document.querySelector('#meme-img')
    var imgWidth = elImg.clientWidth;
    var imgHeight = elImg.clientHeight;
    // var imgTrueWidth = elImg.width;
    // var imgTrueHeight = elImg.height;
    // <canvas id="canvas-to-download" width="${imgTrueWidth}" height="${imgTrueHeight}" onmousedown="onMouseDown(event)" onmouseup="onMouseUp(event)" onmousemove="onMouseMovement(event)"></canvas>
    var strHtml = ''
    strHtml = `
    <canvas id="canvas" width="${imgWidth}" height="${imgHeight}" onmousedown="onMouseDown(event)" onmouseup="onMouseUp(event)" onmousemove="onMouseMovement(event)"></canvas>
    <div class="footer-btn-container"><a onclick="onDownloadImage(this)" class="btn btn-download">Download Your Masterpice</a></div>
    `
    document.querySelector('#canvas-container').innerHTML = strHtml;
}



////////////////////////////////
////// Painting Functions///////
////////////////////////////////

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



