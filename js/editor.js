'use strict'

// var gMemeImgSrc = 'img/success.jpg';
var gMemeImgSrc = getRandImg();

function init() {
    renderEditor();
}


function renderEditor(){
    var strHtml = ''
    strHtml = `
    <input contentEditable="true" class="txt txt-top" type="text" onmousedown="dragElement(this)" id="txt-top-line" value="top line" placeholder="top line">
    <img class="img-container" id="meme-img" onmousedown="dragElement(this)" src="${gMemeImgSrc}" alt="">
    <input contentEditable="true" class="txt txt-bottom" type="text" onmousedown="dragElement(this)" id="txt-bottom-line" value="bottom line" placeholder="bottom line">
    `
    document.querySelector('.meme-container').innerHTML = strHtml;
}
 


function dragElement(elmnt) {
  
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt)) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt).onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }
  

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
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
  }
}


function onDownloadImage(elLink){
    elLink.href = gCanvas.toDataURL()
    elLink.download = 'my-img.jpg'
}
