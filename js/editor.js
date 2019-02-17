'use strict'

//Model
// var gMemeImgId = getImgId()
var gMemeImgSrc;
var gIsMemeReady;
var gEditableTextId;
var gPropsCount = 13;
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
	}, 100);
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


// This function calls for master functions renders all elements in the model to the main Meme container
function renderItems() {
	document.querySelector('.meme-container').innerHTML = ''
	var strHtml = renderLines()
	strHtml += renderProps()
	strHtml += `<img class="img-container" id="meme-img" src="img/${gMeme.selectedImgId}.jpg" alt="">`
	document.querySelector('.meme-container').innerHTML = strHtml;
}


function renderProps() {
	var strHtml = ''
	var props = gMeme.props;
	props.forEach(function (prop) {
		strHtml += getPropStrHtml(prop);
	})
	return strHtml;
}


function renderLines() {
	var strHtml = ''
	var lines = gMeme.txts;
	lines.forEach(function (line) {
		strHtml += getLineStrHtml(line);
	})
	return strHtml;
}

function getLineStrHtml(line) {
	// <div class="${line.id}" data-id="${line.id}">
	var strHtml = `
			<input 
			 contenteditable="true" 
			 class="txt" 
			 data-type="txts"
			 data-id="${line.id}"
			 type="texts"
			 onClick="markEditable(${line.id}); showTextControls(this)"
             onmousedown="dragElement(this)"
             ontouchstart="dragElementMobile(this)"
             onchange="updateLineText(this)"
             id="${line.id}"
             value = ""
             placeholder = "${line.line}" 
			 style = "text-align:${line.align}; color:${line.color}; font-family: ${line.font}; 
			 		 width: ${line.width}px; font-size:${line.size}px; top:${line.top}px; left:${line.left}px"
             >
			 `
	//  </div>
	return strHtml
}

function getPropStrHtml(prop) {
	//  //markEditable(${prop.id}); extracted from 3 lines down
	var strHtml = `
			<img 
				contenteditable="true" 
				class="prop"
				data-type="props"
				data-id="${prop.id}"
				type="props"
				onClick="showPropControls(this)"
				onmousedown="dragElement(this)"
				ontouchstart="dragElementMobile(this)"
				id="${prop.id}"
				style="z-index:2; position:absolute; width:${prop.width}px; top:${prop.top}px; left:${prop.left}px; transform:rotate(${prop.rotate}deg)"
				src="img/addons/${prop.srcId}.png"
			>
			`
	// </div>
	return strHtml;
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
	var strHtml = `
			<button class="btn-txt-ctrl" onmousedown="onIncreaseFont()" title="Increase font size"><i class="fas fa-plus"></i></button>
			<button class="btn-txt-ctrl" onmousedown="onDecreaseFont()" title="Decrease font size"><i class="fas fa-minus"></i></button>
			<select class="btn-txt-ctrl" onchange="onChangeFontText(this.value)" title="Change font">
				<option value="Impact" style="font-family:Impact; font-size: 14px">Impact</option>
				<option value="Tahoma" style="font-family:Tahoma; font-size: 14px">Tahoma</option>
				<option value="Arial" style="font-family:Arial; font-size: 14px">Arial</option>
				<option value="zcoolq" style="font-family:zcoolq; font-size: 14px">zcoolq</option>
			</select>
			<button class="btn-txt-ctrl" value='left' onclick="onChangeAlignText(this.value)"title="Align left"><i class="fas fa-align-left"></i></button>
			<button class="btn-txt-ctrl" value='center' onclick="onChangeAlignText(this.value)"title="Align center"><i class="fas fa-align-center"></i></button>
			<button class="btn-txt-ctrl" value='right' onclick="onChangeAlignText(this.value)"title="Align right"><i class="fas fa-align-right"></i></button>
			<button class="btn-txt-ctrl" onclick="onDeleteItem(${element.dataset.id},'txts')" title="Delete"><i class="fas fa-trash" ></i></button>
			<div class="close-controls" data-modal="text-controllers" onclick="hideModal('.text-controllers')" title="close"><i class="fas fa-times"></i></div>`
	var txtPos = element.getBoundingClientRect()
	var elController = document.querySelector('.text-controllers')
	elController.innerHTML = strHtml;
	var style = `left: ${txtPos.left - 20}px; top: ${txtPos.top - 70}px`;
	elController.style.cssText = style;
	elController.classList.remove('hide')
	// <label><input type="color" class="btn-txt-ctrl color-picker" onchange="onChangeColorText(this.value)"></label>
}


