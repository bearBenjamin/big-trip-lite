import Observable from '../framework/observable';
import { generatePoint } from '../mock/point';

const POINT__COUNT = 4;

export default class PointsModel extends Observable {
  #points = Array.from({ length: POINT__COUNT}, generatePoint);
  #offers = [];
  #destinations = [];

  constructor (offers, destinations) {
    super();
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
