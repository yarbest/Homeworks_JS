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
// document.write(`<p><b>It's ${date.getDay()} day of a week</b></p>`);
let currentDay;
switch (date.getDay()) {
    case 4:
        currentDay = 'Thursday';
        break;
    default:
        currentDay = 'none';
}
document.write(`<p><b>It's ${currentDay} now</b></p>`);

let currentTime = document.createElement('div');
currentTime.innerHTML = `<b>It's ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} now</b>`;
document.body.append(currentTime);

setInterval(() => {
    date = new Date();
    currentTime.innerHTML = `<b>It's ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} now</b>`;
}, 1000);

// document.write(`<b>It's ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} now</b>`);