//
function showPropControls(element) {
	var strHtml = `
			<button class="btn-txt-ctrl" onmousedown="onChangeSizeProp(${element.id},5)" title="Increase size"><i class="fas fa-plus"></i></button>
			<button class="btn-txt-ctrl" onmousedown="onChangeSizeProp(${element.id},-5)" title="Decrease size"><i class="fas fa-minus"></i></button>
			<button class="btn-txt-ctrl" onmousedown="onRotateProp(${element.id},5)" title="Rotate">⭮</button>
			<button class="btn-txt-ctrl" onmousedown="onRotateProp(${element.id},-5)" title="Rotate">⭯</button>
			<button class="btn-txt-ctrl" onclick="onDeleteItem(${element.id},'props')" title="Delete"><i class="fas fa-trash" ></i></button>
			<div class="close-controls" data-modal="prop-controllers" onclick="hideModal('.prop-controllers')" title="close"><i class="fas fa-times"></i></div>`
	var propPos = element.getBoundingClientRect()
	var elController = document.querySelector('.prop-controllers')
	elController.innerHTML = strHtml;
	var style = `left: ${propPos.left - 20}px; top: ${propPos.top - 70}px`;
	elController.style.cssText = style;
	elController.classList.remove('hide')
}



function onChangeSizeProp(element, value) {
	var elementId = element.id + ''
	var itemIdx = getItemIdxByIdAndType(elementId, 'props')
	gMeme['props'][itemIdx].width += value
	renderItems()
}

function onRotateProp(element, value) {
	var elementId = element.id + ''
	var itemIdx = getItemIdxByIdAndType(elementId, 'props')
	gMeme['props'][itemIdx].rotate += value
	renderItems()
}


function onDeleteItem(element, type) {
	var elementId = element.id + ''
	var itemIdx = getItemIdxByIdAndType(elementId, type)
	gMeme[type].splice(itemIdx, 1)
	var modalClass = (type === 'txts') ? '.text-controllers' : '.prop-controllers';
	hideModal(modalClass);
	renderItems()
}



function hideModal(modalClass) {
	document.querySelector(modalClass).classList.add('hide')
}


///////////////////////////////////////
/////// Text Controls Functions ///////
///////////////////////////////////////


