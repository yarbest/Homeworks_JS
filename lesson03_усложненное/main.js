'use strict';
// let mission = 1000000;
// let salary = 20000;

// let expenses1 = 'Food';
// let amount1 = 8300;
// let expenses2 = 'Games';
// let amount2 = 5200;

// let allExpenses = amount1 + amount2;
// console.log('Month Expenses', allExpenses);
// let remainingMoney = salary - allExpenses;
// console.log('Remaining Money', remainingMoney);

// console.log(`You will achieve your goal in ${Math.ceil(mission / remainingMoney)} months`);

// let everyDayExpenses = allExpenses / 30;
// console.log('You spend ' + everyDayExpenses + ' every day');

// if (everyDayExpenses >= 1200) {
//     console.log('You have high level of life');
// } else if (everyDayExpenses >= 600 && everyDayExpenses < 1200) {
//     console.log('You have medium level of life');
// } else if (everyDayExpenses >= 0 && everyDayExpenses < 600) {
//     console.log('You have low level of life');
// } else {
//     console.log('Something went wrong');
// }

let lang = 'ru';
if (lang === 'ru') {
    console.log('Сейчас суббота');
} else if (lang === 'en') {
    console.log("It's Saturday now");
} else {
    console.log('0');
}

switch (lang) {
    case 'ru':
        console.log('Сейчас суббота');
        break;
    case 'en':
        console.log('Сейчас суббота');
        break;
    case 'ch':
    case 'jp':
        console.log('Asian');
        break;
    default:
        console.log('0');
}

lang === 'ru' ? console.log('Сейчас суббота') : console.log('0');

let namePerson = 'Maxims';

namePerson === 'Artem' ? console.log('Supervisor') : namePerson === 'Maxim' ? console.log('Teacher') : console.log('Student');

// namePerson === 'Artem' ? console.log('Supervisor') : console.log('Student');
