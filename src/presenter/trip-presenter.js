import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import ListTripEvents from '../view/list-trip-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import SortView from '../view/sort-view.js';
import ListEmpty from '../view/no-point-view.js';
import { generateFilter } from '../mock/filter.js';
import PointPresenter from './point-presenter.js';
import { sortTime, sortPrice, sortDay } from '../utils/point.js';
import { SortType, UpdateType, UserAction } from '../const.js';

export default class TripPresenter {
  #headerContainer = null; // контейнер шапки
  #mainContainer = null; // контейнер main
  #tripInfoContainer = null; // контерейнер информации о всем путешествии
  #filterContainer = null; // контейнер фильтров
  #listContainer = null; // контейнер списка точек
  #pointsModel = {}; // данные обо всех точка путешествия из модели точек
  #offersModel = []; // данные обо всех offers из модели offers
  #destinationsModel = []; // данные обо всех destinations из модели destinations;
  #filterModel = [];
  #tripInfoComponent = new TripInfoView(); // компонент информации о всем путешествии
  #filterComponent = null; // компонент фильтров
  #sortComponent = null; // компонент сортировки
  #listEventComponent = null; // компонент самого списка без точек <ul></ul>
  #listEmptyComponent = null; // компонент пустого списка
  #listPointPresenters = new Map(); // мапа - списка всех презентеров точек - нужна для навигации и внесению изменений в события отдельных точек
  #currentSortType = SortType.DAY; // объект (флаг) - текущего события (по дефолту - сортировка по Day)

  constructor({
    headerContainer,
    mainContainer,
    pointsModel,
    offersModel,
    destinationsModel,
    filterModel
  }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel; // модель точек путешествия;
    this.#offersModel = offersModel; // модель offers;
    this.#destinationsModel = destinationsModel; // модель destinations;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortDay);
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
    this.#filterContainer = this.#headerContainer.querySelector(
      '.trip-controls__filters',
    ); // получаю контейнер для фильтров из контейнера шапки

    this.#listContainer = this.#mainContainer.querySelector('.trip-events'); // получаю контейнер для списка точек путешествия из контейнера main

    this.#renderInfoTrip(); // метод отвечающий за отрисовку общей информации о путешествии в шапке
    this.#renderFilter(); // метод отвечающий за отрисовку фильтров точек в шапке

    // this.#renderSort(); // метод отвечающий за отрисовку сортировки точек в main
    // this.#renderList(); // метод отвечающий за отрисовку списка точек в main
    this.#renderBoardTrip();
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

  #renderBoardTrip() {
    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    this.#renderSort();
    this.#renderListComponent();

    //отрисовываю точки списка точек путешествия
    this.points.forEach((point) => {
      this.#renderPoint(point, this.offers, this.destinations);
    });
  }

  #renderListComponent() {
    this.#listEventComponent = new ListTripEvents();
    //отрисоваваю контейнер списка - <ul></ul>
    render(this.#listEventComponent, this.#listContainer);
  }

  #renderNoPoint() {
    this.#listEmptyComponent = new ListEmpty();
    render(this.#listEmptyComponent, this.#listContainer);
  }

  // метод отвечающий за отрисовку сортировки точек в main
  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortChange,
    }); // в компонент сортировки отдаю обработчик отвечающий за клики по кнопкам сортировки

    render(this.#sortComponent, this.#listContainer);
  }

  // обработчик вызываемы при изменении модели точек - посути отвечает за перерисовку если данные в модели обновились
  #handleModelEvent = (updateType, data) => {
    // console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда удалили точку)
    // - обновить все отрисованное (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#listPointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда удалил точку)
        this.#clearListBoard();
        this.#renderBoardTrip();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearListBoard({resetSortType: true});
        this.#renderBoardTrip();
        break;
    }
  };

  // обработчик события смены типа сортировки
  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    } // если кликаем на текущую сортировку - выходим, т.к. список точек уже отсортирован и ничего перерисовывать не надо

    this.#currentSortType = sortType;
    this.#clearListBoard();
    this.#renderBoardTrip(); // отрисовываю новый согласно выбранного типа сортировки
  };

  // метод отвечающий за отрисовку одной точки
  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      listEventComponent: this.#listEventComponent.element,
      offers,
      destinations,
      onDataChange: this.#handleViewAction, // событие изменения данных в точке
      onModeChange: this.#handleModeChange, // событие отслеживающее изменение в флаге состояния - точка / форма
    });

    pointPresenter.init(point);
    this.#listPointPresenters.set(point.id, pointPresenter); // сохраняю презентер точки в мапе - содержащей весь массив презентеров точек
  }

  #clearListBoard({ resetSortType = false } = {}) {
    this.#listPointPresenters.forEach((presenter) => presenter.destroy());
    this.#listPointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#listEventComponent);
    remove(this.#listEmptyComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  // событие отвечающее за обновление данных в модели точек после действий пользователя в представлении (View) - посути следит за действиями пользователя и обновляет данные
  #handleViewAction = (actionType, updateType, update) => {
    // console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE__POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;

      case UserAction.ADD__POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;

      case UserAction.DELETE__POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  // событие реагирующее на изменение состояния флага - точка / форма
  // вызывает торчащий наружу метод представления презентера точки, которые как раз проверяет флаг Mode
  #handleModeChange = () => {
    this.#listPointPresenters.forEach((presenter) => presenter.resetView()); // смотри отвечает состояние дефолтному и если нет заменяем форму на точку
  };
}
