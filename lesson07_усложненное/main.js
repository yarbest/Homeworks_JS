'use strict';

let week = ['Sunday', 'Monday', 'Tuesday', 'Saturday'];
week.forEach(function (day) {
    if (day === 'Sunday' || day === 'Saturday') {
        document.write(`<p><i>${day}</i></p>`);
    } else {
        document.write(`<p>${day}</p>`);
    }
});
var date = new Date();
document.write(`<p><b>It's ${date.getDay()} day of a week</b></p>`);
document.write(`<b>It's ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} now</b>`);
