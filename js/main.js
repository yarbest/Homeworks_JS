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

const renderCard = ({ name, species, gender, birthDay, deathDay, status, actors, photo, movies }) => {
    document.body.insertAdjacentHTML(
        'beforeend',
        `<div class="hero">
            <div class="hero__image-wrap">
                <img class="hero__image" src="dbHeroes-master/${photo}">
            </div>
        </div>
        `
    );
};

getData()
    .then((heroesInfo) => {
        heroesInfo.forEach((heroeInfo) => renderCard(heroeInfo));
    })
    .catch((e) => console.log(e));
