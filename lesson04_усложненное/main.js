'use strict';

// const checkIfStringWithSlice = (str) => {
//     if (typeof str !== 'string') {
//         return "It's not a string";
//     }
//     console.log(str.split(''));

//     for (let i = 0; i < str.length; i++) {
//         if (str[0] === ' ') {
//             str = str.slice(1);
//         }
//         if (str[str.length - 1] === ' ') {
//             str = str.slice(0, -1);
//         }
//     }
//     console.log(str.split(''));

//     return str;
// };

const checkIfStringWithSplit = (str) => {
    if (typeof str !== 'string') {
        return "It's not a string";
    }
    str = str.split('');
    console.log(str);

    for (let i = 0; i < str.length; i++) {
        if (str[0] === ' ') {
            str.shift();
        }
        if (str[str.length - 1] === ' ') {
            str.pop();
        }
    }

    if (str.length > 10) {
        console.log(str.length, str.length - 30);
        str.splice(10, str.length - 10, '...');
    }

    return str.join('');
};

// console.log(checkIfStringWithSlice('       Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello     '));
// console.log(checkIfStringWithSlice(1));

console.log(checkIfStringWithSplit("   Hello World, I'm fine, how are you?    "));
console.log(checkIfStringWithSplit(1));
