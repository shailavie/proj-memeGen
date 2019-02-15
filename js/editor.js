'use strict'

//Model
var gMemeImgSrc = getImgId()
// var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];
var gMeme = {
  selectedImgId: 5,
  txts: [
    {
      id: getRandId(),
      line: 'Top Line',
      left: 0,
      top: 0,
      size: 40,
      width: getTextWidth(this.line, `${this.size}px ${this.font}`),
      align: 'left',
      color: 'white',
      strokeColor: 'black',
      font: 'Impact'
    },
    {
      id: getRandId(),
      line: 'Bottom Line',
      left: 0,
      top: 0,
      size: 40,
      width: getTextWidth(this.line, `${this.size}px ${this.font}`),
      align: 'left',
      color: 'white',
      strokeColor: 'black',
      font: 'Impact'
    }
  ]
}


//Init
function init() {
  renderMemeImg()
  setTimeout(() => {
    renderLines();
  }, 10);
}

//This function gets and imageId from a URL param
function getImgId() {
  var url = window.location.href;
  var params = url.split('?');
  var id = params[1]
  return `img/${id}.jpg`;
}


// This function renders the chosen image, so we can calculate where to position the lines based on its size
function renderMemeImg() {
  var strHtml = `<img class="img-container" id="meme-img" src="${gMemeImgSrc}" alt="">`
  document.querySelector('.meme-container').innerHTML = strHtml;
}


// This function renders the default top and bottom lines, at image center, with a font-size padding from top and bottom
function renderLines() {
  var strHtml = ''
  getLinesPosByImgSize();
  var lines = gMeme.txts;
  lines.forEach(function (line) {
    strHtml += `
      <input contentEditable="true" 
             class="txt" 
             type="text" 
             onmousedown="dragElement(this)"
             ontouchstart="dragElementMobile(this)"
             onchange="updateLineTxt(this)"
             id="${line.id}"
             value = ""
             placeholder = "${line.line}" | "Enter Text"
             style = "text-align:center; width: ${line.width}px; font-size:${line.size}px; top:${line.top}px; left:${line.left}px"
             >
             `
  })
  document.querySelector('.meme-container').innerHTML += strHtml;
}

// style = "text-align:center; width: ${line.width}px; font-size:${line.size}px; top:${line.top}px; left:${line.left}px"

// This function renders a canvas in the exact dimensions of the given DOM image, and strokes all given lines at their respective position
function generateMeme() {
  let img = new Image();
  img.src = gMemeImgSrc;
  renderCanvas()
  gCanvas = document.querySelector('#canvas');
  gCtx = gCanvas.getContext('2d')
  gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
  var lines = gMeme.txts;
  lines.forEach(function (line) {
    drawStroked(line)
  })
}


//This function calculate the default position of top and bottom default lines
function getLinesPosByImgSize() {
  var img = document.querySelector('#meme-img')
  var imgPos = img.getBoundingClientRect();
  var imgWidth = imgPos.width
  var imgHeight = imgPos.height
  var lineTop = gMeme.txts[0];
  var lineBot = gMeme.txts[1];
  lineTop.top = lineTop.size;
  lineBot.top = imgHeight - lineBot.size * 2;
  lineTop.width = getTextWidth(lineTop.line, `${lineTop.size}px bold ${lineTop.font}`)
  lineBot.width = getTextWidth(lineBot.line, `${lineBot.size}px bold ${lineBot.font}`)
  gMeme.txts[0].left = imgWidth / 2 - lineTop.width / 2;
  gMeme.txts[1].left = imgWidth / 2 - lineBot.width / 2;
}



//This function to update the Top and Left of an element after it moved
function updateLinePos(line) {
  var imgPos = document.querySelector('#meme-img').getBoundingClientRect()
  var linePos = line.getBoundingClientRect();
  var lineId = line.id
  var lineIdx = getLineIdxById(lineId)
  var lineModel = gMeme.txts[lineIdx]
  lineModel.top = linePos.top - imgPos.top;
  lineModel.left = linePos.left - imgPos.left;
}


//This function updates the model every time a line text has been changed
function updateLineTxt(line) {
  var lineId = line.id
  var lineTxt = line.value
  var lineIdx = getLineIdxById(lineId)
  gMeme.txts[lineIdx].line = lineTxt
  console.log(lineTxt);
}


//Service function
function getLineIdxById(id) {
  return gMeme.txts.findIndex(function (line) {
    return line.id === id
  })
}


//This function handles the meme downloading process
function onDownloadImage(elLink) {
  elLink.href = gCanvas.toDataURL()
  var name = gMeme.txts[0].line.replace(/[^a-zA-Z0-9]/, '').toLowerCase();
  elLink.download = `${name}.jpg`
}


//This function uses a dummy canvas to calculate text measurement
function getTextWidth(text, font) {
  // if given, use cached canvas for better performance
  // else, create new canvas
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var ctx = canvas.getContext('2d');
  ctx.font = font;
  var metrics = ctx.measureText(text);
  return metrics.width;
};
