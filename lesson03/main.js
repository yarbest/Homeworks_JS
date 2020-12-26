'use strict';
let mission = 1000000;
let salary = prompt('Your salary', 20000);

let expenses1 = 'Food';
let amount1 = 8300;
let expenses2 = 'Games';
let amount2 = 5200;

let allExpenses = +amount1 + +amount2;
console.log('Month Expenses', allExpenses);
let remainingMoney = salary - allExpenses;
console.log('Remaining Money', remainingMoney);

console.log(`You will achieve your goal in ${Math.ceil(mission / remainingMoney)} months`);

let everyDayExpenses = allExpenses / 30;
console.log('You spend ' + everyDayExpenses + ' every day');

if (everyDayExpenses >= 1200) {
    console.log('You have high level of life');
} else if (everyDayExpenses >= 600 && everyDayExpenses < 1200) {
    console.log('You have medium level of life');
} else if (everyDayExpenses >= 0 && everyDayExpenses < 600) {
    console.log('You have low level of life');
} else {
    console.log('Something went wrong');
}

// let income = 'Freelance';
// let addExpenses = prompt('Your possible expenses', 'Fare, Internet');
// let deposit = confirm('Do you have a deposit?');

// let period = 4;
// console.log(typeof money, typeof income, typeof deposit);
// console.log('addExpenses.length ' + addExpenses.length);
// console.log(`Период равен ${period} месяцев. Цель заработать ${mission} гривен`);
// console.log(`Expenses ${addExpenses.toLowerCase().split(',')}`);

// let budgetDay = salary / 30;
// console.log(budgetDay);
