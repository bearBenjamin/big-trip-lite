import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  getCapitalaizedType,
  formatFormDateTime,
  serializeDate,
  getTypeOffers,
} from '../utils/point.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createOffersTemplate = (type, offers, offersData) => {
  const currentOffers = getTypeOffers(offersData, type);

  if (
    !currentOffers ||
    !currentOffers.offers ||
    currentOffers.offers.length === 0
  ) {
    return '';
  }

  const listOffers = currentOffers.offers
    .map((offer) => {
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
    })
    .join('');

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

  const listPhotos = photos
    .map(
      (photo) =>
        `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`,
    )
    .join('');

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

  const templateDescription = hasDescription
    ? `<p class="event__destination-description">${description}</p>`
    : '';

  const templatePhotos = createPhotosTemplate(pictures);

  const templateSectionDescription = templatePhotos
    ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    ${templateDescription}
                    ${templatePhotos}
                  </section>`
    : '';

  return templateSectionDescription;
};

const createOffersTypeListTemplate = (type, offersData) => {
  const listType = offersData
    .map((offer) => {
      const isCheked = type === offer.type ? 'checked' : '';
      const itemList = `<div class="event__type-item">
                          <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}" ${isCheked}>
                          <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${offer.type}</label>
                        </div>`;
      return itemList;
    })
    .join('');

  const templateListType = `<div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${listType}
                        </fieldset>
                    </div>`;

  return templateListType;
};

const createDestinationListTemplate = (destinationsData) => {
  const listCity = destinationsData
    .map((destination) => `<option value="${destination.name}"></option>`)
    .join('');
  const templateListCity = `<datalist id="destination-list-1">${listCity}</datalist>`;
  return templateListCity;
};

const createTemplate = (point, offersData, destinationsData) => {
  const { id, type, dateFrom, dateTo, price, offers, destination, isSubmitDisabled } = point;

  const { name = '', description = '', pictures = [] } = destination || {};

  const capitalizedType = getCapitalaizedType(type);

  const nameCity = name.length !== 0 ? name : '';

  const dateStart = formatFormDateTime(dateFrom);
  const dateEnd = formatFormDateTime(dateTo);

  const templateSectionOffers = createOffersTemplate(type, offers, offersData);

  const templateListType = createOffersTypeListTemplate(type, offersData);

  const templateListCity = createDestinationListTemplate(destinationsData);

  const templateSectionDescription = createDescriptionTemplate(
    description,
    pictures,
  );

  const isNewPoint = !id;
  const resetBtnText = isNewPoint ? 'Cancel' : 'Delete';

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
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateStart}" readonly>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateEnd}" readonly>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
                  <button class="event__reset-btn" type="reset">${resetBtnText}</button>
                  ${
  isNewPoint
    ? ''
    : `<button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                    </button>
                  `
}
                </header>
                <section class="event__details">
                  ${templateSectionOffers}
                  ${templateSectionDescription}
                </section>
              </form>
            </li>`;
};

export default class FormEditEvent extends AbstractStatefulView {
  #offers = [];
  #destinations = [];
  #handleFormSubmitClick = null;
  #handleBtnDeleteClick = null;
  #handleFormBtnCloseClick = null;
  #handleFormBtnCancelClick = null;

  //переменные для хранения инстансов календарей
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({
    point,
    offers,
    destinations,
    onFormSubmit,
    onPointDeleteClick,
    onFormBtnCloseClick,
    onPointCancelClick,
  }) {
    super();
    this._setState(FormEditEvent.parsePointToState(point));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleFormSubmitClick = onFormSubmit;
    this.#handleBtnDeleteClick = onPointDeleteClick;
    this.#handleFormBtnCloseClick = onFormBtnCloseClick;
    this.#handleFormBtnCancelClick = onPointCancelClick;

    this._restoreHandlers();
  }

