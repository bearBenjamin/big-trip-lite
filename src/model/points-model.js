import { generatePoint } from '../mock/point';

const POINT__COUNT = 4;

export default class PointsModel {
  #points = Array.from({ length: POINT__COUNT}, generatePoint);
  #offers = [];
  #destinations = [];

  constructor (offers, destinations) {
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }
}
