'use strict';

const copyData = () => {
    const data = [];

    return async () => {
        if (data.length) return data; //если данные уже есть, то новые не надо
        const response = await fetch('dbHeroes-master/dbHeroes.json');
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        data.push(...(await response.json()));
        return data;
    };
};
const getData = copyData();

const heroesListElem = document.querySelector('.heroes__list');
const filmsListElem = document.querySelector('.select-film');
const heroesTitleElem = document.querySelector('.heroes__title');

const createCard = ({ name, species, gender, birthDay, deathDay, status, actors, photo, movies }) => {
    heroesListElem.insertAdjacentHTML(
        'beforeend',
        `<div class="hero">
            <div class="hero__image-wrap">
                <img class="hero__image" src="dbHeroes-master/${photo}">
            </div>
            <p class="hero__name hero__detail">${name}</p>
            <p class="hero__species hero__detail">Вид: ${species}</p>
            <p class="hero__gender hero__detail">Пол: ${gender}</p>
            <p class="hero__livespan hero__detail">Годы жизни: ${birthDay || 'неизвестно'} - ${deathDay || 'неизвестно'}</p>
            <p class="hero__status hero__detail">Статус: ${status}</p>
            <p class="hero__actors hero__detail">Имя актера: ${actors}</p>
            <p class="hero__movies hero__detail">Фильмы: ${movies ? movies.join(',<br/>') : '-'}</p>
        </div>
        `
    );
};

const insertOptions = (heroesInfo) => {
    const uniqueMoviesList = new Set(); //коллекция для уникальных названий фильмов
    heroesInfo.forEach((heroinfo) => {
        if (heroinfo.movies) uniqueMoviesList.add(...heroinfo.movies);
    });

    filmsListElem.innerHTML = '<li>Выбрать фильм</li> <li data-show-all="true">Показать все фильмы</li>';
    uniqueMoviesList.forEach((uniqueMovie) => filmsListElem.insertAdjacentHTML('beforeend', `<li>${uniqueMovie}</li`));

    filmsListElem.style.height = getComputedStyle(filmsListElem.firstElementChild).height; //задаем высоту закрытого списка, равному высоте однго пунткта
    filmsListElem.parentNode.nextElementSibling.style.marginTop = getComputedStyle(filmsListElem.firstElementChild).height; //так как менюшка спозиционированна абсолютно, то следующий за ней элемент нужно отодвинуть на размер высоты менюшки
};

const filterCards = (movieName, showAll) => {
    if (!movieName) return; //movieName бывает пустым, только если нажали на первый пункт списка, тогда делать ничего не нужно
    heroesListElem.innerHTML = '';
    document.documentElement.scrollTo(0, 0); //прокручиваем страницу на верх
    getData()
        .then((heroesInfo) => {
            heroesInfo.forEach((heroInfo) => {
                if (showAll) {
                    createCard(heroInfo);
                    heroesTitleElem.textContent = `Все герои Marvel`;
                    return;
                }
                if (heroInfo.movies && heroInfo.movies.includes(movieName)) {
                    createCard(heroInfo);
                    heroesTitleElem.textContent = `Герои фильма ${movieName}`;
                }
            });
        })
        .catch((e) => console.log(e));
};

getData()
    .then((heroesInfo) => {
        insertOptions(heroesInfo);
        heroesInfo.forEach((heroInfo) => createCard(heroInfo));
    })
    .catch((e) => console.log(e));

filmsListElem.addEventListener('click', (event) => {
    const target = event.target;
    if (target.tagName !== 'LI') return;
    filmsListElem.classList.toggle('select-film_opened'); //открываем список
    filmsListElem.scrollTo(0, 0); //прокручиваем список фильмов на верх

    //показать всех персонажей. Пункт списка, ответственный за это действие, я пометил дата-атрибутом
    if (target.dataset.showAll === 'true') filterCards(target.textContent, true);
    //если жму на первый пункт списка, где написано Выберите фильм, то ничего не должно происходить, кроме открытия списка
    else if (target === target.closest('.select-film').firstElementChild) filterCards();
    else filterCards(target.textContent);
});

document.addEventListener('click', (event) => {
    console.log(event.target);
    if (!event.target.matches('ul.select-film, ul.select-film li')) {
        filmsListElem.classList.remove('select-film_opened');
        filmsListElem.scrollTo(0, 0);
    }
});

// const ps = new PerfectScrollbar('.select-film', {
//     // wheelSpeed: 2,
//     // wheelPropagation: true,
//     minScrollbarLength: 20,
// });
