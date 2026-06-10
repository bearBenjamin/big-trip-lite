import TripPresenter from './presenter/trip-presenter.js';
import { offersData, destinationsData } from './mock/point.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

import FiltersModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const header = document.querySelector('.page-header');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');

// получаю данные по точкам путешествия из модели точек, передав внутрь модели данные offers и destinations из мок.данных
const pointsModel = new PointsModel(offersData, destinationsData);
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FiltersModel();

// передаю в презентер путешествия - контейнер шапки, контейнер основного содержимого и данные о точках путешествия полученные из модели точек
const TripComponent = new TripPresenter({
  mainContainer: main,
  headerContainer: header,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});

// вызываю метод инициации основного презентера отвечающего за создание шапки и списка с точками путешествия
TripComponent.init();
filterPresenter.init();
