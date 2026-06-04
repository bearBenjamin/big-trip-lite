import ListPresenter from './presenter/list-presenter.js';
import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import { render, RenderPosition } from './framework/render.js';
import { offersData, destinationsData } from './mock/point.js';
import PointsModel from './model/points-model.js';
import { generateFilter } from './mock/filter.js';

//нахожу контейнеры шапки
const header = document.querySelector('.page-header');
const tripInfoContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

// нахожу контейнер для основного содержимого в main
const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

// получаю данные по точкам путешествия из модели точек, передав внутрь модели данные offers и destinations из мок.данных
const pointsModel = new PointsModel(offersData, destinationsData);
const points = pointsModel.points; // Получаем массив точек
const filtersData = generateFilter(points); // Получаем данные по фильтрам

// cоздаю компоненты шапки - информацию о путешествии и блок фильтровки
const tripInfoComponent = new TripInfoView();
const filterComponent = new FilterView(filtersData); // отдаю данные фильтров в представление фильтров

// отрисовываю компоненты в header (информацию о путешествии и блок фильтровки)
render (tripInfoComponent, tripInfoContainer, RenderPosition.AFTERBEGIN);
render (filterComponent, filterContainer);

// передаю в презентер списка - контейнер основного содержимого и данные о точках путешествия полученные из модели точек
const ListComponent = new ListPresenter({
  container: tripEventsContainer,
  pointsModel,
});

// вызываю метод инициации отвечающего за создания списка с точками путешествия
ListComponent.init();
