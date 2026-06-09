import Observable from '../framework/observable';
import { destinationsData } from '../mock/point';

export default class DestinationsModel extends Observable {
  #destinations = destinationsData;

  get destinations() {
    return this.#destinations;
  }
}
