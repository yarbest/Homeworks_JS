'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted, todoContainer) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoContainer = document.querySelector(todoContainer);
        //при каждом обновлении страницы мы берем из хранилища данные о заданиях и записываем в коллекцию
        //и потом с данными из этой коллекции работаем!!!
        //в хранилище данные хранятся в таком виде: [[ключ, значение], [ключ, значение]], как раз такой вид подходит для MAP
        this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
    }

    addToStorage() {
        //используем spread, чтобы коллекцию превратить в массив массивов, что бы можно было в JSON преобразовать
        //было так: { 0: {key: 'a', value: 1}, 1: {key: b, value: 2} }
        //а станет так [ ['a', 1], ['b', 2] ]
        localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    //тут проходимся по всем записям в коллекции, и для каждой из них вызываем метод createItem,
    //а так же каждую запись добавляем в хранилище
    //то есть, он обновляет записи на странице и в хранилище
    render() {
        //так как мы перебираем todoData, то внутри forEach первым аргументом element будет идти значение
        //из этой итерируемой коллекции, а именно объкты newTodo, то есть в функцю createItem
        //на каждой итерации передается объект newTodo из коллекции todoData
        //так как при переборе Map через forEach в качестве первого аргумента element подставляется
        //значение этого Map ,а вот вместо index подставляется сам ключ
        //----------------------------
        //!!!!this.todoData.forEach(this.createItem);// если мы будем так вызывать createItem,
        //то из-за forEach мы потеряем наш this, можно решить 3 способами:
        //1) В forEach передать втор ой аргумент this: this.todoData.forEach(this.createItem, this) самый простой, описан в моем конспекте
        //2) Сделать анонимную стрелочную функцию, внтутри которой уже вызывать createItem:
        //this.todoData.forEach((element) => { this.createItem(element) })
        //таким образом this для стрелочной функции будет браться из внешней функции - render
        //3) Сделать саму функцию createItem стрелочной
        this.todoList.textContent = ''; //чтоб не дублировалось
        this.todoCompleted.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    //Добавление задания на страницу
    createItem(todoInfo) {
        //todoInfo - это объект newTodo из Map коллекции todoData
        const li = document.createElement('li');
        //по этому ключу будем удалять из хранилища то задание, на котором нажали иконку удаления, тут свойство key может иметь любое название
        //так как HTML-элемент - это тоже объект, значит мы можем добавить ему новое свойство
        li.key = todoInfo.key;
        li.completed = todoInfo.completed;
        li.classList.add('todo-item');
        li.insertAdjacentHTML(
            'beforeend',
            `<span class="text-todo">${todoInfo.value}</span>
            <div class="todo-buttons">
                <button class="todo-edit"></button>
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>`
        );
        if (todoInfo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    //добавляем данные о задании в коллекцию и вызываем метод render
    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false, //при добавлении, задание изначально не выполнено
                key: this.generateKey(),
            };
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else {
            alert('Поле с заданием пустое');
        }
        this.input.value = '';
    }

    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    deleteTask(target) {
        let currentTask = target.closest('.todo-item'); //тут лежит простая li
        let animationDone = false; //флаг для проверки, была ли анимация, чтобы не было бесконечного цикла
        const deleteTaskWithAnimation = () => {
            if (animationDone) {
                return; //условие выхода, иначе получается бесконечный цикл, но его не возможно было заметить
            }
            currentTask.style.cssText = 'position: relative; transition: transform 1s; transform: translateX(100%)';

            animationDone = true; //меняем значение флага, прошла ли анимация хоть раз, если да, то в начале функции есть проверка
            requestAnimationFrame(deleteTaskWithAnimation);
        };
        requestAnimationFrame(deleteTaskWithAnimation);

        //удаляем задание из коллекции, а затем со страницы и хранилища только тогда, когда закончится анимация удаления дела
        setTimeout(() => {
            //получаем уникальный ключ, который сспрятан в HTML-элементе li, по которому найдем в коллекции задание,
            //которое нужно удалить
            let keyOfDeletedItem = currentTask.key;
            [...this.todoData.keys()].forEach((item) => {
                if (item === keyOfDeletedItem) {
                    //находим в коллекции запись, у которой ключ === ключу задания на котором нажали кнопку удаления. И удаляем эту запись из коллекции
                    this.todoData.delete(keyOfDeletedItem);
                    this.render(); //эта функция обновит все задания на странице и в хранилище
                }
            });
            //можно еще так,  this.todoData.forEach((item, i) => {console.log(i);});
            //i - это ключи коллекции, а item - значения (в данном случае объкт newTodo):
        }, 1000);
    }

    completeTask(target) {
        let currentTask = target.closest('.todo-item'); //тут лежит простая li
        let currentTaskOffest = currentTask.offsetTop;

        const completeTaskWithAnimation = () => {
            //если задание еще не выполнено, то анимация перемещения в низ
            //у li помимо свойства key, так же есть completed
            if (currentTask.completed === false) {
                //когда выполняем задание, то оно едет вниз до самого диза выполенных заданий
                if (currentTaskOffest >= this.todoCompleted.offsetTop + this.todoCompleted.offsetHeight) {
                    return;
                }
                currentTaskOffest += 30; //опускаем увеличивая top
                currentTask.style.cssText = `position: absolute; transition: top 0.6s; left: 0; top: ${currentTaskOffest}px; z-index:1`;
            } else if (currentTask.completed === true) {
                //когда убираем отметку о выполнении, то задание едет вверх и отстанавливается когда будет выше списка НЕ выполненных заданий
                //так как у todoCompleted есть position:relative, то значение offsetTop у его потомков считается относительно этого списка, а не относительно body
                if (currentTaskOffest <= -(this.todoCompleted.offsetTop - this.todoList.offsetTop)) {
                    //тут будут получаться отрицательные значения у currentTaskOffest, так как у нас отступ считается от верха списка с выполненными заданиями так как у него есть позиционирование
                    //а нам нужно поднять текущее задание выше этого списка, соответственно top должен быть отрицательным
                    return;
                }
                currentTaskOffest -= 30; //поднимаем на верх
                currentTask.style.cssText = `position: absolute; transition: top 0.6s; left: 0; top: ${currentTaskOffest}px; z-index:1`;
            }

            requestAnimationFrame(completeTaskWithAnimation);
        };
        requestAnimationFrame(completeTaskWithAnimation);

        //меняем статус задания в коллекции и хранилище, когда закончится анимация перемещения дела
        setTimeout(() => {
            //получаем уникальный ключ, который сспрятан в HTML-элементе, по которому найдем в коллекции задание, которое нужно изменить
            let keyOfChangedItem = currentTask.key;
            [...this.todoData.keys()].forEach((item) => {
                if (item === keyOfChangedItem) {
                    //получаем доступ к объекту в котором хранится инфа о задании: его текст, статус и ключ
                    //и инвертируем его статус
                    this.todoData.get(keyOfChangedItem).completed = !this.todoData.get(keyOfChangedItem).completed;
                    this.render(); //эта функция обновит все задания на странице и в хранилище
                }
            });
        }, 1000);
    }

    //изменяет текст задания
    editTaskText(target) {
        let textTodo = target.closest('.todo-item').querySelector('.text-todo'); //получаем доступ к полю с текстом
        textTodo.setAttribute('contenteditable', 'true'); //делаем его изменяемым
        textTodo.classList.add('text-todo-edit');
        //если у нас уже высветилась 1 кнопка сохранения, то остальные не плоди
        if (textTodo.nextElementSibling.matches('.save-edited')) {
            return;
        } else {
            textTodo.insertAdjacentHTML('afterend', '<span class="save-edited">Сохранить</span>');
        }
    }

    //сохраняет изменения и перезаписывает хранилище
    saveEditedTodo(target) {
        let currentTask = target.closest('.todo-item');
        let textTodo = currentTask.querySelector('.text-todo'); //получаем доступ к полю с текстом
        textTodo.removeAttribute('contenteditable'); //запрещаем изменять
        textTodo.classList.remove('text-todo-edit');
        target.closest('.save-edited').remove(); //убираем кнопку сохранения

        [...this.todoData.keys()].forEach((item) => {
            if (item === currentTask.key) {
                //заменяем текст задания в коллекции
                //currentTask.firstChild тут лежит span с текстом задания, во втором child лежит кнопка сохранения
                this.todoData.get(item).value = currentTask.firstChild.textContent;
            }
        });

        this.addToStorage();
    }

    //определяет что мы делаем с заданием: удаляем или выполняем и т.д.
    handler(e) {
        let target = e.target;
        if (target.matches('.todo-remove')) {
            this.deleteTask(target);
        } else if (target.matches('.todo-complete')) {
            this.completeTask(target);
        } else if (target.matches('.todo-edit')) {
            this.editTaskText(target); //по кнопке карандаша, для вызова редактирования
        } else if (target.matches('.save-edited')) {
            this.saveEditedTodo(target); //сохранить отредактированное
        }
    }

    init() {
        //this.form.addEventListener('submit', this.addTodo);
        //в таком виде в метод addTodo в качестве this будет подставляться форма, так как на ней сработал обработчик
        //Пруф или learnJS: так как this = event.currentTarget, всегда будет элемент <form>, так как обработчик сработал на ней.
        //еще пруф: event.currentTarget (=this) – элемент, на котором в данный момент сработал обработчик (тот, на котором «висит» конкретный обработчик)
        //поэтому нужно контекст метода addTodo связать с текущим объектом
        this.form.addEventListener('submit', this.addTodo.bind(this)); //связываем текущий this(объект todo) при помощи bind, так как нам не нужно сразу вызывать метод, как бы это сделал apply, call
        //------------------------------------------------------------
        //а вот другой способ, без bind. Создаем анонимную СТРЕЛОЧНУЮ функцию и уже в ней вызывваем нужный метод
        //так стрелочная функция возьмет this из внешнего окружения, и this будет равняться объекту todo,
        //а не HTML-элементу на котором СРАБОТАЛ ОБРАБОТЧИК!!
        //только теперь event нужно явно передать
        this.todoContainer.addEventListener('click', (e) => {
            this.handler(e);
        });

        this.render(); //при обновлении страницы нужно пройтись по записям из коллекции и каждую запись добавить на экран
    }
}
const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();
