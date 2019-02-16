'use strict';
var gCanvas;
var gCtx;
var gIsDrawing = false;
var gIsErasing = false;
var gTool = 'pencil';


function renderCanvas() {
    var elImg = document.querySelector('#meme-img')
    var imgWidth = elImg.clientWidth;
    var imgHeight = elImg.clientHeight;
    var strHtml = ''
    strHtml = `
    <canvas id="canvas" width="${imgWidth}" height="${imgHeight}" onmousedown="onMouseDown(event)" onmouseup="onMouseUp(event)" onmousemove="onMouseMovement(event)"></canvas>
    `
    document.querySelector('#canvas-container').innerHTML = strHtml;
}


function drawlines() {
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


function drawImg() {
    let img = new Image();
    img.src = gMemeImgSrc;
    gCanvas = document.querySelector('#canvas');
    gCtx = gCanvas.getContext('2d')
    gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
}


function drawProps() {
    var props = gMeme.props;
    props.forEach(function (prop) {
        console.log(prop)
        let img = new Image();
        img.src = `img/addons/${prop.srcId}.png`
        gCanvas = document.querySelector('#canvas');
        gCtx = gCanvas.getContext('2d')
        gCtx.drawImage(img, prop.left, prop.top, prop.width, prop.height);
    })
}


function drawProps2() {
    var props = gMeme.props;
    props.forEach(function (prop) {
        let img = new Image();
        img.src = `img/addons/${prop.srcId}.png`
        gCanvas = document.querySelector('#canvas');
        gCtx = gCanvas.getContext('2d')
        var deg = prop.rotate
        var angleInRadians = deg * Math.PI / 180
        console.log(deg, 'in radians is', angleInRadians)
        var x = gCanvas.width / 2;
        var y = gCanvas.height / 2;
        var width = img.width;
        var height = img.height;
        // gCtx.translate(x, y);
        // gCtx.rotate(angleInRadians);
        // gCtx.drawImage(img, -width / 2, -height / 2, prop.width, prop.height);
        // gCtx.rotate(-angleInRadians);
        // gCtx.translate(-x, -y);

        rotateAndPaintImage ( gCtx, img, angleInRadians, prop.left, prop.top, width/2, height/2 );

    })
}



function rotateAndPaintImage ( context, image, angleInRad , positionX, positionY, axisX, axisY ) {
    context.translate( positionX, positionY );
    context.rotate( angleInRad );
    context.drawImage( image, -axisX, -axisY );
    context.rotate( -angleInRad );
    context.translate( -positionX, -positionY );
  }



// context.translate( positionX, positionY );
// context.rotate( angleInRad );
// context.drawImage( image, -axisX, -axisY );
// context.rotate( -angleInRad );
// context.translate( -positionX, -positionY );


//TO DO - Render a TRUE size hidden canvas solely for download purposes 
// var imgTrueWidth = elImg.width;
// var imgTrueHeight = elImg.height;
// <canvas id="canvas-to-download" width="${imgTrueWidth}" height="${imgTrueHeight}" onmousedown="onMouseDown(event)" onmouseup="onMouseUp(event)" onmousemove="onMouseMovement(event)"></canvas>





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



