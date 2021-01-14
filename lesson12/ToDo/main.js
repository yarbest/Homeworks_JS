'use strict';
const inputEnterTask = document.querySelector('.enter-task');

const taskBlocks = document.querySelector('.task-blocks');
const unfinishedTasksBlock = document.querySelector('.unfinished-tasks-block');
const finishedTasksBlock = document.querySelector('.finished-tasks-block');

const btnAddTask = document.querySelector('.btn-add-task');
const btnDelTask = document.querySelector('.btn-del-task');
const btnMarkTask = document.querySelector('.btn-mark-task');

let tasks = document.querySelectorAll('.task');

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

//Шаблон дела
const task = document.createElement('div');
task.classList.add('task');
task.insertAdjacentHTML(
    'beforeend',
    `<span class="task-text"></span>
    <button class="btn-del-task">Del</button>
    <button class="btn-mark-task">Mark</button>`
);

//=====================================================================================

//

//=====================================================================================

btnAddTask.addEventListener('click', () => {
    if (inputEnterTask.value === '') {
        return;
    }
    //изначально у нас блоки пустые, и в них добавляется текст заглушка, но если мы добавляем пункт, то заглушку нужно убрать
    const newTask = task.cloneNode(true);
    const taskText = newTask.querySelector('.task-text');
    taskText.textContent = inputEnterTask.value;
    inputEnterTask.value = '';
    unfinishedTasksBlock.append(newTask);
    checkIfBlocksEmpty();

    let unfinishedTasks = document.querySelectorAll('.task:not([class ~= marked])');
    unfinishedTasks = [...unfinishedTasks].map((item) => {
        return item;
    });
    console.log(unfinishedTasks);
    localStorage.setItem('unfinishedTasks', JSON.stringify(unfinishedTasks));
    unfinishedTasks = JSON.parse(localStorage.getItem('unfinishedTasks'));
    console.log(unfinishedTasks);
});

taskBlocks.addEventListener('click', (event) => {
    let myTarget = event.target;
    let myTargetClosest = myTarget.closest('.task');

    if (myTarget.classList.contains('btn-del-task')) {
        myTargetClosest.remove();
        checkIfBlocksEmpty();
    }
    if (myTarget.classList.contains('btn-mark-task') && myTargetClosest.classList.contains('marked') === false) {
        //если у пункта еще нету класса "Отмечено", то этот пункт нужно Отметить и положить в выполненные дела
        myTargetClosest.classList.add('marked');
        finishedTasksBlock.append(myTargetClosest);
        checkIfBlocksEmpty();
    } else if (myTarget.classList.contains('btn-mark-task') && myTargetClosest.classList.contains('marked') === true) {
        //если у пункта есть класс "Отмечено", то этот пункт нужно вернуть в невыполненные дела, и забрать у него Отметину
        myTargetClosest.classList.remove('marked');
        unfinishedTasksBlock.append(myTargetClosest);
        checkIfBlocksEmpty();
    }
    // localStorage.setItem('unfinished-tasks', unfinishedTasks);
});
