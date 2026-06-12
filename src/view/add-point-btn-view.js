import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = () => `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
New event</button>`;

export default class BtnAddNewPointView extends AbstractView {
  #hanldeAddPointBtn = null;

  constructor({onClick}) {
    super();
    this.#hanldeAddPointBtn = onClick;

    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#hanldeAddPointBtn();
  };
}
