'use strict';
//Шаблон дела
const taskTemplate = document.createElement('div');
taskTemplate.classList.add('task');
taskTemplate.insertAdjacentHTML(
    'beforeend',
    `<span class="task-text"></span>
    <span class='time'>Добавлено: <time></time></span>
    <button class="btn-del-task"><b>Delete</b></button>
    <button class="btn-mark-task"><b>Mark</b></button>`
);
const inputEnterTask = document.querySelector('.enter-task');
const taskBlocks = document.querySelector('.task-blocks');
const unfinishedTasksBlock = document.querySelector('.unfinished-tasks-block');
const finishedTasksBlock = document.querySelector('.finished-tasks-block');
const btnAddTask = document.querySelector('.btn-add-task');
const btnDelTask = document.querySelector('.btn-del-task');
const btnMarkTask = document.querySelector('.btn-mark-task');

let tasks = document.querySelectorAll('.task');

const getCurrentDateTime = () => {
    let date = new Date();
    return `${date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate()}.${
        date.getMonth().toString().length === 1 ? '' + date.getMonth() + 1 : date.getMonth()
    }.${date.getFullYear().toString().length === 1 ? '0' + date.getFullYear() : date.getFullYear()}; ${
        date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()
    }:${date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()}:${
        date.getSeconds().toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds()
    }`;
};

//Получаем инфу о заданиях из хранилища при запуске страницы
let taskData = []; //Массив, в котором хранятся задания в виде объектов
const getTasksFromStorage = () => {
    unfinishedTasksBlock.innerHTML = '';
    finishedTasksBlock.innerHTML = '';

    taskData = JSON.parse(localStorage.getItem('taskData'));
    if (taskData) {
        //если массив не пустой
        taskData.forEach((item) => {
            //в item лежит объект, в котором текст задания и его статус
            const taskFromStorage = taskTemplate.cloneNode(true); //создаем html-объкт с заданием из хранилища
            taskFromStorage.querySelector('.task-text').textContent = item.action; //меняем текст задания исходя из текста, который находится в свойстве объекта
            taskFromStorage.querySelector('time').textContent = item.addedDate;
            if (item.marked === true) {
                //если в хранилище у объкта значение свойства marked === true, то значит это дело было отмечено и его нужно положить
                //в блок с выполненными заданиями
                taskFromStorage.classList.add('marked');
                finishedTasksBlock.append(taskFromStorage);
                if (item.markedDate !== '') {
                    document
                        .querySelector('.time')
                        .insertAdjacentHTML('afterend', `<span class='time-marked'>Выполнено: <time>${item.markedDate}</time></span>`);
                }
            } else {
                unfinishedTasksBlock.append(taskFromStorage); //иначе в невыполненные
            }
        });
    }
};
getTasksFromStorage();

//кладем в localStorage инфу о нашем деле
const setTaskToStorage = (task) => {
    //изначально хранилище пустое, и строка taskData = JSON.parse(localStorage.getItem('taskData'));
    //которая находится выше, запишет в данную переменную - null, а нам нужно чтобы это был []
    //поэтому, если эта переменная равна null, то присваиваем [], иначе оставляем как было
    taskData = taskData === null ? [] : taskData;
    taskData.push({
        action: task.querySelector('.task-text').textContent,
        marked: task.classList.contains('marked') ? true : false, //если пункт отмечен, то в свойство объекта marked записывается true
        addedDate: task.querySelector('time').textContent,
        markedDate: '',
    });
    localStorage.setItem('taskData', JSON.stringify(taskData)); //перезаписываем хранилище
};

//убираем из localStorage инфу о нашем деле
const removeTaskFromStorage = (task) => {
    let indexOfRemovedObject = taskData.findIndex((item, i, arr) => {
        //в item лежит объект
        if (item.action === task.querySelector('.task-text').textContent) {
            //находим в массиве объект, у которого текстовое значение = равно текстовому значению дела, которое хотим удалить
            return true; //в итоге возвращается индекс нужного объекта в массиве
        }
    });
    taskData.splice(indexOfRemovedObject, 1); //убираем из массива заданий, объект(дело), который удалил пользователь
    //перезаписываем хранилище
    localStorage.setItem('taskData', JSON.stringify(taskData));
};

