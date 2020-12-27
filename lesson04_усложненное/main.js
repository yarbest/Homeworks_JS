'use strict';

const checkIfStringWithSlice = (str) => {
    if (typeof str !== 'string') {
        return "It's not a string";
    }
    console.log(str.split(''));

    for (let i = 0; i < str.length; i++) {
        if (str[0] === ' ') {
            str = str.slice(1);
        }
        if (str[str.length - 1] === ' ') {
            str = str.slice(0, -1);
        }
    }
    console.log(str.split(''));

    return str;
};

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
    return str;
};

// console.log(checkIfStringWithSlice('       Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello     '));
// console.log(checkIfStringWithSlice(1));

console.log(checkIfStringWithSplit('   Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello   '));
console.log(checkIfStringWithSplit(1));
