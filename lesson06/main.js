'use strict';

// const createNumber = () => {
//     let number = Math.ceil(Math.random() * 20);
//     console.log(number);
//     return number;
// };

// const getNumber = (status = '') => {
//     let userNumber = prompt(`Enter guessed numberd ${status}`);
//     console.log(userNumber);
//     if (userNumber === null) {
//         return false;
//     }
//     userNumber = userNumber;
//     if (isNaN(+userNumber) || userNumber === '') {
//         getNumber("Your last value wasn't a number");
//     }
//     return +userNumber;
// };

// const checkNumber = (createdNumber, userNumber) => {
//     if (userNumber === false || userNumber === null) {
//         return;
//     } else if (isNaN(+userNumber)) {
//         getNumber("Your last value wasn't a number");
//     } else if (userNumber > createdNumber) {
//         console.log('Your number is bigger');
//         userNumber = getNumber('Your last number was bigger');
//         checkNumber(createdNumber, userNumber);
//     } else if (userNumber < createdNumber) {
//         console.log('Your number is smaller');
//         userNumber = getNumber('Your last number was smaller');
//         checkNumber(createdNumber, userNumber);
//     } else if (+userNumber === createdNumber) {
//         alert('You won');
//     }
// };

// const startGame = () => {
//     checkNumber(createNumber(), getNumber());
// };

// startGame();

const guessNumber = (createdNumber) => {
    console.log(`created number: ${createdNumber}`); //проверяю, остается ли то же самое значение, при рекурсии, да, останется, так как мы не вызываем функцию рандома
    return function (userNumber) {
        console.log(`user number: ${userNumber}`);
        if (userNumber === null) {
            //при нажатии на отмену, вернется +null = 0

            return; // вернет undefined. +undefined = NaN
        } else if (userNumber.trim() === '' || isNaN(+userNumber)) {
            //Проверка на ввод пустых строк и не чисел
            //'           '.trim() = ''
            //+'       7 ' = 7; НО +'7       7' = NaN;
            //+'2d' = NaN
            alert(`'${userNumber}' is not a Number`);
            startGame(prompt(`Enter number`));
        } else if (+userNumber > createdNumber) {
            alert('Your number is bigger');
            startGame(prompt(`Enter number`)); //рекурсия, так как эта анонимная функция записана в переменную startGame
        } else if (+userNumber < createdNumber) {
            alert('Your number is smaller');
            startGame(prompt(`Enter number`));
        } else if (+userNumber === createdNumber) {
            alert('You won');
        }
    };
};

const startGame = guessNumber(Math.ceil(Math.random() * 20));
startGame(prompt(`Enter number`));
