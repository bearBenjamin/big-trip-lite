import ListPresenter from './presenter/list-presenter.js';
import SortView from './view/sort-view.js';
import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import { render, RenderPosition } from './render.js';
import { offersData, destinationsData } from './mock/point.js';
import PointsModel from './model/points-model.js';

//нахожу контейнеры шапки
const header = document.querySelector('.page-header');
const tripInfoContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

// нахожу контейнер для основного содержимого в main
const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

// cоздаю компоненты шапки - информацию о путешествии и блок фильтровки
const tripInfoComponent = new TripInfoView();
const filterComponent = new FilterView();

// создаю компонент main - блок сортировки точек путешествия
const sortComponent = new SortView();

// получаю данные по точкам путешествия из модели точек
const pointsModel = new PointsModel(offersData, destinationsData);

// отрисовываю компоненты в header (информацию о путешествии и блок фильтровки)
render (tripInfoComponent, tripInfoContainer, RenderPosition.AFTERBEGIN);
render (filterComponent, filterContainer);

// отрисовываю компонент сортировки в main
render (sortComponent, tripEventsContainer);

// передаю в презентер списка - контейнер основного содержимого и данные о точках путешествия полученные из модели точек
const ListComponent = new ListPresenter({
  container: tripEventsContainer,
  pointsModel,
});

// вызываю метод инициации отвечающего за создания списка с точками путешествия
ListComponent.init();
