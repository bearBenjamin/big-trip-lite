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
  #tripInfoComponent = new TripInfoView(); // компонент информации о всем путешествии
  #filterComponent = null; // компонент фильтров
  #sortComponent = null; // компонент сортировки
  #listEventComponent = new ListTripEvents(); // компонент самого списка без точек <ul></ul>
  #listPoints = []; // массив точек из модели точек;
  #listOffers = []; // массив предложений из модели точек - здесь наверное потом этот массив должен приходить из модели предложений
  #listDestinations = []; // массив описаний из модели точек - наверно в будущем будет приходить из модели описаний
  #listPointPresenters = new Map(); // мапа - списка всех презентеров точек - нужна для навигации и внесению изменений в события отдельных точек
  #currentSortType = SortType.DAY; // объект (флаг) - текущего события (по дефолту - сортировка по Day)
  #sourcedListPoints = []; // массив с точками до сортировки - нужен чтобы сбросить сортировку в дефолтное состояния

  constructor({ headerContainer, mainContainer, pointsModel }) {
    this.#headerContainer = headerContainer;
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel; // модель точек путешествия;
  }

  init() {
    // извлекаю данные из модели точек: массив точек, массив offers, массив destinations
    this.#listPoints = [...this.#pointsModel.points].sort(sortDay); // в моках даты формируются случайно поэтому сортирую
    this.#listOffers = [...this.#pointsModel.offers];
    this.#listDestinations = [...this.#pointsModel.destinations];

    this.#sourcedListPoints = [...this.#pointsModel.points].sort(sortDay); // в моках даты формируются случайно поэтому сортирую
    // массивы this.#listPoints и this.#sourcedListPoints - на момент инициализации должны быть одинаковыми

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
    const filtersData = generateFilter(this.#listPoints); // заранее фильтрую список точек и сохраняю объект с данными по фильтрам
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

  // метод сортировки списка точек по типу
  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#listPoints.sort(sortTime);
        break;
      case SortType.PRICE:
        this.#listPoints.sort(sortPrice);
        break;
      default:
        this.#listPoints = [...this.#sourcedListPoints];
    }

    this.#currentSortType = sortType;
  }

  // обработчик события смены типа сортировки
  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    } // если кликаем на текущую сортировку - выходим, т.к. список точек уже отсортирован и ничего перерисовывать не надо

    this.#sortPoints(sortType); // сортирую точки по выбраному типу
    this.#clearListPoint(); // очищаю список точек
    this.#renderList(); // отрисовываю новый согласно выбранного типа сортировки
  };

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
    this.#listPoints = updateItem(this.#listPoints, updatePoint); // вызываем функцию отвечающую за изменение конкретной точки в списке
    this.#sourcedListPoints = updateItem(this.#sourcedListPoints, updatePoint); // дублируем в список отвечающий за дефолтное состояние сортировки
    this.#listPointPresenters.get(updatePoint.id).init(updatePoint); // сохраняем изменение в мапу презентеров точек для конкретной точки и перерисовываем эту точку
  };

  // событие реагирующее на изменение состояния флага - точка / форма
  // вызывает торчащий наружу метод представления презентера точки, которые как раз проверяет флаг Mode
  #handleModeChange = () => {
    this.#listPointPresenters.forEach((presenter) => presenter.resetView()); // смотри отвечает состояние дефолтному и если нет заменяем форму на точку
  };
}
