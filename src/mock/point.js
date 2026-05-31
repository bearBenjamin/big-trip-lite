import { POINT__TYPE, DESCRIPTION, DESTINATION, OFFERS__BY__TYPE } from '../const';
import { getRandomArrayElement } from '../utils';

const getRandomDestination = (events) => {
  const destination = getRandomArrayElement(events);
  const currentDestination = DESCRIPTION.find((item) => item.name === destination);
  return currentDestination;
};

const getRandomOffer = (offers, type) => {
  const currentOffers = OFFERS__BY__TYPE.find((offer) => offer.type === type);
  return currentOffers;
};

const generatePoint = (id) => {
  const currentPointType = getRandomArrayElement(POINT__TYPE);

  return {
    id: id,
    type: currentPointType,
    destination: getRandomDestination(DESTINATION),
    dateFrom: '',
    dateTo: '',
    duration: '',
    price: 20,
    offers: getRandomOffer(OFFERS__BY__TYPE, currentPointType),
  };
};

console.log(generatePoint(Math.random()));
