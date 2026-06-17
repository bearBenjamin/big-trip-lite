import AbstractView from '../framework/view/abstract-view.js';
import dayjs from 'dayjs';

const getTripRoute = (points, dataDestinations) => {
  const cityNames = points.map((point) => {
    const pointDestination = dataDestinations.find((dataDestination) => dataDestination.id === point.destination);
    return pointDestination ? pointDestination.name : '';
  }).filter(Boolean);

  if (cityNames.length === 0) {
    return '';
  }

  if (cityNames.length <= 3) {
    return cityNames.join(' &mdash; ');
  }

  return `${cityNames[0]} &mdash; &hellip; &mdash; ${cityNames[cityNames.length - 1]}`;
};

const getTripDates = (points) => {
  if (points.length === 0) {
    return '';
  }

  const dateStart = dayjs(points[0].dateFrom);
  const dateEnd = dayjs(points[points.length - 1].dateTo);

  if (dateStart.month() === dateEnd.month()) {
    return `${dateStart.format('MMM D')}&nbsp;&mdash;&nbsp;${dateEnd.format('D')}`;
  }
  return `${dateStart.format('MMM D')}&nbsp;&mdash;&nbsp;${dateEnd.format('MMM D')}`;
};

const getTripTotalPrice = (points, dataOffers) => points.reduce((total, point) => {
  let pointPrice = Number(point.price || 0);

  const offersByType = dataOffers.find((item) => item.type === point.type);

  if (offersByType && point.offers) {
    const selectedOffersPrice = offersByType.offers
      .filter((offer) => point.offers.includes(offer.id))
      .reduce((sum, offer) => sum + offer.price, 0);

    pointPrice += selectedOffersPrice;
  }

  return total + pointPrice;
}, 0);

const createTemplate = (points, dataOffers, dataDestinations) => {
  const route = getTripRoute(points, dataDestinations);
  const dates = getTripDates(points);
  const totalPrice = getTripTotalPrice(points, dataOffers);

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${route}</h1>

              <p class="trip-info__dates">${dates}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
            </p>
          </section>`;
};

export default class TripInfoView extends AbstractView {
  #points = null;
  #dataOffers = [];
  #dataDestinations = [];

  constructor ({ points, dataOffers, dataDestinations }) {
    super();
    this.#points = points;
    this.#dataOffers = dataOffers;
    this.#dataDestinations = dataDestinations;
  }

  get template() {
    return createTemplate(this.#points, this.#dataOffers, this.#dataDestinations);
  }
}
