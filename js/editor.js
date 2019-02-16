'use strict'

//Model
var gMemeImgSrc = getImgId()
var gIsMemeReady;
// var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];
var gMeme = {
	selectedImgId: getImgId(),
	txts: [
		{
			id: getRandId(),
			line: 'Top Line',
			left: 0,
			top: 0,
			size: 40,
			width: 0,
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
			width: 0,
			align: 'left',
			color: 'white',
			strokeColor: 'black',
			font: 'Impact'
		}
	]
}


//Init
function init() {
	gIsMemeReady = false;
	renderImg()
	var x = setTimeout(() => {
		renderLines();
		clearTimeout(x);
	}, 10);
}

//This function gets and imageId from a URL param
function getImgId() {
	var url = window.location.href;
	var params = url.split('?');
	var id = params[1] | 0;
	return id;
}


// This function renders the chosen image, so we can calculate where to position the lines based on its size
function renderImg() {
	var strHtml = `<img class="img-container" style="z-index:-1"  id="meme-img" src="img/${gMeme.selectedImgId}.jpg" alt="">`
	document.querySelector('.meme-container').innerHTML = strHtml;

}


// This function renders the default top and bottom lines, at image center, with a font-size padding from top and bottom
function renderLines() {
	console.log('hi there')
	getLinesPosByImgSize();
	document.querySelector('.meme-container').innerHTML = ''
	var strHtml = ''
	var lines = gMeme.txts;
	lines.forEach(function (line) {
		strHtml += getLineStrHtml(line);
	})
	console.log(strHtml)
	strHtml+=`<img class="img-container" id="meme-img" src="img/${gMeme.selectedImgId}.jpg" alt="">`
	document.querySelector('.meme-container').innerHTML = strHtml;
}


function getLineStrHtml(line) {
	var strHtml = `
			 <div class="${line.id}">
      		 <input contentEditable="true" 
             class="txt" 
             type="text" 
             onmousedown="dragElement(this)"
             ontouchstart="dragElementMobile(this)"
             onchange="updateLineModel(this)"
             id="${line.id}"
             value = ""
             placeholder = "${line.line}" | "Enter Text"
             style = "text-align:center; width: ${line.width}px; font-size:${line.size}px; top:${line.top}px; left:${line.left}px"
             >
             </div>
			`
	return strHtml
}

// This function renders a canvas in the exact dimensions of the given DOM image, and strokes all given lines at their respective position
function generateMeme() {
	if (gIsMemeReady) {
		document.querySelector('.meme-container').classList.remove('hide')
		document.querySelector('.canvas-container').classList.add('hide')
		document.querySelector('.canvas-controls').classList.add('hide')
		document.querySelector('.download').classList.add('hide')
		document.querySelector('.generateBtn').innerText = 'Save Texts'
	} else {
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
		document.querySelector('.meme-container').classList.add('hide')
		document.querySelector('.canvas-container').classList.remove('hide')
		document.querySelector('.canvas-controls').classList.remove('hide')
		document.querySelector('.download').classList.remove('hide')
		document.querySelector('.generateBtn').innerText = 'Edit Texts'
	}
	gIsMemeReady = !gIsMemeReady;
}

function onAddText() {
	var newText = {
		id: getRandId(),
		line: 'Enter Text',
		left: 0,
		top: 0,
		size: 40,
		width: 200,
		align: 'left',
		color: 'white',
		strokeColor: 'black',
		font: 'Impact'
	}
	gMeme.txts.push(newText)
	renderLines()
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
	lineTop.width = getTextWidth(lineTop);
	lineBot.width = getTextWidth(lineBot);
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
	// lineModel.width = getTextWidth(line.line, `${line.size}px ${line.font}`);
	lineModel.width = getTextWidth(lineModel);

}



//This function updates the model every time a line text has been changed
function updateLineModel(line) {
	var lineId = line.id
	var lineTxt = line.value
	var lineIdx = getLineIdxById(lineId)
	var lineModel = gMeme.txts[lineIdx]
	lineModel.line = lineTxt
	lineModel.size = Math.floor(lineTxt.length * (-2) + 60);
	renderLine(line, lineModel);
}

function renderLine(line, lineModel) {
	var strHtml = `
		<input contentEditable="true" 
		class="txt" 
		type="text" 
		onmousedown="dragElement(this)"
		ontouchstart="dragElementMobile(this)"
		onchange="updateLineModel(this)"
		id="${lineModel.id}"
		value = "${lineModel.line}"
		placeholder = "${lineModel.line}" | "Enter Text"
		style = "text-align:center; width: ${lineModel.width}px; font-size:${lineModel.size}px; top:${lineModel.top}px; left:${lineModel.left}px"
		>
	`
	var elLine = document.querySelector(`.${lineModel.id}`);
	elLine.innerHTML = strHtml;
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
function getTextWidth(text) {
	// if given, use cached canvas for better performance
	// else, create new canvas
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	var ctx = canvas.getContext('2d');
	ctx.font = `${text.size}px ${text.font}`;
	var metrics = ctx.measureText(text.line);
	return metrics.width;
};


