'use strict';

let circle = document.querySelector('#circle');
let pxFromLeft = 0;
const moveToRight = () => {
    pxFromLeft += 1;
    if (pxFromLeft < 100) {
        circle.style.left = pxFromLeft + 'px';
    } else {
        requestAnimationFrame(moveToLeft);
    }
    console.log(pxFromLeft);
    requestAnimationFrame(moveToRight);
};

const moveToLeft = () => {
    pxFromLeft -= 1;
    if (pxFromLeft > 0) {
        circle.style.left = pxFromLeft + 'px';
    } else {
        requestAnimationFrame(moveToRight);
    }
    requestAnimationFrame(moveToLeft);
};

requestAnimationFrame(moveToRight);
