'use strict';
var gImgSrc = '';
var gSearchedWords = (!loadFromLocalStorage('searchesCountMap')) ? {} : loadFromLocalStorage('searchesCountMap');
var gSlideIndex = 0;
var gToggleDisplay = true;

function onToggleDisplay() {
    gToggleDisplay = !gToggleDisplay;
    renderGallery();
}

function onToggleInfo(){
    let elGallery = document.querySelector('.gallery-container');
    let elAbout = document.querySelector('.about-us');
    let elAboutLink = document.querySelector('.about-link');
    if (elAboutLink.innerText === 'ABOUT US'){
        elAboutLink.innerText = 'GALLERY';
    } else  elAboutLink.innerText = 'ABOUT US';
    elGallery.classList.toggle('hide');
    elAbout.classList.toggle('hide');
}

function renderGallery() {
    if (gToggleDisplay) {

        let elGallery = document.querySelector('.gallery-container');
        elGallery.classList.add('grid');
        elGallery.classList.add('gallery-grid');
        let elCarouselBtn = document.querySelectorAll('.w3-button');
        elCarouselBtn[0].classList.add('hide');
        elCarouselBtn[1].classList.add('hide');
        let strHtml = '';
        gImgs.map(function (img) {
            strHtml += `<a href="editor.html?${img.id}"><img class="my-slides" onclick=onSaveImgSrc(${img.id}) src="${img.url}" alt="">
            <div class="img-details flex wrap">Keywords: ${img.keywords.join(', ')}</div></a>`;
        })

        $(elGallery).html(strHtml);
    }
    else {
        showDivs(gSlideIndex);
    }
}


function plusDivs(n) {
    showDivs(gSlideIndex += n);
}

function showDivs(slideNum) {
    let elCarouselBtn = document.querySelectorAll('.w3-button');
    elCarouselBtn[0].classList.remove('hide');
    elCarouselBtn[1].classList.remove('hide');
    if (slideNum < 0) {
        slideNum = gImgs.length - 1;
        gSlideIndex = gImgs.length - 1;
    } else if (slideNum > gImgs.length - 1) {
        slideNum = 0;
        gSlideIndex = 0;
    }
    let elGallery = document.querySelector('.gallery-container');
    elGallery.classList.remove('grid');
    elGallery.classList.remove('gallery-grid');

    let img = gImgs[slideNum];
    let strHtml = `<a href="editor.html?${img.id}"><img class="my-slides carousel" onclick=onSaveImgSrc(${img.id}) src="${img.url}" alt="">
    <div class="img-details flex wrap">Keywords: ${img.keywords.join(', ')}</div></a>`;
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
    let elSearch = document.querySelector('.searchBox').value;
    if (elSearch === '') {
        renderGallery();
        return;
    } else if (!gSearchedWords[elSearch]) {
        gSearchedWords[elSearch] = 1;
    } else gSearchedWords[elSearch]++;

    let keyWords = getKeyWords();
    let idx = keyWords.findIndex(function (keys) {

        return keys.find(function (key) {

            return key === elSearch;
        })
    })
    if (idx === -1) return;
    renderFoundImage(idx);
    renderWordCloud();
}

function renderFoundImage(i) {
    let images = getImages();
    gToggleDisplay = true;
    renderGallery();
    let strHtml = `<a href="editor.html?${images[i].id}"><img class="my-slides" onclick=onSaveImgSrc(${images[i].id}) src="${images[i].url}" alt="">
    <div class="img-details">Keywords: ${images[i].keywords.join(', ')}</div></a>`;
    document.querySelector('.gallery-container').innerHTML = strHtml;
}

function renderWordCloud() {
    let str = document.querySelector('.searchBox').value;
    gSearchedWords[str]++;
    saveToLocalStorage('searchesCountMap', gSearchedWords);
    let elCloud = document.querySelector('.word-cloud-container');
    let color = getRandomColor();
    let searches = (!loadFromLocalStorage('searches')) ? [] : loadFromLocalStorage('searches');
    let strHtmls = (!loadFromLocalStorage('html-strs')) ? [] : loadFromLocalStorage('html-strs');
    let strHtml = `<span><font size="${gSearchedWords[str]}" 
    color="${color}">${str}</font></span>`;

    let idx = searches.findIndex(function (search) {
        return search === str;
    })
    if (idx !== -1) {
        strHtmls[idx] = strHtml
        saveToLocalStorage('html-strs', strHtmls);
    } else {
        searches.push(str);
        saveToLocalStorage('searches', searches);
        strHtmls.push(strHtml);
        saveToLocalStorage('html-strs', strHtmls);
    }
    elCloud.innerHTML = strHtmls.join(' ');
}






