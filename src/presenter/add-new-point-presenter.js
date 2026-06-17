import { render, remove, RenderPosition } from '../framework/render';
import { UpdateType, UserAction, EMPTY__POINT } from '../const';
import FormEditEvent from '../view/form-edit-view';

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

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    if (this.#pointEditComponent === null) {
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    // Трясем форму создания новой точки и разблокируем её обратно
    this.#pointEditComponent.shake(resetFormState);
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
      onPointCancelClick: this.#handleCancelClick,
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
      point,
    );
    // this.destroy();
  };

  #handleCancelClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
