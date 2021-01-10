'use strict';
//Функция для добавления обработчика с регуляркой Текстовому полю
const addListenerForTextFields = (field) => {
    field.addEventListener('input', () => {
        field.value = field.value.replace(/[^а-яА-Я\.\,\s]/, '');
        //все, что не равно русским буквам и паре символов, сразу превращается в пустую строку при вводе
    });
};

//Функция для добавления обработчика с регуляркой Числовому полю
const addListenerForNumericalFields = (field) => {
    field.addEventListener('input', () => {
        field.value = field.value.replace(/[^0-9]/, '');
        //все, что не равно цифрам, сразу превращается в пустую строку при вводе
    });
};

//Все текстовые поля
const allTextFields = document.querySelectorAll('[placeholder="Наименование"]');
allTextFields.forEach((item) => {
    //каждому полю для текста, добавляем обработчик с регуляркой
    addListenerForTextFields(item);
});

//Все числовые поля
let allNumericalFields = document.querySelectorAll('[placeholder="Сумма"]');
allNumericalFields.forEach((item) => {
    //каждому полю для чисел, добавляем обработчик с регуляркой
    addListenerForNumericalFields(item);
});

//Кнопки
const calculate = document.getElementById('start');
const incomeAdd = document.querySelector('.income_add');
const expensesAdd = document.querySelector('.expenses_add');
//Range
const periodSelect = document.querySelector('.period-select');
const periodAmount = document.querySelector('.period-amount');

//Месячный доход
const monthSalary = document.querySelector('.salary-amount');
//Дополнительные доходы
const incomeTitle = document.querySelector('.income-title');

let incomeAmount = document.querySelectorAll('.income-amount');
//Возможный доход
const additionalIncomeItems = document.querySelectorAll('.additional_income-item');

//Обязательные расходы
// const expensestTitle = document.querySelectorAll('.expenses-title');
let expensesAmount = document.querySelectorAll('.expenses-amount');
//Возможные расходы
const additionalExpensesItem = document.querySelector('.additional_expenses-item');

//checkbox
const depositCheck = document.getElementById('deposit-check');
//Цель
const targetAmount = document.querySelector('.target-amount');

//ПОСЧИТАННЫЕ----------------------------------------------------------------------------
//Доход за месяц
const budgetMonthValue = document.querySelector('.budget_month-value');
//Бюджет на день(свободные деньги)
const budgetDayValue = document.querySelector('.budget_day-value');
//Расход за месяц
const expensesMonthValue = document.querySelector('.expenses_month-value');
//Возможные доходы
const additionalIncomeValue = document.querySelector('.additional_income-value');
//Возможные расходы
const additionalExpensesValue = document.querySelector('.additional_expenses-value');
//Накопления за период
const incomePeriodValue = document.querySelector('.income_period-value');
//Срок достижения цели в месяцах
const targetMonthValue = document.querySelector('.target_month-value');
//-----------------------------------------------------------------------------------------

//объект со всеми данными
let userData = {
    totalIncome: 0,
    dayBudget: 0,
    totalExpenses: 0,
    additionalIncome: [],
    additionalExpenses: [],
    period: 1, //количество месяцев по умолчанию
    accumulationForPeriod: 0,
    targetDeadline: 0,
};

