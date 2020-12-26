'use strict';

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
