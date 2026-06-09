import PointTripEvent from '../view/point-trip-view';
import FormEditEvent from '../view/form-edit-view';
import { render, replace, remove } from '../framework/render';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #listEventContainer = null;
  #point = null;
  #offers = [];
  #destinations = [];
  #pointComponent = null;
  #formEditComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ listEventComponent, offers, destinations, onDataChange, onModeChange }) {
    this.#listEventContainer = listEventComponent;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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
      onFavoriteBtnClick: () => this.#handleFavoriteClick(),
    });

    this.#formEditComponent = new FormEditEvent({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onFormBtnCloseClick: this.#handleFormBtnCloseClick,
    });

    if (prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#listEventContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formEditComponent, prevFormEditComponent.element);
    }

    remove(prevPointComponent);
    remove(prevFormEditComponent);
  }

  // доступный снаружи метод презентера для уничтожения компонента точки и компонента формы
  destroy() {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  }

  // доступный снаружи метод презентера точки для сброса представления с формы на точку
  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#formEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToForm() {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #handleFavoriteClick = () => {
    // this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite}); // обновляем информацию по ключу Фаворит в точке
    this.#handleDataChange(
      UserAction.UPDATE__POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite}
    );
  };

  #handleFormSubmit = (point) => {
    this.#replaceFormToPoint();
    // this.#handleDataChange(point);
    this.#handleDataChange(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFormBtnCloseClick = () => {
    this.#formEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };
}
