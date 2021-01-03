'use strict';
const calculate = document.getElementById('start');
const incomeAdd = document.getElementsByTagName('button')[0];
const expensesAdd = document.getElementsByTagName('button')[1];
const depositCheckmark = document.getElementById('deposit-check');
let values = [];
document.querySelectorAll('[class*=-value]').forEach((item, i) => {
    values.push(item);
});
values.shift();

const monthIncome = document.querySelector('.salary-amount');
const incomeTitle = document.querySelector('.income-title');
const incomeAmount = document.querySelector('.income-amount');
const additionalIncomeItem = document.querySelectorAll('.additional_income-item');
const expensestTitle = document.querySelectorAll('.expenses-title');
const expensesAmount = document.querySelectorAll('.expenses-amount');
const additionalExpensesItem = document.querySelectorAll('.additional_expenses-item');
const depositCheck = document.getElementById('deposit-check');
const targetAmount = document.querySelectorAll('.target-amount');
const periodSelect = document.querySelectorAll('.period-select');

//Усложненное А
const getFullTime = () => {
    let date = new Date();
    let dayOfMonth = date.getDate();

    //день недели
    let currentDay = date.getDay();
    switch (currentDay) {
        case 0:
            currentDay = 'Воскресенье';
            break;
        case 1:
            currentDay = 'Понедельник';
            break;
        case 2:
            currentDay = 'Вторник';
            break;
        case 3:
            currentDay = 'Среда';
            break;
        case 4:
            currentDay = 'Четверг';
            break;
        case 5:
            currentDay = 'Пятница';
            break;
        case 6:
            currentDay = 'Суббота';
            break;
    }

    //склонение часов
    let currentHour = date.getHours();
    let declensionHour;
    if ([1, 21].includes(currentHour)) {
        declensionHour = 'час';
    } else if ([2, 3, 4, 22, 23].includes(currentHour)) {
        declensionHour = 'часа';
    } else {
        declensionHour = 'часов';
        // [0, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
    }

    //сколнение минут
    let currentMinutes = date.getMinutes();
    let declensionMinutes;
    let lastSymboldOfMinutes = currentMinutes.toString()[currentMinutes.toString().length - 1];
    if (lastSymboldOfMinutes === '1' && currentMinutes !== 11) {
        declensionMinutes = 'минута';
    } else if (
        (lastSymboldOfMinutes === '2' && currentMinutes !== 12) ||
        (lastSymboldOfMinutes === '3' && currentMinutes !== 13) ||
        (lastSymboldOfMinutes === '4' && currentMinutes !== 14)
    ) {
        declensionMinutes = 'минуты';
    } else {
        declensionMinutes = 'минут';
        // минут 0 5 6 7 8 9   10 11 12 13 14 15 16 17 18 19   20 25 26 27 28 29   30 35 36 37 38 39   40 45 46 47 48 49   50
        // минута 1 21 31 41 51
        // минуты 2 3 4  22 23 24  32 33 34  42 43 44
    }

    //сколнение секунд
    let currentSeconds = date.getSeconds();
    let declensionSeconds;
    let lastSymboldOfSeconds = currentSeconds.toString()[currentSeconds.toString().length - 1];
    if (lastSymboldOfSeconds === '1' && currentSeconds !== 11) {
        declensionSeconds = 'секунда';
    } else if (
        (lastSymboldOfSeconds === '2' && currentSeconds !== 12) ||
        (lastSymboldOfSeconds === '3' && currentSeconds !== 13) ||
        (lastSymboldOfSeconds === '4' && currentSeconds !== 14)
    ) {
        declensionSeconds = 'секунды';
    } else {
        declensionSeconds = 'секунд';
        // секунд 0 5 6 7 8 9   10 11 12 13 14 15 16 17 18 19   20 25 26 27 28 29   30 35 36 37 38 39   40 45 46 47 48 49   50
        // секунда 1 21 31 41 51
        // секунды 2 3 4  22 23 24  32 33 34  42 43 44
    }

    return `Сегодня ${currentDay}, ${dayOfMonth} февраля ${date.getFullYear()} года, ${currentHour} ${declensionHour} ${currentMinutes} ${declensionMinutes} ${currentSeconds} ${declensionSeconds}`;
};

let timeBlock = document.createElement('p');
document.body.append(timeBlock);

setInterval(function () {
    timeBlock.innerHTML = getFullTime();
}, 1000);

//Усложненное Б
const getShortTime = () => {
    //3 '3' ['3'] ['0', '3'] 03
    const addZero = (number) => {
        let withZero = number.toString().length === 1 ? '0' + number : number;
        return withZero;
    };
    let date = new Date();
    let dayOfMonth = date.getDate();
    dayOfMonth = addZero(dayOfMonth);

    let month = date.getMonth() + 1;
    month = addZero(month);

    let year = date.getFullYear();
    let hours = date.getHours();
    hours = addZero(hours);

    let minutes = date.getMinutes();
    minutes = addZero(minutes);

    let seconds = date.getSeconds();
    seconds = addZero(seconds);

    return `${dayOfMonth}.${month}.${year} - ${hours}:${minutes}:${seconds}`;
};

let timeBlockShort = document.createElement('p');
document.body.append(timeBlockShort);
setInterval(function () {
    timeBlockShort.innerHTML = getShortTime();
}, 1000);