  get template() {
    return createTemplate(this._state, this.#offers, this.#destinations);
  }

  reset(point) {
    this.updateElement(FormEditEvent.parsePointToState(point));
  }

  // метод удаления элемента календаря
  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers = () => {
    const isNewPoint = !this._state.id;

    if (isNewPoint) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#handleFormBtnCancelClick);
    } else {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#btnDeleteHandler);
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#formBtnCloseHandler);
    }

    this.element
      .querySelector('.event--edit')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element
      .querySelector('.event__type-list')
      .addEventListener('change', this.#typeChangeHandler);
    this.element
      .querySelector('.event__input--price')
      .addEventListener('change', this.#priceChangeHandler);
    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationChangeHandler);

    //Календари пересоздаются при каждом обновлении DOM-элемента
    this.#setDatepickers();
  };

  // метод инициализации flatpickr
  #setDatepickers = () => {
    const dateStartElement = this.element.querySelector(
      '.event__input--time[name="event-start-time"]',
    );
    const dateEndElement = this.element.querySelector(
      '.event__input--time[name="event-end-time"]',
    );

    const commonConfig = {
      enableTime: true,
      'time_24hr': true,
      dateFormat: 'd/m/y H:i',
      allowInput: false,
      disableMobile: true,
    };

    // Настройка для даты начала
    this.#datepickerFrom = flatpickr(dateStartElement, {
      ...commonConfig,
      defaultDate: dateStartElement.value,
      // закоментировал после просмотра открытого урока по ДЗ 7.10
      /* minDate: new Date(), */ // теперь можно выбрать точку в прошлом - хотя, не очень логичное поведение, на мой взгляд
      onChange: this.#dateFromChangeHandler, // метод вызываемый при изменении даты начала
    });

    // Настройка для даты окончания
    this.#datepickerTo = flatpickr(dateEndElement, {
      ...commonConfig,
      defaultDate: dateEndElement.value,
      minDate: dateStartElement.value, // Запрещаю выбирать дату окончания раньше даты начала
      onChange: this.#dateToChangeHandler, // метод вызываемый при изменении даты окончания
    });
  };

  // Обработчик изменения даты начала
  #dateFromChangeHandler = ([userDate]) => {
    if (!userDate) {
      this._setState({
        dateFrom: null,
        isSubmitDisabled: true
      });
      this.element.querySelector('.event__save-btn').disabled = true;
      return;
    }
    // Обновляю минимальную дату для поля окончания события путешествия
    this.#datepickerTo.set('minDate', userDate);

    const isFormInvalid = !this._state.destination || !this._state.destination.name || !userDate || !this._state.dateTo || Number(this._state.price) <= 0;

    // Сохраняю изменение в стейт без перерисовки (ведь инпут уже обновился сам)
    this._setState({
      dateFrom: serializeDate(userDate),
      isSubmitDisabled: isFormInvalid,
    });

    this.element.querySelector('.event__save-btn').disabled = isFormInvalid;
  };

  // Обработчик изменения даты окончания
  #dateToChangeHandler = ([userDate]) => {
    if (!userDate) {
      this._setState({
        dateTo: null,
        isSubmitDisabled: true
      });
      this.element.querySelector('.event__save-btn').disabled = true;
      return;
    }

    const isFormInvalid = !this._state.destination || !this._state.destination.name || !this._state.dateFrom || !userDate || Number(this._state.price) <= 0;

    // Сохраняю изменение в стейт без перерисовки
    this._setState({
      dateTo: serializeDate(userDate),
      isSubmitDisabled: isFormInvalid,
    });

    this.element.querySelector('.event__save-btn').disabled = isFormInvalid;
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const userType = evt.target.value;

    this._setState({
      type: userType,
    });

    this.updateElement({
      type: userType,
      offers: [], // Сбрасываем выбранные офферы, так как у нового типа будут свои опции
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    const userPrice = evt.target.value.trim();
    const isOnlyNumbers = /^\d+$/.test(userPrice);

    const isFormInvalid = !isOnlyNumbers || Number(userPrice) <= 0 || !this._state.destination || !this._state.destination.name || !this._state.dateFrom || !this._state.dateTo;

    this._setState({
      price: isOnlyNumbers ? Number(userPrice) : 0,
      isSubmitDisabled: isFormInvalid,
    });

    this.element.querySelector('.event__save-btn').disabled = isFormInvalid;
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    const userDestinationName = evt.target.value.trim();

    const currentDestination = this.#destinations.find(
      (destination) => destination.name === userDestinationName,
    );

    if (!currentDestination) {
      evt.target.value = '';
      this.updateElement({
        destination: null,
        isSubmitDisabled: true,
      });
    } else {
      const isFormInvalid = !this._state.dateFrom || !this._state.dateTo || Number(this._state.price) <= 0;
      this.updateElement({
        destination: currentDestination,
        isSubmitDisabled: isFormInvalid,
      });
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    // Собираю актуальный массив выбранных офферов
    const checkedBoxes = this.element.querySelectorAll(
      '.event__offer-checkbox:checked',
    );
    const selectedOffers = Array.from(checkedBoxes).map((box) =>
      Number(box.dataset.offerId),
    );

    this._setState({
      offers: selectedOffers,
    });

    if (this._state.isSubmitDisabled) {
      return;
    }

    const updatedPoint = FormEditEvent.parseStateToPoint(this._state);
    this.#handleFormSubmitClick(updatedPoint);
  };

  #btnDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleBtnDeleteClick(FormEditEvent.parseStateToPoint(this._state));
  };

  #formBtnCloseHandler = () => {
    this.#handleFormBtnCloseClick();
  };

  static parsePointToState(point) {
    return { ...point,
      isSubmitDisabled: !point.destination || !point.destination.name || !point.dateFrom || !point.dateTo || Number(point.price) <= 0,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };
    delete point.isSubmitDisabled;
    return point;
  }
}
