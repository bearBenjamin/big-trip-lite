import ListTripEvents from '../view/list-trip-view.js';
import PointTripEvent from '../view/point-trip-view.js';
import FormEditEvent from '../view/form-edit-view.js';
import { render, replace } from '../framework/render.js';
import SortView from '../view/sort-view.js';

export default class ListPresenter {
  #listContainer = null;
  #pointsModel = {};
  #sortComponent = new SortView();
  #listEventComponent = new ListTripEvents();
  #listPoints = [];
  #listOffers = [];
  #listDestinations = [];

  constructor({ container, pointsModel }) {
    this.#listContainer = container; // container - tripEventsContainer приходит из точки входа - контейнер для списка точек путешествия;
    this.#pointsModel = pointsModel; // массив точек путешествия;
  }

  init() {
    // делаю копию массива точек, чтобы случайно не мутировать данные - это временное решение
    this.#listPoints = [...this.#pointsModel.points];
    this.#listOffers = [...this.#pointsModel.offers];
    this.#listDestinations = [...this.#pointsModel.destinations];

    render(this.#sortComponent, this.#listContainer);
    //отрисоваваю контейнер списка - <ul></ul>
    render(this.#listEventComponent, this.#listContainer);

    //отрисовываю форму редактирования точки списка - первым элементом списка
    // render (new FormEditEvent ({ point: this.#listPoints[0], offers: this.#listOffers, destinations: this.#listDestinations }), this.#listEventComponent.element);

    for (let i = 1; i < this.#listPoints.length; i += 1) {
      // отрисовываю точки списка по одной из массива точек, который приходит из модели
      // render(new PointTripEvent({ point: this.#listPoints[i], offers: this.#listOffers }), this.#listEventComponent.element);
      this.#renderPoint(
        this.#listPoints[i],
        this.#listOffers,
        this.#listDestinations,
      );
    }
  }

  #renderPoint(point, offers, destinations) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    const pointComponent = new PointTripEvent({
      point,
      offers,
      destinations,
      onFormEditBtnClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
    });

    const formEditComponent = new FormEditEvent({
      point,
      offers,
      destinations,
      onFormSubmit: () => {},
      onFormBtnCloseClick: () => replaceFormToPoint(),
    });

    function replacePointToForm() {
      replace(formEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, formEditComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#listEventComponent.element);
  }
}
