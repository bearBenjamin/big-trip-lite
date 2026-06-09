import Observable from '../framework/observable';
import { offersData } from '../mock/point';

export default class OffersModel extends Observable {
  #offers = offersData;

  get offers() {
    return this.#offers;
  }
}
