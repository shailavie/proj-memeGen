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
             value = "${line.line}"
             placeholder = "Enter Text"
             style = "text-align:center; width: 200px; font-size:${line.size}px; top:${line.top}px; left:${line.left}px"
             >
             `
  })
  document.querySelector('.meme-container').innerHTML += strHtml;
}


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
  gMeme.txts[0].top = gMeme.txts[0].size;
  gMeme.txts[1].top = imgHeight - gMeme.txts[1].size * 2;
  gMeme.txts[0].left = imgWidth / 2 - 100;
  gMeme.txts[1].left = imgWidth / 2 - 100;
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

