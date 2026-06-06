import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import ListTripEvents from '../view/list-trip-view.js';
import { render, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListEmpty from '../view/no-point-view.js';
import { generateFilter } from '../mock/filter.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';

export default class TripPresenter {
  #headerContainer = null;
  #mainContainer = null;
  #tripInfoContainer = null;
  #filterContainer = null;
  #listContainer = null;
  #pointsModel = {};
  #tripInfoComponent = new TripInfoView();
  #filterComponent = null;
  #sortComponent = new SortView();
  #listEventComponent = new ListTripEvents();
  #listPoints = [];
  #listOffers = [];
  #listDestinations = [];
  #listPointPresenters = new Map();

  constructor({ headerContainer, mainContainer, pointsModel }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel; // модель точек путешествия;
  }

  init() {
    // извлекаю данные из модели точек: массив точек, массив offers, массив destinations
    this.#listPoints = [...this.#pointsModel.points];
    this.#listOffers = [...this.#pointsModel.offers];
    this.#listDestinations = [...this.#pointsModel.destinations];

    this.#tripInfoContainer = this.#headerContainer.querySelector('.trip-main'); // получаю контейнер для общей информации для путешествия из контейнера шапки
    this.#filterContainer = this.#headerContainer.querySelector(
      '.trip-controls__filters',
    ); // получаю контейнер для фильтров из контейнера шапки

    this.#listContainer = this.#mainContainer.querySelector('.trip-events'); // получаю контейнер для списка точек путешествия из контейнера main

    this.#renderInfoTrip(); // метод отвечающий за отрисовку общей информации о путешествии в шапке
    this.#renderFilter(); // метод отвечающий за отрисовку фильтров точек в шапке

    this.#renderSort(); // метод отвечающий за отрисовку сортировки точек в main
    this.#renderList(); // метод отвечающий за отрисовку списка точек в main
  }

  // метод отвечающий за отрисовку общей информации о путешествии в шапке
  #renderInfoTrip() {
    render(
      this.#tripInfoComponent,
      this.#tripInfoContainer,
      RenderPosition.AFTERBEGIN,
    );
  }

  // метод отвечающий за отрисовку фильтров точек в шапке
  #renderFilter() {
    const filtersData = generateFilter(this.#listPoints);
    this.#filterComponent = new FilterView(filtersData);
    render(this.#filterComponent, this.#filterContainer);
  }

  // метод отвечающий за отрисовку сортировки точек в main
  #renderSort() {
    render(this.#sortComponent, this.#listContainer);
  }

  // метод отвечающий за отрисовку списка точек в main
  #renderList() {
    if (this.#listPoints.length === 0) {
      render(new ListEmpty(), this.#listContainer);
      return;
    }

    //отрисоваваю контейнер списка - <ul></ul>
    render(this.#listEventComponent, this.#listContainer);

    //отрисовываю точки списка точек путешествия
    for (let i = 0; i < this.#listPoints.length; i += 1) {
      this.#renderPoint(
        this.#listPoints[i],
        this.#listOffers,
        this.#listDestinations,
      );
    }
  }

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      listEventComponent: this.#listEventComponent.element,
      offers,
      destinations,
      onDataChange: this.#handlePointChange,
    });

    pointPresenter.init(point);
    this.#listPointPresenters.set(point.id, pointPresenter);
  }

  #clearListPoint() {
    this.#listPointPresenters.forEach((presenter) => {
      console.log('presenter: ', presenter);
      presenter.destroy();
    });

    this.#listPointPresenters.clear();
  }

  #handlePointChange = (updatePoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatePoint);
    this.#listPointPresenters.get(updatePoint.id).init(updatePoint);
  };
}
