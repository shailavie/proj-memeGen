'use strict'

//Model
// var gMemeImgId = getImgId()
var gMemeImgSrc;
var gIsMemeReady;
var gEditableTextId;
// var gImgs = [{ id: 1, url: 'img/popo.jpg', keywords: ['happy'] }];
var gMeme = {
	selectedImgId: getImgId(),
	props: [],
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
	gMemeImgSrc = `img/${gMeme.selectedImgId}.jpg`
	gEditableTextId = gMeme.txts[0].id;
	renderImg()
	var x = setTimeout(() => {
		setDefaultLinesPos();
		renderItems();
		clearTimeout(x);
	}, 10);
}

//This function gets and imageId from a URL param
function getImgId() {
	var url = window.location.href;
	var params = url.split('?');
	var id = params[1];
	return id;
}


// This function renders the chosen image, so we can calculate where to position the lines based on its size
function renderImg() {
	var strHtml = `<img class="img-container" style="z-index:-1"  id="meme-img" src="img/${gMeme.selectedImgId}.jpg" alt="">`
	document.querySelector('.meme-container').innerHTML = strHtml;

}


// This function renders the default top and bottom lines, at image center, with a font-size padding from top and bottom
function renderItems() {
	document.querySelector('.meme-container').innerHTML = ''
	var strHtml = renderLines()
	strHtml += renderProps()
	strHtml += `<img class="img-container" id="meme-img" src="img/${gMeme.selectedImgId}.jpg" alt="">`
	document.querySelector('.meme-container').innerHTML = strHtml;
}


function renderProps(){
	var strHtml = ''
	var props = gMeme.props;
	props.forEach(function (prop) {
		strHtml += renderProp(prop);
	})
	return strHtml;
}


function renderLines(){
	var strHtml = ''
	var lines = gMeme.txts;
	lines.forEach(function (line) {
		strHtml += getLineStrHtml(line);
	})
	return strHtml;
}

