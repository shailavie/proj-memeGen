'use strict';
var gImgId = -1;

function renderGallery(){

    let elGallery = $('.gallery-container');
    let strHtml = ''
    gImgs.map(function(img,idx){
        strHtml += `<a href="editor.html"><img onclick=onSaveImgSrc(${img.id}) src="${img.url}" alt=""></a>`;
    })    
    $(elGallery).html(strHtml);
}

function onSaveImgSrc(id){
    gImgId = id;
    console.log('entered func');
    
}