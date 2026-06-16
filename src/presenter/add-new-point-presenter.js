import { render, remove, RenderPosition } from '../framework/render';
import { UpdateType, UserAction, EMPTY__POINT } from '../const';
import FormEditEvent from '../view/form-edit-view';
import {nanoid} from 'nanoid';

export default class AddNewPointPresenter {
  #container = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #getOffers = null;
  #getDestinations = null;

  #pointEditComponent = null;

  constructor({container, onDataChange, onDestroy, getOffers, getDestinations}) {
    this.#container = container;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#getOffers = getOffers;
    this.#getDestinations = getDestinations;
  }

  init() {
    if (this.#pointEditComponent !== null) {
      return;
    }

    this.#pointEditComponent = new FormEditEvent({
      point: EMPTY__POINT,
      offers: this.#getOffers(),
      destinations: this.#getDestinations(),

      onFormSubmit: this.#handleFormSubmit,
      onPointDeleteClick: null,
      onFormBtnCloseClick: null,
      onPointCancelClick: this.#handleDeliteClick,
    });

    render(this.#pointEditComponent, this.#container, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#pointEditComponent === null) {
      return;
    }

    this.#handleDestroy(); // разблокирую кнопку добавления точки

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD__POINT,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleDeliteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