//Добавляем пункты дополнительного дохода
incomeAdd.addEventListener('click', () => {
    let newIncomeItems = incomeAdd.previousElementSibling.cloneNode(true); //копируем блок с двумя инпутами (наименование и сумма), копируемый блок стоит перед кнопкой
    //previousElementSibling игнорирует текстовые элементы, а previousSibling может вернуть нам вместо объекта текстовый узел #text
    incomeAdd.insertAdjacentElement('beforebegin', newIncomeItems); //перед кнопкой вставляем скопированный блок
    for (let item of newIncomeItems.children) {
        //newIncomeItems в этой скопированной коллекции находятся инпут с названием и суммой дохода
        item.value = ''; //обнуляем значения у скопированных полей
    }

    let incomeItems = document.querySelectorAll('.income-items');
    //каждый раз пересобираем коллецию с доп доходами, чтобы проверить сколько их уже у нас
    if (incomeItems.length === 3) {
        //и если их уже 3, то прячем кнопку с добавлением
        incomeAdd.style.display = 'none';
    }

    addListenerForTextFields(newIncomeItems.children[0]); //добавляем новым текстовым полям обработчик с регуляркой
    //так как - newIncomeItems это div, в котором лежит текстовое и числовое поле, то в коллекции его ДЕТЕЙ,
    //под индексом 0 находится инпут для ввода наименования, а под индексом - 1, для числа
    addListenerForNumericalFields(newIncomeItems.children[1]);
});

//Добавляем пункты обязательных расходов
expensesAdd.addEventListener('click', () => {
    let newExpensesItems = expensesAdd.previousElementSibling.cloneNode(true);
    expensesAdd.insertAdjacentElement('beforebegin', newExpensesItems);
    for (let item of newExpensesItems.children) {
        item.value = '';
    }

    let expensesItems = document.querySelectorAll('.expenses-items');
    //каждый раз пересобираем коллецию с hfc[jlfvb], чтобы проверить сколько их уже у нас
    if (expensesItems.length === 3) {
        //и если их уже 3, то прячем кнопку с добавлением
        expensesAdd.style.display = 'none';
    }
    addListenerForTextFields(newExpensesItems.children[0]); //описание в верхнем обработчике
    addListenerForNumericalFields(newExpensesItems.children[1]);
});

//Получаем значение range и меняем значение цифры
periodSelect.addEventListener('input', () => {
    userData.period = periodSelect.value;
    periodAmount.textContent = userData.period;
});

//если поле с зарплатой пустое, то кнопка расчета не рабочая
if (monthSalary.value === '') {
    calculate.setAttribute('disabled', 'disabled');
    calculate.style.opacity = '0.5';
}
//если начинаем туда что-то вводить, то тогда рабочая
monthSalary.addEventListener('input', () => {
    if (monthSalary.value !== '') {
        calculate.removeAttribute('disabled'); //если в строке что-то есть, то кнопка рабочая
        calculate.style.opacity = '1';
    } else {
        calculate.setAttribute('disabled', 'disabled'); //если опять все удалим, то строка опять не рабочая
        calculate.style.opacity = '0.5';
    }
});

//ФУНКЦИИ РАСЧЕТОВ___________________________________________________________________________
const getTotalIncome = () => {
    incomeAmount = document.querySelectorAll('.income-amount');
    //каждый раз пересобираем коллекцию с доходами, так как пользователь мог добавить новый пункт
    userData.totalIncome = 0; //кажды раз обнуляем, так как после каждого расчета, к старому значению суммируется новое
    incomeAmount.forEach((item) => {
        userData.totalIncome += +item.value; //значения внутри value хранятся в виде строки, поэтому их нудно перевести в число
        //добавляем в общий доход значения из дополнительных доходов
    });
    userData.totalIncome += +monthSalary.value;
    //добавляем в общий доход значение из ЗП
    budgetMonthValue.value = userData.totalIncome; //показываем на экране общий доход
};

const getTotalExpenses = () => {
    expensesAmount = document.querySelectorAll('.expenses-amount');
    //каждый раз пересобираем коллекцию с расходами, так как пользователь мог добавить новый пункт
    userData.totalExpenses = 0; //кажды раз обнуляем, так как после каждого расчета, к старому значению суммируется новое
    expensesAmount.forEach((item) => {
        userData.totalExpenses += +item.value;
    });
    expensesMonthValue.value = userData.totalExpenses;
};

const getDayBudget = () => {
    userData.dayBudget = Math.floor((userData.totalIncome - userData.totalExpenses) / 30);
    budgetDayValue.value = userData.dayBudget;
};

