'use strict';
window.addEventListener('DOMContentLoaded', () => {
    //Таймер
    (function () {
        const leftSecondsFields = document.querySelector('#timer-seconds'),
            leftMinutesFields = document.querySelector('#timer-minutes'),
            leftHoursFields = document.querySelector('#timer-hours'),
            leftDaysFields = document.querySelector('#timer-days');

        let timer = {};
        let deadlineTime = '2021-02-16 12:31:50';
        let interval1; //приходится объявить переменную глобально, так как если я попвтаюсь объявить interval1 в блоке else{},
        //то переменная станет локальной, и ее будет не видно в других местах, поэтому мы не сможем ее удалить внутри функции
        //пожно конечно объявить ее внутри блока else{} при помощи var, тогда ее можно будет увидеть в функции, но не стоит))
        //еще раз, если объявить переменную через let внутри for{} if{} else{}, то ее не будет видно в других местах
        const changeTimeFields = (timer) => {
            leftSecondsFields.textContent =
                timer.leftTimeSeconds.toString().length === 1 ? '0' + timer.leftTimeSeconds : timer.leftTimeSeconds;
            leftMinutesFields.textContent =
                timer.leftTimeMinutes.toString().length === 1 ? '0' + timer.leftTimeMinutes : timer.leftTimeMinutes;
            leftHoursFields.textContent = timer.leftTimeHours.toString().length === 1 ? '0' + timer.leftTimeHours : timer.leftTimeHours;
            leftDaysFields.textContent = timer.leftTimeDays.toString().length === 1 ? '0' + timer.leftTimeDays : timer.leftTimeDays;
        };

        const getLeftTime = () => {
            let now = new Date();
            let deadline = new Date(deadlineTime);
            if (deadline - now < 0) {
                clearInterval(interval1);
                return;
            }
            let leftTimeMilliseconds = deadline - now,
                leftTimeSeconds = Math.floor(leftTimeMilliseconds / 1000) % 60,
                leftTimeMinutes = Math.floor(leftTimeMilliseconds / 1000 / 60) % 60,
                leftTimeHours = Math.floor(leftTimeMilliseconds / 1000 / 60 / 60) % 24,
                leftTimeDays = Math.floor(leftTimeMilliseconds / 1000 / 60 / 60 / 24);
            timer = { leftTimeSeconds, leftTimeMinutes, leftTimeHours, leftTimeDays };

            changeTimeFields(timer);
        };

        let now = new Date();
        let deadline = new Date(deadlineTime);
        //при обновлении страницы сразу проверяется истекшее время
        if (deadline - now < 0) {
            leftSecondsFields.textContent = '00';
            leftMinutesFields.textContent = '00';
            leftHoursFields.textContent = '00';
            leftDaysFields.textContent = '00';
            // timer.textContent = 'Акцмя закончилась';
        } else {
            getLeftTime(); //сразу надо проверить время, не дожидаясь секунды из интервала
            interval1 = setInterval(getLeftTime, 1000);
        }
    })();

    //Меню и навигация
    (function () {
        const menu = document.querySelector('menu');
        const main = document.querySelector('main');
        const btnOpenMenu = document.querySelector('.menu');

        const scrollToBlock = (event) => {
            event.preventDefault();
            // этот elem.getAttribute('href') вернет нам id того блока, на который ведет эта ссылка
            //тут я воспользовался .closest('a') так как event.target иногда может быть img, который вложен в ссылку
            let currentBlock = document.querySelector(event.target.closest('a').getAttribute('href'));

            let currentWindowScroll = window.pageYOffset; //начинаем прокручивать страницу из текущего значения прокрутки, чтобы не телепортироваться

            //Если в данный момент окно прокручено дальше, чем располагается нужный блок, то нужно прокручивать на верх
            //уменьшая значение currentWindowScroll
            if (currentWindowScroll > currentBlock.offsetTop) {
                const scrollAbove = () => {
                    if (currentWindowScroll <= currentBlock.offsetTop) {
                        return; //если докрутили до нужного места, то останавливаемся
                    }
                    currentWindowScroll -= 60;
                    document.documentElement.scrollTo(0, currentWindowScroll); //потихоньку прокручиваем окно
                    requestAnimationFrame(scrollAbove);
                };

                requestAnimationFrame(scrollAbove);
            }

            //Если в данный момент окно прокручено меньше, чем располагается нужный блок то нужно прокручивать вниз
            //увеличивая значение currentWindowScroll
            if (currentWindowScroll < currentBlock.offsetTop) {
                const scrollBellow = () => {
                    if (currentWindowScroll >= currentBlock.offsetTop) {
                        return; //если докрутили до нужного места, то останавливаемся
                    }
                    //Если окно прокручено далеко относительно блока, то нужно быстрее прокручивать,
                    //если не далеко - то медленно
                    //Получилось вообще прикольно, по началу оно быстро приезжает к блоку, но на расстоянии меньше 1000px ЗАМЕДЛЯЕТСЯ!!
                    if (currentBlock.offsetTop - currentWindowScroll > 1000) {
                        currentWindowScroll += 60;
                    } else {
                        currentWindowScroll += 20;
                    }
                    document.documentElement.scrollTo(0, currentWindowScroll); //потихоньку прокручиваем окно
                    requestAnimationFrame(scrollBellow);
                };
                requestAnimationFrame(scrollBellow);
            }
        };

        main.addEventListener('click', (event) => {
            //это для кнопки пролистывания страницы ниже
            if (event.target.closest('a')) {
                scrollToBlock(event);
            }
            //это для кнопки открытия меню
            //тут я воспользовался .closest так как в event.target попадает img который вложен в div.menu
            //и нам нужно добраться именно до div.menu
            if (event.target.closest('.menu')) {
                menu.style.transform = 'translateX(100%)';
                menu.style.transition = '1s';
            }
            //если нажали где-то кроме меню, то его сворачиваем, то есть, где бы мы не нажали в меню,
            //у нас всегда будет это event.target.closest('menu') возвращать само меню,
            //так как у элементов меню есть родительский элемент с тегом menu. А у других нету
            //сделал доп проверку event.target.closest('.menu') !== btnOpenMenu,
            //так как у кнопки открытия меню нет родителя menu,
            //и на ней срабатывало условие скрытия меню
            if (event.target.closest('menu') === null && event.target.closest('.menu') !== btnOpenMenu) {
                menu.style.transform = 'translateX(-101%)';
            }
        });

        menu.addEventListener('click', (event) => {
            //закрытие меню по нажатию на ссылку или крестик
            if (event.target.matches('.close-btn') || event.target.matches('menu > ul > li > a')) {
                menu.style.transform = 'translateX(-101%)';
            }
            //прокручиваем страницу по нажатию на пункт меню
            if (event.target.matches('menu > ul > li > a')) {
                scrollToBlock(event);
            }
        });
    })();

    //Поп-ап
    (function () {
        const popup = document.querySelector('.popup'),
            btnsOpenPopup = document.querySelectorAll('.popup-btn');

        btnsOpenPopup.forEach((elem) => {
            elem.addEventListener('click', () => {
                popup.style.opacity = '0';
                popup.style.display = 'block';
                if (window.screen.width >= 768) {
                    let popupOpacity = 0;
                    const showPopupSlowly = () => {
                        if (popupOpacity >= 1) {
                            return;
                        }
                        popupOpacity += 0.02;
                        popup.style.opacity = `${popupOpacity}`;
                        requestAnimationFrame(showPopupSlowly);
                    };
                    requestAnimationFrame(showPopupSlowly);
                } else {
                    popup.style.opacity = '';
                }
            });
        });

        popup.addEventListener('click', (event) => {
            if (event.target === popup || event.target.matches('.popup-close')) {
                popup.style.display = 'none';
            }
        });
    })();

    //Tabs
    (function () {
        const tabHeaderBlock = document.querySelector('.service-header'),
            tabsHeader = tabHeaderBlock.querySelectorAll('.service-header-tab'),
            tabsContent = document.querySelectorAll('.service-tab');

        tabHeaderBlock.addEventListener('click', (event) => {
            //если в event.target попадет сам заголовок таба с классом .service-header-tab,
            //то метод closest нам его и вернет, и если в event.target попадет спан, вложенный в заголовок
            //то нам так же вернется заголовок
            let target = event.target.closest('.service-header-tab');

            //проходимся по колекции заголовков табов, чтобы получить индекс того заголовка
            //на который нажали.
            //Так как именно по этому индексу будем показывать нужный tabsContent
            tabsHeader.forEach((item, i) => {
                //пробегаемся по заголовкам и если текущий заголовок равняется target(тут лежит заголовок, на который нажали),
                //то этому заголовку дается класс active, а tabsContent, у которого такой же индекс,
                //что и у заголовка на который мы нажали забирается класс d-none, НО остальным tabsContent
                //нужно дать этот класс
                if (item === target) {
                    //показываем нужный tabsContent и скрываем остальные, у которых индекс не соответствует
                    //индексу заголовка, на который нажали
                    tabsContent.forEach((item, j) => {
                        //Тут i это индекс заголовка, на который нажали
                        if (i !== j) item.classList.add('d-none');
                        else tabsContent[i].classList.remove('d-none');
                    });

                    tabsHeader.forEach((item, j) => {
                        //Тут i это индекс заголовка, на который нажали, пробегаемся по всем заголовкам
                        //и если индекс заголовка не соответствует индексу заголовка, на который нажали,
                        //то забыраем у него active
                        if (i !== j) item.classList.remove('active');
                        else item.classList.add('active');
                    });
                }
            });
        });
    })();

    //Slider
    (function () {
        const sliderBlock = document.querySelector('.portfolio-content'),
            slides = sliderBlock.querySelectorAll('.portfolio-item');

        let currentSlideIndex = 0;
        let intervalPlayingSlides; //эта переменная будет использоваться в разных функциях, поэтому ее нужно объявить за ранее
        let dots;
        let dotsBlock = sliderBlock.querySelector('.portfolio-dots');

        const goToNextSlide = () => {
            slides[currentSlideIndex].classList.remove('portfolio-item-active');
            currentSlideIndex++;
            //проверка, если мы находимся на последнем слайде и продолжить листать в право, то нужно начать с начала
            if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
            slides[currentSlideIndex].classList.add('portfolio-item-active');
        };

        const goToPrevSlide = () => {
            slides[currentSlideIndex].classList.remove('portfolio-item-active');
            currentSlideIndex--;
            //проверка, если мы находимся на первом слайде и продолжить листать в лево, то нужно начать с конца
            if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
            slides[currentSlideIndex].classList.add('portfolio-item-active');
        };

        const changeActiveDot = () => {
            dots.forEach((element, i) => {
                //точка может быть активной, только если ее индекс равен активному слайду!!!
                if (i === currentSlideIndex) {
                    element.classList.add('dot-active');
                    //все остальные точки делаем не активными
                    dots.forEach((element, j) => {
                        if (i !== j) element.classList.remove('dot-active');
                    });
                }
            });
        };

        const setDotsToBlock = () => {
            for (let i = 0; i < slides.length; i++) {
                dotsBlock.insertAdjacentHTML('beforeend', '<li class="dot"></li>');
            }
            dots = sliderBlock.querySelectorAll('.dot'); //собираем коллекцию, после того, как точки подобавляли
            changeActiveDot();
        };
        setDotsToBlock(); //сразу при запуске страницы добавляем точки, основываясь на кол-ве слайдов

        const startPlayingSlides = () => {
            intervalPlayingSlides = setInterval(() => {
                goToNextSlide();
                changeActiveDot();
            }, 2000);
        };
        startPlayingSlides();

        const pausePlayingSlides = () => {
            clearInterval(intervalPlayingSlides);
        };

        sliderBlock.addEventListener('click', (event) => {
            event.preventDefault();
            let target = event.target;
            if (target.matches('.next')) {
                goToNextSlide();
                changeActiveDot();
            } else if (target.matches('.prev')) {
                goToPrevSlide();
                changeActiveDot();
            } else if (target.matches('.dot')) {
                dots.forEach((element, i) => {
                    //если точка соответствует той точке, на которую нажали, то ее нужно покрасить, а остальные окраски убрать
                    if (element === target) {
                        element.classList.add('dot-active');
                        //стираем окраску остальных точек
                        dots.forEach((element, j) => {
                            if (i !== j) element.classList.remove('dot-active');
                        });
                        //так же меняем активный слайд. Прошлый слайд делаем не активным
                        slides[currentSlideIndex].classList.remove('portfolio-item-active');
                        //i - это индекс точки, на которую нажали
                        currentSlideIndex = i;
                        //а активным делаем слайд с таким индексом, что и у точки на которую нажали
                        slides[currentSlideIndex].classList.add('portfolio-item-active');
                    }
                });
            }
        });

        sliderBlock.addEventListener('mouseover', (event) => {
            if (event.target.matches('.prev, .next, .dot')) {
                pausePlayingSlides();
            }
        });

        sliderBlock.addEventListener('mouseout', (event) => {
            if (event.target.matches('.prev, .next, .dot')) {
                startPlayingSlides();
            }
        });
        /*
        События mouseover/out возникают, даже когда происходит переход с родительского элемента на потомка. 
        С точки зрения браузера, курсор мыши может быть только над одним элементом в любой момент времени – над самым глубоко вложенным.
        События mouseenter/leave в этом отличаются. Они генерируются, когда курсор переходит на элемент в целом или уходит с него. 
        Также они не всплывают. 
        */
    })();

    //Смена фоток при наведении, через Дата-атрибуты
    (function () {
        let command = document.getElementById('command');

        command.addEventListener('mouseover', (event) => {
            let target = event.target;
            if (target.matches('.command__photo')) {
                let initialImg = target.getAttribute('src'); //создаем временную переменную, чтобы не потерять исходный адрес картинки
                // let initialImg = target.src; // можно было бы записать и так, вот только в свойстве объекта src ссылка хранится в абсолютном виде, то есть так http://127.0.0.1:5500/images/command/command-1.jpg
                //но при помощи .getAttribute('src') мы получаем такое значение, которое записано в атрибуте HTML элемента, а там оно записано в относительном виде images/command/command-1.jpg

                target.setAttribute('src', `${target.dataset.img}`); //меняем картинку на значение из дата-атрибута, они каждый раз чередуются
                target.dataset.img = initialImg; //меняем значение дата-атрибута на ее начальное значение
            }
        });

        command.addEventListener('mouseout', (event) => {
            let target = event.target;
            if (target.matches('.command__photo')) {
                let initialImg = target.getAttribute('src'); //создаем временную переменную, чтобы не потерять исходный адрес картинки
                target.setAttribute('src', `${target.dataset.img}`); //меняем картинку на значение из дата-атрибута, они каждый раз чередуются
                target.dataset.img = initialImg; //меняем значение дата-атрибута
            }
        });
    })();

    //Регулярки для ввода только чисел в форму
    //в этом не было смысла, так как можно было просто поставить type='number'
    (function () {
        let calcItem = [...document.querySelectorAll('.calc-item')].slice(1); //скипаем первый элемент, так как там select, а не инпут

        calcItem.forEach((item) => {
            item.addEventListener('input', (event) => {
                event.target.value = event.target.value.replace(/\D/g, '');
            });
        });
    })();

    //Калькулятор
    (function (price = 100) {
        const calcBlock = document.querySelector('.calc-block'),
            calcType = document.querySelector('.calc-type'),
            calcSquare = document.querySelector('.calc-square'),
            calcCount = document.querySelector('.calc-count'),
            calcDay = document.querySelector('.calc-day'),
            totalValue = document.querySelector('#total');

        let currentNumber = 0; //currentNumber нужен для анимации

        const animateSum = (total, currentNumber) => {
            if (currentNumber >= total) {
                totalValue.textContent = total;
                return;
            }
            //если результат большой, то нужно чтобы быстрее изменялись числа
            if (total > 20000) {
                currentNumber += 1111;
            } else if (total > 4000) {
                currentNumber += 111;
            } else {
                currentNumber += 20;
            }
            totalValue.textContent = currentNumber;

            requestAnimationFrame(() => {
                animateSum(total, currentNumber);
            });
        };

        const countSum = () => {
            let total = 0;
            let dayValue;
            let roomsValue;
            let typeValue = +calcType.options[calcType.options.selectedIndex].value; //у HTML-элемента select есть свойство options, там лежат все варианты этого селекта, а так же индекс выбранного варианта
            let squareValue = +calcSquare.value;

            let roomsAmount = +calcCount.value === 0 ? 1 : +calcCount.value; //если поле с комнатами пустое, то по умолчанию конмната одна
            let dayAmount = +calcDay.value === 0 ? 10 : +calcDay.value; //если кол-во дней не введено, то по умолчанию 10 дней

            roomsValue = roomsAmount > 1 ? roomsAmount / 2.5 : 1; //к примеру, 10 комнат увеличат стоимость в 4 раза

            if (dayAmount < 5) {
                dayValue = 2; //если дней меньше 5, то стоимость нужно поднять в 2 раза
            } else if (dayAmount < 10) {
                dayValue = 1.5;
            } else {
                dayValue = 1;
            }

            total = Math.floor(price * typeValue * squareValue * roomsValue * dayValue);
            requestAnimationFrame(() => {
                animateSum(total, currentNumber); //currentNumber нужен для анимации
            });
        };

        calcBlock.addEventListener('change', (event) => {
            let target = event.target;

            if (target.matches('.calc-type, .calc-square, .calc-count, .calc-day')) {
                countSum();
            }
        });
    })(100);

    //send-ajax-form
    (function () {
        const errorMessage = 'Этот сервер не поддерживает отправку данных';
        const loadMessage = 'Загрузка...';
        const succesMessage = 'С вами скоро свяжутся';

        const forms = document.querySelectorAll('form');

        const statusMessage = document.createElement('div');
        statusMessage.style.cssText = 'font-size: 2rem; color: white;';

        forms.forEach((form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                // if (/[a-z]/gi.test(form.querySelector('.form-email').value) === true) {
                //     alert('Имя должно состоять только из кириллицы');
                //     return;
                // }
                if (/(\w+\.?)+@(\w+\.?)+\w{2,}/g.test(form.querySelector('.form-email').value) === false) {
                    alert('Не правильный формат почты');
                    return;
                }
                if (/\+38\(\d\d\d\)\d\d\d-\d\d-\d\d/g.test(form.querySelector('.form-phone').value) === false) {
                    alert('Не правильные данные телефона');
                    return;
                }
                console.log(form.querySelector('.form-phone').value);

                form.append(statusMessage);
                statusMessage.textContent = loadMessage;

                const formData = new FormData(form); //у элементов формы есть атрибуты name и value
                //и вот внутри formdata эти данные хранятся в таком виде, [ ["name1", "value1"], ["user_phone", "09998887766"] ]
                //но чтобы их увидеть, нужно написать следующее: [...formData.entries()]
                form.reset(); //очищаем поля
                let body = {};
                for (let val of formData.entries()) {
                    body[val[0]] = val[1]; //перегоняем данные из formData в объект, чтобы потом его передать в виде JSON
                }

                postData(
                    body,
                    () => {
                        statusMessage.textContent = succesMessage;
                    },
                    (error) => {
                        statusMessage.textContent = errorMessage;
                        console.error(error);
                    }
                );
            });
        });

        const postData = (body, outputData, errorData) => {
            const request = new XMLHttpRequest();

            request.addEventListener('readystatechange', () => {
                //событие readystatechange происходит, когда меняется значение readyState
                if (request.readyState !== 4) return; //если readyState === 4, то сообщение дошло
                if (request.status === 200) {
                    // status === 200 показывает, что все прошло без ошибок
                    outputData();
                } else {
                    errorData(request.status);
                }
            });

            request.open('POST', '/server.php');
            //если захотим передавать данные не через JSON, а через formData, то вместо application/json нужно написать multipart/form-data, это зависит от сервера
            request.setRequestHeader('Content-Type', 'application/json');

            request.send(JSON.stringify(body));
        };

        // const formNames = document.querySelectorAll('.form-name');
        // formNames.forEach((inputName) => {
        //     inputName.addEventListener('input', () => {
        //         inputName.value = inputName.value.replace(/[^а-яё]/gi, '');
        //     });
        // });

        // const formEmails = document.querySelectorAll('.form-email');
        // formEmails.forEach((inputEmail) => {
        //     inputEmail.addEventListener('input', () => {
        //         inputEmail.value = inputEmail.value.replace(/[^(\w+\.?)+@(\w+\.?)+\w{2,}]/gi, '');
        //     });
        // });
    })();
});
