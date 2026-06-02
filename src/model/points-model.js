import { generatePoint } from '../mock/point';

const POINT__COUNT = 4;

export default class PointsModel {
  points = Array.from({ length: POINT__COUNT}, generatePoint);

  constructor (offers, destinations) {
    this.offers = offers;
    this.destinations = destinations;
  }

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }
}
