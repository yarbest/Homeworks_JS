'use strict';

const getCost = () => {
    return parseFloat(prompt('Enter cost'));
};

const checkIfInt = (number) => {
    while (isNaN(number)) {
        let newCost = getCost();
        if (!isNaN(newCost)) {
            return !isNaN(newCost);
        }
    }
    return !isNaN(number);
};

console.log(checkIfInt(getCost()));

// console.log(checkIfInt('5000'));
// console.log(checkIfInt(''));
// console.log(checkIfInt(' '));
// console.log(checkIfInt('50dd'));
// console.log(checkIfInt('dd50'));
