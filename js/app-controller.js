'use strict';
var gImgSrc = '';
var gSearchedWords = {};

function renderGallery() {

    let elGallery = $('.gallery-container');
    let strHtml = '';
    gImgs.map(function (img) {
        strHtml += `<a href="editor.html"><img onclick=onSaveImgSrc('${img.url}') src="${img.url}" alt=""></a>`;
        // strHtml += `<img onclick="onSaveImgSrc('${img.url}')" src="${img.url}" alt="" >`;
    })
    $(elGallery).html(strHtml);
}

function onSaveImgSrc(url) {
    console.log('url ', url)
    gImgSrc = url;
    console.log('gImgSrc ', gImgSrc);
}

function getImgSrc() {
    return gImgSrc;
}



function onSearchStr() {
    let search = document.querySelector('.searchBox').value;
    if (search === '') {
        renderGallery();
        return;
    } else if (!gSearchedWords[search]) {
        gSearchedWords[search] = 1;
        // saveToLocalStorage(search, 1);
    } else gSearchedWords[search]++;
    // saveToLocalStorage(gSearchedWords);

    let keyWords = getKeyWords();
    let idx = keyWords.findIndex(function (keys) {

        return keys.find(function (key) {

            return key === search
        })
    })
    if (idx === -1) return;
    renderFoundImage(idx);
    renderWordCloud(search);
}

function renderFoundImage(i) {
    let images = getImages();
    let strHtml = `<a href="editor.html"><img onclick=onSaveImgSrc('${images[i].url}') src="${images[i].url}" alt=""></a>`;
    document.querySelector('.gallery-container').innerHTML = strHtml;
}

function renderWordCloud(str) {

    let elCloud = document.querySelector('.word-cloud-container');
    let color = getRandomColor();
    let searches = (!loadFromLocalStorage('searches')) ? [] : loadFromLocalStorage('searches');
    let strHtmls = (!loadFromLocalStorage('html-strs'))? [] : loadFromLocalStorage('html-strs');
    let strHtml =  `<span><font size="${gSearchedWords[str]}" 
    color="${color}">${str}</font></span>`;
    
    let idx = searches.findIndex(function (search){
        return search === str;
    })
    if (idx !== -1){
        strHtmls[idx]  = strHtml
        saveToLocalStorage('html-strs',strHtmls);
    } else {
        searches.push(str);
        saveToLocalStorage('searches',searches);
        strHtmls.push(strHtml);
        saveToLocalStorage('html-strs',strHtmls);
    }
    elCloud.innerHTML = strHtmls.join(' ');
}

function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function saveToLocalStorage(key, value) {
    value = JSON.stringify(value);
    localStorage.setItem(key, value);
}

function loadFromLocalStorage(key) {
    let val = localStorage.getItem(key);
    val = JSON.parse(val);
    return val;
}




