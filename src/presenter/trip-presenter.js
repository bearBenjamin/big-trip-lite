import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import ListTripEvents from '../view/list-trip-view.js';
import { render, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListEmpty from '../view/no-point-view.js';
import { generateFilter } from '../mock/filter.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/common.js';
import { sortTime, sortPrice, sortDay } from '../utils/point.js';
import { SortType } from '../const.js';

export default class TripPresenter {
  #headerContainer = null; // контейнер шапки
  #mainContainer = null; // контейнер main
  #tripInfoContainer = null; // контерейнер информации о всем путешествии
  #filterContainer = null; // контейнер фильтров
  #listContainer = null; // контейнер списка точек
  #pointsModel = {}; // данные обо всех точка путешествия из модели точек
  #offersModel = []; // данные обо всех offers из модели offers
  #destinationsModel = []; // данные обо всех destinations из модели destinations;
  #tripInfoComponent = new TripInfoView(); // компонент информации о всем путешествии
  #filterComponent = null; // компонент фильтров
  #sortComponent = null; // компонент сортировки
  #listEventComponent = new ListTripEvents(); // компонент самого списка без точек <ul></ul>
  #listPointPresenters = new Map(); // мапа - списка всех презентеров точек - нужна для навигации и внесению изменений в события отдельных точек
  #currentSortType = SortType.DAY; // объект (флаг) - текущего события (по дефолту - сортировка по Day)

  constructor({ headerContainer, mainContainer, pointsModel, offersModel, destinationsModel }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel; // модель точек путешествия;
    this.#offersModel = offersModel; // модель offers;
    this.#destinationsModel = destinationsModel; // модель destinations;
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [ ...this.#pointsModel.points].sort(sortDay);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPrice);
    }

    return [...this.#pointsModel.points].sort(sortDay);
  }

  get offers() {
    return this.#offersModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  init() {
    this.#tripInfoContainer = this.#headerContainer.querySelector('.trip-main'); // получаю контейнер для общей информации для путешествия из контейнера шапки
    this.#filterContainer = this.#headerContainer.querySelector('.trip-controls__filters'); // получаю контейнер для фильтров из контейнера шапки

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
    const filtersData = generateFilter(this.points); // заранее фильтрую список точек и сохраняю объект с данными по фильтрам
    this.#filterComponent = new FilterView(filtersData); // прокидываю полученные данные фильтрации в представление фильтров
    render(this.#filterComponent, this.#filterContainer); // отрисовываю фильтры на основе переданных данных по фильтрам
  }

  // метод отвечающий за отрисовку сортировки точек в main
  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortChange,
    }); // в компонент сортировки отдаю обработчик отвечающий за клики по кнопкам сортировки

    render(this.#sortComponent, this.#listContainer);
  }

  // обработчик события смены типа сортировки
  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    } // если кликаем на текущую сортировку - выходим, т.к. список точек уже отсортирован и ничего перерисовывать не надо

    this.#currentSortType = sortType;
    this.#clearListPoint(); // очищаю список точек
    this.#renderList(); // отрисовываю новый согласно выбранного типа сортировки
  };

  // метод отвечающий за отрисовку списка точек в main
  #renderList() {
    if (this.points.length === 0) {
      render(new ListEmpty(), this.#listContainer);
      return;
    }

    //отрисоваваю контейнер списка - <ul></ul>
    render(this.#listEventComponent, this.#listContainer);

    //отрисовываю точки списка точек путешествия
    this.points.forEach((point) => {
      this.#renderPoint(point, this.offers, this.destinations);
    });
  }

  // метод отвечающий за отрисовку одной точки
  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      listEventComponent: this.#listEventComponent.element,
      offers,
      destinations,
      onDataChange: this.#handlePointChange, // событие изменения данных в точке
      onModeChange: this.#handleModeChange, // событие отслеживающее изменение в флаге состояния - точка / форма
    });

    pointPresenter.init(point);
    this.#listPointPresenters.set(point.id, pointPresenter); // сохраняю презентер точки в мапе - содержащей весь массив презентеров точек
  }

  // метод очистки списка точек - удаляет презентеры точек из мапы и чистит сам массив
  #clearListPoint() {
    this.#listPointPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#listPointPresenters.clear();
  }

  // событие отвечающее за измененние данных в точках
  #handlePointChange = (updatePoint) => {
    updateItem(this.points, updatePoint);
    this.#listPointPresenters.get(updatePoint.id).init(updatePoint); // сохраняем изменение в мапу презентеров точек для конкретной точки и перерисовываем эту точку
  };

  // событие реагирующее на изменение состояния флага - точка / форма
  // вызывает торчащий наружу метод представления презентера точки, которые как раз проверяет флаг Mode
  #handleModeChange = () => {
    this.#listPointPresenters.forEach((presenter) => presenter.resetView()); // смотри отвечает состояние дефолтному и если нет заменяем форму на точку
  };
}
