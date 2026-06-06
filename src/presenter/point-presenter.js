import PointTripEvent from '../view/point-trip-view';
import FormEditEvent from '../view/form-edit-view';
import { render, replace, remove } from '../framework/render';

export default class PointPresenter {
  #listEventContainer = null;
  #point = null;
  #offers = [];
  #destinations = [];
  #pointComponent = null;
  #formEditComponent = null;

  constructor({ listEventComponent, offers, destinations }) {
    this.#listEventContainer = listEventComponent;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;

    this.#pointComponent = new PointTripEvent({
      point: this.#point,
      offers: this.#offers,
      onFormEditBtnClick: () => {
        this.#replacePointToForm();
      },
    });

    this.#formEditComponent = new FormEditEvent({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: () => {},
      onFormBtnCloseClick: () => this.#replaceFormToPoint(),
    });

    if (prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#listEventContainer);
      return;
    }

    console.log('prevPointComponent: ', prevPointComponent);
    console.log('prevFormEditComponent: ', prevFormEditComponent);
    // проверка на наличие в DOM, чтобы не менять не существующий элемент
    if (this.#listEventContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#listEventContainer.contains(prevFormEditComponent.element)) {
      replace(this.#formEditComponent, prevFormEditComponent.element);
    }

    remove(prevPointComponent);
    remove(prevFormEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceFormToPoint();
      // document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #replacePointToForm() {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }
}
