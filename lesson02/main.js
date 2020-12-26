// const elevatorAscend = (func) => {
//     // эта функция выполняет асинхронную операцию. Сюда передается callback функция,
//     //которая будет выполнена после завершения асинхронного действия
//     console.log("I started to ascend");
//     setTimeout(func, 5000);
// };

// const arrive = () => {
//     console.log("I've arrived");
//     console.log("I've stopped singing");
//     console.log("I've stopped dancing");
// };

// const jam = () => {
//     console.log("Elevator has stuck");
// };

// const sing = () => {
//     console.log("I started to sing");
// };

// const dance = () => {
//     console.log("I started to dance");
// };

// elevatorAscend(jam);
// sing();
// dance();

'use strict';

// const makePizza = function (title, cb) {
//     console.log(`Заказ на приготовление пиццы «${title}» получен. Начинаем готовить…`);
//     setTimeout(cb, 3000);
// };

// const readBook = function () {
//     console.log('Читаю книгу «Колдун и кристалл»…');
// };

// const eatPizza = function () {
//     console.log('Ура! Пицца готова, пора подкрепиться.');
// };

// makePizza('Пеперонни', eatPizza);
// readBook();

let num = 266219;
num = num.toString().split('');
let sum = 1;

for (let elem of num) {
    sum *= elem;
}
console.log(sum);
sum = sum ** 3;
console.log(sum);
console.log(+sum.toString().slice(0, 2));