function getLineStrHtml(line) {
	var strHtml = `
			 <div class="${line.id}">
      		 <input contenteditable="true" 
			 class="txt" 
			 data-type="txts"
			 type="texts"
			 onClick="markEditable(this); showTextControls(this)"
             onmousedown="dragElement(this)"
             ontouchstart="dragElementMobile(this)"
             onchange="updateLineText(this)"
             id="${line.id}"
             value = ""
             placeholder = "${line.line}" 
             style = "text-align:${line.align}; color:${line.color}; font-family: ${line.font}; width: ${line.width}px; font-size:${line.size}px; top:${line.top}px; left:${line.left}px"
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
		document.querySelector('.add-text').classList.remove('hide')
		document.querySelector('.add-prop').classList.remove('hide')
		// document.querySelector('.download').classList.add('hide')
		document.querySelector('.generateBtn').innerText = 'Save Texts'
	} else {
		renderCanvas()
		drawImg()
		drawlines()
		drawProps()
		hideTextControls();
		document.querySelector('.meme-container').classList.add('hide')
		document.querySelector('.add-text').classList.add('hide')
		document.querySelector('.add-prop').classList.add('hide')
		document.querySelector('.canvas-container').classList.remove('hide')
		document.querySelector('.canvas-controls').classList.remove('hide')
		// document.querySelector('.download').classList.remove('hide')
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
		width: 240,
		align: 'left',
		color: 'white',
		strokeColor: 'black',
		font: 'Impact'
	}
	gMeme.txts.push(newText)
	renderItems()
}


function showTextControls(element) {
	var txtPos = element.getBoundingClientRect()
	var elController = document.querySelector('.text-controllers')
	var style = `left: ${txtPos.left - 20}px; top: ${txtPos.top - 70}px`;
	elController.style.cssText = style;
	elController.classList.remove('hide')
}


function onIncreaseFont() {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxById(text.id,'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.size++
	textModel.width += 5
	renderItems()
}


function onDecreaseFont() {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxById(text.id,'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.size--
	textModel.width--
	renderItems()
}


function onChangeColorText(selectedColor) {
	console.log(selectedColor)
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxById(text.id,'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.color = selectedColor
	renderItems()
}


function onChangeAlignText(selectedAlign) {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxById(text.id,'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.align = selectedAlign
	renderItems()
}



function onDeleteText() {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxById(text.id,'txts')
	gMeme.txts.splice(textIdx, 1)
	hideTextControls()
	renderItems()
}


function onAddProps() {
	var elPropCnt = document.querySelector('.prop-container')
	var strHtml = ''
	for (let i = 0; i < 3; i++) {
		strHtml +=
			`<img onclick="addProp(this)" class="prop" type="props" id="${i}" src="img/addons/${i}.png" >`
	}
	strHtml += `<div class="close-controls" onclick="hideProps()"><i class="fas fa-times"></i></div>`
	elPropCnt.innerHTML = strHtml;
	elPropCnt.classList.remove('hide')
}

function hideProps() {
	document.querySelector('.prop-container').classList.add('hide')
}

function addProp(prop) {
	console.log(prop);
	var prop = {
		id: getRandId(),
		srcId: prop.id,
		left: 0,
		top: 0,
		width: 100,
	}
	gMeme.props.push(prop)
	renderItems()
}



function renderProp(prop) {
	var strHtml = `
			 <div id="${prop.id}" data-type="props"
				onClick="markEditable(this); showTextControls(this)"
				onmousedown="dragElement(this)"
				ontouchstart="dragElementMobile(this)"
				style = "z-index:2; position:absolute; width:${prop.width}px; top:${prop.top}px; left:${prop.left}px"
			 >
					<img class="prop" 
					id="${prop.id}" 
					src="img/addons/${prop.srcId}.png"
					>
             </div>
			`
	return strHtml;
	document.querySelector('.meme-container').innerHTML += strHtml;
}


function hideTextControls() {
	document.querySelector('.text-controllers').classList.add('hide')
}

function onChangeFontText(selectedFont) {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxById(text.id,'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.font = selectedFont
	renderItems()
}


function onResetCanvas() {
	generateMeme()
	generateMeme()
}





// function updateModelText(textId, prop, value) {

// }



function markEditable(that) {
	gEditableTextId = that.id
}


//This function calculate the default position of top and bottom default lines
function setDefaultLinesPos() {
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



//This service function to update the Top and Left of an element after it moved
function updateLinePos(element) {
	var imgPos = document.querySelector('#meme-img').getBoundingClientRect()
	var itemPos = element.getBoundingClientRect();
	var itemId = element.id
	var type = element.dataset.type;
	var itemIdx = getItemIdxById(itemId, type)
	var itemModel = gMeme[type][itemIdx]
	itemModel.top = itemPos.top - imgPos.top;
	itemModel.left = itemPos.left - imgPos.left;
	if (type === 'txts') itemModel.width = getTextWidth(itemModel);
	if (type === 'props') itemModel.height = itemPos.height;
}

//Service function
function getItemIdxById(id, type) {
	return gMeme[type].findIndex(function (item) {
		return item.id === id
	})
}



//This function updates the model every time a line text has been changed
function updateLineText(line) {
	console.log('potato!!!!!!!',line.value);
	console.log('potato!!!!!!!',line.dataset.type);
	var type = line.dataset.type
	var lineId = line.id
	var lineTxt = line.value
	var lineIdx = getItemIdxById(lineId,type)
	var lineModel = gMeme.txts[lineIdx]
	lineModel.line = lineTxt
	lineModel.width = getTextWidth(lineModel)
	renderItems();
}






//This function handles the meme downloading process
function onDownloadImage(elLink) {
	if (!gCanvas) {
		generateMeme()
	}
	setTimeout(() => {
		elLink.href = gCanvas.toDataURL()
		var name = gMeme.txts[0].line.replace(/[^a-zA-Z0-9]/, '').toLowerCase();
		elLink.download = `${name}.jpg`
	}, 500);
}

function onDownloadImageNow(elLink) {
	generateMeme();
	setTimeout(() => {
		elLink.href = gCanvas.toDataURL()
		var name = gMeme.txts[0].line.replace(/[^a-zA-Z0-9]/, '').toLowerCase();
		elLink.download = `${name}.jpg`
	}, 500);
}

//This function uses a dummy canvas to calculate text measurement
function getTextWidth(textObj) {
	// if given, use cached canvas for better performance
	// else, create new canvas
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	var ctx = canvas.getContext('2d');
	ctx.font = `${textObj.size}px ${textObj.font}`;
	var metrics = ctx.measureText(textObj.line);
	return metrics.width + 20;
};