function onIncreaseFont() {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxByIdAndType(text.id, 'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.size++
	textModel.width += 5
	renderItems()
}


function onDecreaseFont() {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxByIdAndType(text.id, 'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.size--
	textModel.width--
	renderItems()
}


function onChangeColorText(selectedColor) {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxByIdAndType(text.id, 'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.color = selectedColor
	renderItems()
}


function onChangeAlignText(selectedAlign) {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxByIdAndType(text.id, 'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.align = selectedAlign
	renderItems()
}


function onChangeFontText(selectedFont) {
	var elId = `#${gEditableTextId}`
	var text = document.querySelector(elId);
	var textIdx = getItemIdxByIdAndType(text.id, 'txts')
	var textModel = gMeme.txts[textIdx]
	textModel.font = selectedFont
	renderItems()
}


///////////////////////////////
/////// Props Functions ///////
///////////////////////////////

function onAddProps() {
	var elPropCnt = document.querySelector('.prop-container')
	var strHtml = ''
	for (let i = 0; i < gPropsCount; i++) {
		strHtml +=
			`<img onclick="onAddProp(this)" class="prop-gallery" type="props" id="${i}" src="img/addons/${i}.png" >`
	}
	strHtml += `<div class="close-controls" onclick="hideModal('.prop-container')"><i class="fas fa-times"></i></div>`
	elPropCnt.innerHTML = strHtml;
	elPropCnt.classList.remove('hide')
}


function onAddProp(prop) {
	var prop = {
		id: getRandId(),
		srcId: prop.id,
		left: 1,
		top: 1,
		width: 100,
		rotate: 0
	}
	gMeme.props.push(prop)
	hideModal('.prop-container')
	renderItems()
}



function markEditable(itemId) {
	// console.log('im editable now',itemId.id)
	gEditableTextId = itemId.id //|| gMeme.txts[0].id || gMeme.props[0].id
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
function updateItemPos(element) {
	var imgPos = document.querySelector('#meme-img').getBoundingClientRect()
	var itemPos = element.getBoundingClientRect();
	var itemId = element.id
	var type = element.dataset.type;
	var itemIdx = getItemIdxByIdAndType(itemId, type)
	var itemModel = gMeme[type][itemIdx]
	itemModel.top = itemPos.top - imgPos.top;
	itemModel.left = itemPos.left - imgPos.left;
	if (type === 'txts') itemModel.width = getTextWidth(itemModel);
	if (type === 'props') itemModel.height = itemPos.height;
}


//Service function
function getItemIdxByIdAndType(id, type) {
	return gMeme[type].findIndex(function (item) {
		return item.id === id
	})
}




///////////////////////////////
//////// Core Functions ///////
///////////////////////////////


//This function uses a dummy canvas to calculate text measurement
function getTextWidth(textObj) {
	// if given, use cached canvas for better performance
	// else, create new canvas
	var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
	var ctx = canvas.getContext('2d');
	ctx.font = `${textObj.size}px ${textObj.font}`;
	var metrics = ctx.measureText(textObj.line);
	return metrics.width + 20;
}


//This function updates the model every time a line text has been changed
function updateLineText(line) {
	var type = line.dataset.type
	var lineId = line.id
	var lineTxt = line.value
	var lineIdx = getItemIdxByIdAndType(lineId, type)
	var lineModel = gMeme.txts[lineIdx]
	lineModel.line = lineTxt
	lineModel.width = getTextWidth(lineModel)
	renderItems();
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
		// hideTextControls();
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


//This function handles the meme downloading process
function onDownloadImage(elLink) {
	if (!gCanvas) {
		generateMeme()
	}
	setTimeout(() => {
		elLink.href = gCanvas.toDataURL()
		console.log('img url', elLink.href)
		var name = gMeme.txts[0].line.replace(/[^a-zA-Z0-9]/, '').toLowerCase();
		elLink.download = `${name}.jpg`
	}, 500);
}

//Redundent function
// function onDownloadImageNow(elLink) {
// 	generateMeme();
// 	setTimeout(() => {
// 		elLink.href = gCanvas.toDataURL()
// 		var name = gMeme.txts[0].line.replace(/[^a-zA-Z0-9]/, '').toLowerCase();
// 		elLink.download = `${name}.jpg`
// 	}, 500);
// }



///////////////////////////////////
//////// FB Share Functions ///////
///////////////////////////////////

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

function onShareImage(elFbLink) {
	console.log(elFbLink)
	postCanvasToFacebook()

	uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
	document.querySelector('.share-container').innerHTML = `
	<a class="w-inline-block social-share-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
	   Share
	</a>`
}
 

// on submit call to this function
function uploadImg(elForm, ev) {
	ev.preventDefault();
	
	var x = document.getElementById('potato');
	x.href = gCanvas.toDataURL("image/jpeg");
	console.log('x btatat',x.href)
	console.log('uploadImg is happening')
	console.log('elForm',elForm)
	console.log('ev',ev)

	document.getElementById('imgData').value = gCanvas.toDataURL("image/jpeg");
	var elImgData = document.getElementById('imgData').value
	console.log(elImgData);
   
    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        console.log('POTATO!!!', uploadedImgUrl);

        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="w-inline-block social-share-btn fb" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share   
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}

function doUploadImg(elForm, onSuccess) {
    var formData = new FormData(elForm);

    fetch('http://ca-upload.com/here/upload.php', {
        method: 'POST',
        body: formData
    })
    .then(function (response) {
        return response.text()
    })
    .then(onSuccess)
    .catch(function (error) {
        console.error(error)
    })
}





// facebook api
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = 'https://connect.facebook.net/he_IL/sdk.js#xfbml=1&version=v3.0&appId=807866106076694&autoLogAppEvents=1';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));



  //MAIN

  
function renderCanvas2(img) {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
}

function onFileInputChange(ev) {
    handleImageFromInput(ev, renderCanvas)
}

function downloadImg(elLink) {
    var imgContent = canvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}


//UPLOAD IMG WITH INPUT FILE
function handleImageFromInput(ev, onImageReady) {
    document.querySelector('.share-container').innerHTML = ''
    var reader = new FileReader();
    console.log(ev)
    reader.onload = function (event) {
        var img = new Image();
        img.onload = onImageReady.bind(null, img)
        img.src = event.target.result;
    }
    reader.readAsDataURL(ev.target.files[0]);
}