'use strict';
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
const expensestTitle = document.querySelectorAll('.expenses-title');
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
        item.value = ''; //обнуляем значения у скопированных полей
    }
});

//Добавляем пункты обязательных расходов
expensesAdd.addEventListener('click', () => {
    let newExpensesItems = expensesAdd.previousElementSibling.cloneNode(true);
    expensesAdd.insertAdjacentElement('beforebegin', newExpensesItems);
    for (let item of newExpensesItems.children) {
        item.value = '';
    }
});

//Получаем значение range и меняем значение цифры
periodSelect.addEventListener('input', () => {
    userData.period = periodSelect.value;
    periodAmount.textContent = userData.period;
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
    getTotalIncome();

    getTotalExpenses();
    getDayBudget();

    getAdditionalIncome();
    getAdditionalExpenses();

    getIncomePeriodValue();
    getTargetMonthValue();
});
