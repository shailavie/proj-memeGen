'use strict'


var gMemeImgSrc = getImgId()


function init() {
    renderEditor();
}


function renderEditor(){
    var strHtml = ''
    var lines = gMeme.txts;
    lines.forEach(function(line){
      console.log(line)
      strHtml += `
      <input contentEditable="true" 
             class="txt" 
             type="text" 
             onmousedown="dragElement(this)"
             ontouchstart="dragElementMobile(this)"
             id="${line.id}"
             value = "${line.line}"
             placeholder = "${line.line}"
             style = "font-size:${line.size}px; top:${line.top}px; left:${line.left}px"
             >
      `
    })
    strHtml += `<img class="img-container" id="meme-img" src="${gMemeImgSrc}" alt="">`
    document.querySelector('.meme-container').innerHTML = strHtml;
}
 

 
function dragElementMobile(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.ontouchstart = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault(); 
    // e.stopPropagation();

    // get the mouse cursor position at startup:
    pos3 = e.touches[0].clientX;
    pos4 = e.touches[0].clientY;
    document.ontouchend = closeDragElement;
    // call a function whenever the cursor moves:
    document.ontouchmove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.touches[0].clientX;
    pos2 = pos4 - e.touches[0].clientY;
    pos3 = e.touches[0].clientX;
    pos4 = e.touches[0].clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.ontouchend = null;
    document.ontouchmove = null;
    updateLinePos(elmnt);
  }
}


function dragElement(elmnt) {
  
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    // e.preventDefault(); 

    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    
    document.onmouseup = null;
    document.onmousemove = null;
    updateLinePos(elmnt);
  }
}

//Service function to update the Top and Left of an element after it moved
function updateLinePos(line){
  var imgPos = document.querySelector('#meme-img').getBoundingClientRect()
  var linePos = line.getBoundingClientRect();
  var lineId = line.id
  var lineIdx = getLineIdxById(lineId)
  var lineModel = gMeme.txts[lineIdx]
  lineModel.top = linePos.top - imgPos.top;
  lineModel.left = linePos.left - imgPos.left ;
}


function getLineIdxById(id){
  return gMeme.txts.findIndex(function(line){
    return line.id === id
  })
}

function onDownloadImage(elLink){
    elLink.href = gCanvas.toDataURL()
    var name = gMeme.txts[0].line.replace(/\s/,'').toLowerCase();
    console.log(name);
    elLink.download = `${name}.jpg`
    // elLink.download = 'my-img.jpg'
}

