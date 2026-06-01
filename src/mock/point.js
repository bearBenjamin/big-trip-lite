import { POINT__TYPE, OFFERS__BY__TYPE, DESTINATIONS_DATA } from '../const';
import { getRandomArrayElement, getRandomInteger, getTypeOffers } from '../utils';
import dayjs from 'dayjs';

const generatePointDates = () => {
  const daysGap = getRandomInteger(-7, 7);
  const hoursGap = getRandomInteger(1, 23);
  const minutesGap = getRandomInteger(1, 59);

  const dateFrom = dayjs()
    .add(daysGap, 'day')
    .add(hoursGap, 'hour')
    .add(minutesGap, 'minute');

  const durationInMinutes = getRandomInteger(30, 300);
  const dateTo = dateFrom.add(durationInMinutes, 'minute');

  return {
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString()
  };
};

const getRandomDestination = (destinations) => {
  const randomCity = getRandomArrayElement(destinations);

  const pictures = randomCity.picturesData.map((description) => ({
    src: `https://loremflickr.com/248/152?random=${Math.random()}`,
    description: description
  }));

  return {
    name: randomCity.name,
    description: randomCity.description,
    pictures: pictures
  };
};

const getRandomOffer = (offers, type) => {
  const currentOffers = getTypeOffers(offers, type); // получаю объект из массива соответствующего типа
  const id = currentOffers.offers // в текущем объекте работаю с содержимым по ключу offers - массивом доп.предложений
    .filter(() => Math.random() > 0.5) // массив доп.предложений фильтрую 50 на 50 (собираю массив из случайных доп.предложений)
    .map((offer) => offer.id); // выбираю из отфильтрованного массива только значения по ключу id;
  return id; // в точке в ключ offers уходят только id доп.предложений если они есть либо пустой массив
};

const generatePoint = (id = Math.random()) => {
  const currentPointType = getRandomArrayElement(POINT__TYPE);
  const dates = generatePointDates();

  return {
    id: id,
    type: currentPointType,
    destination: getRandomDestination(DESTINATIONS_DATA),
    dateFrom: dates.dateFrom,
    dateTo: dates.dateTo,
    price: 20,
    offers: getRandomOffer(OFFERS__BY__TYPE, currentPointType),
    isFavorite: Math.random() > 0.5,
  };
};

export { generatePoint };
