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
        const btnOpenMenu = document.querySelector('.menu');
        const btnCloseMenu = document.querySelector('.close-btn');
        const menu = document.querySelector('menu');
        const main = document.querySelector('main');

        const menuLinks = [...menu.querySelectorAll('ul > li > a'), main.querySelector('[href*=service-block]')];

        menuLinks.forEach((elem) => {
            elem.addEventListener('click', () => {
                menu.style.transform = 'translateX(-100%)';
                setTimeout(() => {
                    menu.classList.remove('active-menu');
                }, 1000); //убираем класс не сразу, чтобы transition из этого класса успел отработать
            });

            elem.addEventListener('click', (e) => {
                e.preventDefault();
                const currentBlock = document.querySelector(elem.getAttribute('href')); // это elem.getAttribute('href') вернет нам id того блока, на который ведет эта ссылка
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
            });
        });

        btnOpenMenu.addEventListener('click', () => {
            menu.style.transform = '';
            menu.classList.add('active-menu');
        });
        btnCloseMenu.addEventListener('click', () => {
            menu.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                menu.classList.remove('active-menu');
            }, 700);
        });
    })();
    //Поп-ап
    (function () {
        const popup = document.querySelector('.popup'),
            btnsOpenPopup = document.querySelectorAll('.popup-btn'),
            btnClosePopup = document.querySelector('.popup-close');

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
                        console.log(popupOpacity);
                        requestAnimationFrame(showPopupSlowly);
                    };
                    requestAnimationFrame(showPopupSlowly);
                } else {
                    popup.style.opacity = '';
                }
            });
        });

        btnClosePopup.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    })();
});
/*
// Добрый день (утро, вечер, ночь в зависимости от времени суток)
// Сегодня: Понедельник
// Текущее время:12:05:15 PM
// До нового года осталось 175 дней

// let date = new Date();
// let newYear = new Date(`${date.getFullYear() + 1}`);
// //задаем новую дату, взяв текущий год и прибавив к нему 1, нужно передавать значение строкой,
// //так как если передать числом, но он воспримет это как миллисекунды

// const getTimeOfDay = () => {
//     let morning = ['05', '06', '07', '08', '09', '10', '11'],
//         day = ['12', '13', '14', '15'],
//         evening = ['16', '17', '18', '19', '20', '21', '22'],
//         night = ['23', '00', '01', '02', '03', '04'];

//     let timesOfDay = {
//         Утро: morning,
//         День: day,
//         Вечер: evening,
//         Ночь: night,
//     };

//     for (let timeOfDay in timesOfDay) {
//         if (timesOfDay[timeOfDay].includes(date.toLocaleTimeString().slice(0, 2))) {
//             console.log('Добрый ' + timeOfDay);
//         }
//     }
// };

// // console.log('До нового года ' + Math.floor((newYear - date) / 1000 / 60 / 60 / 24) + ' дней!');
// // console.log(
// //     `Текущее время ${date.toLocaleTimeString()} ${
// //         date.toLocaleTimeString().slice(0, 2) === '10' || date.toLocaleTimeString().slice(0, 2) === '11'
// //             ? 'AM'
// //             : date.toLocaleTimeString()[0] === '1' || date.toLocaleTimeString()[0] === '2'
// //             ? 'PM'
// //             : 'AM'
// //     }`
// // );
// // getTimeOfDay();

// let menu = document.querySelector('menu');
// console.log(menu.style.transform);
// console.log(getComputedStyle(menu).transform);
*/