const getAdditionalIncome = () => {
    userData.additionalIncome = [];
    //кажды раз обнуляем, так как после каждого расчета, к старому значению добавляется новое
    additionalIncomeItems.forEach((item) => {
        userData.additionalIncome.push(item.value.trim());
    });
    additionalIncomeValue.value = userData.additionalIncome.join(', ');
};

const getAdditionalExpenses = () => {
    userData.additionalExpenses = [];
    //кажды раз обнуляем, так как после каждого расчета, к старому значению добавляется новое
    let tempList = additionalExpensesItem.value.split(', '); //тут храми массив из введенных значений
    tempList.forEach((item, i, arr) => {
        // item = item.replace(item[0], item[0].toUpperCase()); //каждое слово делаем с большой буквы
        userData.additionalExpenses.push(item); //и это слово кладем в массив нашего объекта
    });
    additionalExpensesValue.value = userData.additionalExpenses.join(', '); //выводим на экран
};

const getIncomePeriodValue = () => {
    incomePeriodValue.value = (userData.totalIncome - userData.totalExpenses) * userData.period;
    //считаем, сколько заработаем за указанный период
    periodSelect.addEventListener('input', () => {
        //После нажатии кнопки Рассчитать, при изменения range будет динамически изменяться поле 'Накопления за период'
        incomePeriodValue.value = (userData.totalIncome - userData.totalExpenses) * userData.period;
    });
};

const getTargetMonthValue = () => {
    userData.targetDeadline = Math.ceil(targetAmount.value / (userData.totalIncome - userData.totalExpenses));
    targetMonthValue.value = userData.targetDeadline;
};
//___________________________________________________________________________

//Производим расчет
calculate.addEventListener('click', () => {
    allNumericalFields = document.querySelectorAll('[placeholder="Сумма"]');
    //каждый раз пересобираем коллекцию, так как могли добавить новый пункт, и его нужно тоже поверять на валидность
    allNumericalFields.forEach((item) => {
        if (isNaN(+item.value)) {
            //если в поле для чисел каким-то чудом попадет другой символ, то выведется ошибка
            if (!item.nextElementSibling) {
                //если после инпута ЕЩЕ НЕ стоит ошибка, то только тогда добавляем новую
                //если ошиблик после инпута еще нет, то эта запись item.nextElementSibling вернет false,
                //и условие не выполнится, а нам наоборот нужно, если ошибки еще нет, то нужно добавить ее, поэтому инвертируем запись с помощью !
                let newError = document.createElement('p');
                newError.textContent = 'Тут должны быть только цифры';
                item.insertAdjacentElement('afterend', newError); //вставляем ошибку после инпута в котором произошла ошибка

                newError.style.position = 'absolute';
                newError.style.left = `${item.offsetLeft}px`;
                //позиционируем ошибку от левой стороны экрана на столько пикселей, на сколько отступает слева от экрана инпут с ошибкой
                newError.style.top = `${item.offsetTop + item.clientHeight}px`;
                //позиционируем ошибку от верхней стороны экрана на столько пикселей,
                //на сколько отступает сверху от экрана инпут с ошибкой + высота самого инпута, чтобы ошибка была под ним
                newError.style.color = 'red';
                newError.style.pointerEvents = 'none';
                // clientHeight это свойство объекта, а не свойство css
            }
        } else {
            //если значение инпута допустимо, то ошибку убираем
            if (item.nextElementSibling) {
                //условие - только если после инпута есть ошибка, то ее удаляем
                if (item.nextElementSibling.nodeName === 'P') {
                    item.nextElementSibling.remove();
                } else {
                    return;
                }
            }
        }
    });
    getTotalIncome();

    getTotalExpenses();
    getDayBudget();

    getAdditionalIncome();
    getAdditionalExpenses();

    getIncomePeriodValue();
    getTargetMonthValue();
});
