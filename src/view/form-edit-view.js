import { createElement } from '../render.js';
import { getCapitalaizedType, formatFormDateTime, getTypeOffers } from '../utils.js';

const createOffersTemplate = (type, offers, offersData) => {
  const currentOffers = getTypeOffers(offersData, type);

  if (!currentOffers || !currentOffers.offers || currentOffers.offers.length === 0) {
    return '';
  }

  const listOffers = currentOffers.offers.map((offer) => {
    const isChecked = offers.includes(offer.id) ? 'checked' : '';
    const item = `<div class="event__offer-selector">
                        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}" type="checkbox" name="event-offer-${offer.id}"  data-offer-id="${offer.id}" ${isChecked}>
                        <label class="event__offer-label" for="event-offer-${offer.id}">
                          <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`;
    return item;
  }).join('');

  const templateSectionOffers = `
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">${listOffers}</div>
                  </section>`;

  return templateSectionOffers;
};

const createPhotosTemplate = (photos) => {
  if (!photos || photos.length === 0) {
    return '';
  }

  const listPhotos = photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join('');

  const templatePhotos = `<div class="event__photos-container">
                      <div class="event__photos-tape">
                        ${listPhotos}
                      </div>
                    </div>`;

  return templatePhotos;
};

const createDescriptionTemplate = (description, pictures) => {

  const hasDescription = Boolean(description && description.length > 0);
  const hasPictures = Boolean(pictures && pictures.length > 0);

  if (!hasDescription && !hasPictures) {
    return '';
  }

  const templateDescription = hasDescription ? `<p class="event__destination-description">${description}</p>` : '';

  const templatePhotos = createPhotosTemplate (pictures);

  const templateSectionDescription = templatePhotos ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    ${templateDescription}
                    ${templatePhotos}
                  </section>` : '';

  return templateSectionDescription;
};

const createOffersTypeListTemplate = (offersData) => {
  const listType = offersData.map((offer) => `<div class="event__type-item">
                          <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}">
                          <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
                        </div>`).join('');

  const templateListType = `<div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${listType}
                        </fieldset>
                    </div>`;

  return templateListType;
};

const createDestinationListTemplate = (destinationsData) => {
  const listCity = destinationsData.map((destination) => `<option value="${destination.name}"></option>`).join('');
  const templateListCity = `<datalist id="destination-list-1">${listCity}</datalist>`;
  return templateListCity;
};


const createTemplate =
  (point, offersData, destinationsData) => {

    const { type, dateFrom, dateTo, price, offers, destination } = point;

    const { name, description, pictures } = destination;

    const capitalizedType = getCapitalaizedType(type);

    const nameCity = name.length !== 0 ? name : '';

    const dateStart = formatFormDateTime(dateFrom);
    const dateEnd = formatFormDateTime(dateTo);

    const templateSectionOffers = createOffersTemplate(type, offers, offersData);

    const templateListType = createOffersTypeListTemplate(offersData);

    const templateListCity = createDestinationListTemplate(destinationsData);

    const templateSectionDescription = createDescriptionTemplate(description, pictures);

    return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    ${templateListType}
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${capitalizedType}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${nameCity}" list="destination-list-1">
                    ${templateListCity}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  ${templateSectionOffers}
                  ${templateSectionDescription}
                </section>
              </form>
            </li>`;
  };

export default class FormEditEvent {
  constructor ({ point, offers, destinations }) {
    this.point = point;
    this.offers = offers;
    this.destinations = destinations;
  }

  getTemplate() {
    return createTemplate(this.point, this.offers, this.destinations);
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
