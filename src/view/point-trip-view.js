import { createElement } from '../render.js';
import {
  humanazePointDueDate,
  formatMachineDate,
  formatMachineTime,
  humanizePointTime,
  getEventDuration,
  getTypeOffers,
} from '../utils.js';
import { OFFERS__BY__TYPE } from '../const.js';

const createOffersTemplate = (type, offers) => {
  const currentOffers = getTypeOffers(OFFERS__BY__TYPE, type);
  const chosenOffers = currentOffers.offers.filter((offer) =>
    offers.includes(offer.id), // здесь offers - это предложения из point, которую сейчас отрисовываем
  );

  let listOffers;

  if (chosenOffers.length === 0) {
    listOffers = '';
  } else {
    listOffers = chosenOffers.map((offer) => `
                  <li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </li>`);
  }

  const offersTemplate = listOffers.length === 0 ? '' : `<h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">${listOffers.join('')}</ul>`;

  return offersTemplate;
};

const createTemplate = (point) => {
  const { type, destination, dateFrom, dateTo, price, offers, isFavorite } = point;
  const { name } = destination;

  // блок работы с датой и временем
  const machineDate = formatMachineDate(dateFrom);
  const date = humanazePointDueDate(dateFrom);

  const machineStartTime = formatMachineTime(dateFrom); // "2019-03-18T10:30"
  const humanStartTime = humanizePointTime(dateFrom); // "10:30"

  const machineEndTime = formatMachineTime(dateTo); // "2019-03-18T11:00"
  const humanEndTime = humanizePointTime(dateTo); // "11:00"

  const durationDate = getEventDuration(dateFrom, dateTo);

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  // блок работы с offers
  const offersTemplate = createOffersTemplate(type, offers);

  // блок работы с избранным
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${machineDate}">${date}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${capitalizedType} ${name}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${machineStartTime}">${humanStartTime}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${machineEndTime}">${humanEndTime}</time>
                  </p>
                  <p class="event__duration">${durationDate}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                ${offersTemplate}
                <button class="event__favorite-btn ${favoriteClassName}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

export default class PointTripEvent {
  constructor({ point }) {
    this.point = point;
  }

  getTemplate() {
    return createTemplate(this.point);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