//менянем состояние выполноненности задания в хранилище
//к сожалению, если у нас 2 одинаковые текстовые записи, то маркировка может поменяться только у первого, так как findIndex
//возвращает первое совпадение,
//значит будем сравнивать по ДАТЕ, вплоть до Секунд, врядли же добавят 2 одинаковые записи в ту же Секунд
const changeTaskStatus = (task) => {
    let indexOfChangedObject = taskData.findIndex((item) => {
        //в item лежит объект с инфой о задании
        if (item.addedDate === task.querySelector('time').textContent) {
            //находим в массиве объект, у которого текстовое значение = равно текстовому значению дела, которое хотим изменить
            if (item.markedDate === '' || task.classList.contains('marked')) {
                item.markedDate = getCurrentDateTime();
                // task.querySelector('.time-marked').textContent = item.markedDate;
            }

            return true;
        }
    });
    //меняем маркировку, которая раньше была у дела, внутри хранилища
    if (task.classList.contains('marked')) {
        taskData[indexOfChangedObject].marked = true; //меняем статус текущего объекта(дела)
    } else {
        taskData[indexOfChangedObject].marked = false;
    }
    //
    //перезаписываем хранилище
    localStorage.setItem('taskData', JSON.stringify(taskData));
};

//проверка блоков на пустоту
const checkIfBlocksEmpty = () => {
    //Если дела еще не добавлены, то нужено добавить текст заглушку
    if (unfinishedTasksBlock.children.length === 0) {
        unfinishedTasksBlock.insertAdjacentHTML('beforeend', '<span>No tasks</span>');
    } else {
        //иначе, если дело добавлено, то нужно удалить текст заглушку, которая лежит в span'е
        if (unfinishedTasksBlock.children.length > 1 && unfinishedTasksBlock.firstChild.tagName === 'SPAN') {
            unfinishedTasksBlock.firstChild.remove();
        }
    }
    //для законченных дел то же самое
    if (finishedTasksBlock.children.length === 0) {
        finishedTasksBlock.insertAdjacentHTML('beforeend', '<span>No finished tasks</span>');
    } else {
        if (finishedTasksBlock.children.length > 1 && finishedTasksBlock.firstChild.tagName === 'SPAN') {
            finishedTasksBlock.firstChild.remove();
        }
    }
};
checkIfBlocksEmpty(); //изначально у нас блоки без пунктов, поэтому нужно им добавить текст, что дел еще нет

const addNewTask = () => {
    if (inputEnterTask.value === '') {
        return;
    }
    const newTask = taskTemplate.cloneNode(true);
    newTask.querySelector('.task-text').textContent = inputEnterTask.value;
    newTask.querySelector('time').textContent = getCurrentDateTime();
    inputEnterTask.value = '';
    setTaskToStorage(newTask);
    getTasksFromStorage();
    //изначально у нас блоки пустые, и в них добавляется текст заглушка, но если мы добавляем пункт, то заглушку нужно убрать
    checkIfBlocksEmpty();
};

btnAddTask.addEventListener('click', () => {
    addNewTask();
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addNewTask();
    }
});

taskBlocks.addEventListener('click', (event) => {
    let myTarget = event.target;
    let myTargetClosest = myTarget.closest('.task'); //все задание целиком, вместе текстом и кнопками

    if (myTarget.classList.contains('btn-del-task')) {
        removeTaskFromStorage(myTargetClosest);
        myTargetClosest.remove();
        checkIfBlocksEmpty();
    }

    if (myTarget.classList.contains('btn-mark-task') && myTargetClosest.classList.contains('marked') === false) {
        //если у пункта еще нету класса "Отмечено", то этот пункт нужно Отметить и положить в выполненные дела
        myTargetClosest.classList.add('marked');
        finishedTasksBlock.append(myTargetClosest);
        changeTaskStatus(myTargetClosest);
        getTasksFromStorage();

        checkIfBlocksEmpty();
    } else if (myTarget.classList.contains('btn-mark-task') && myTargetClosest.classList.contains('marked') === true) {
        //если у пункта есть класс "Отмечено", то этот пункт нужно вернуть в невыполненные дела, и забрать у него Отметину
        myTargetClosest.classList.remove('marked');
        unfinishedTasksBlock.append(myTargetClosest);
        changeTaskStatus(myTargetClosest);
        getTasksFromStorage();

        checkIfBlocksEmpty();
    }
});
