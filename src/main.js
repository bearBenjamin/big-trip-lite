import TripPresenter from './presenter/trip-presenter.js';
// import { offersData, destinationsData } from './mock/point.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

import FiltersModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BtnAddNewPointView from './view/add-point-btn-view.js';
import { render } from './framework/render.js';

import PointsApiService from './points-api-service.js';

const AUTORIZATION = 'Basic Hs5SfA77wcL3sa9j';
const END__POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const header = document.querySelector('.page-header');
const headerContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');

// получаю данные по точкам путешествия из модели точек, передав внутрь модели данные offers и destinations из мок.данных
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END__POINT, AUTORIZATION),
});
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FiltersModel();

const btnAddNewPointComponent = new BtnAddNewPointView({
  onClick: handleBtnAddNewPointClick,
});

// передаю в презентер путешествия - контейнер шапки, контейнер основного содержимого и данные о точках путешествия полученные из модели точек
const tripPresenter = new TripPresenter({
  mainContainer: main,
  headerContainer: header,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});

function handleBtnAddNewPointClick() {
  tripPresenter.createPoint();
  btnAddNewPointComponent.element.disabled = true;
}

function handleNewFormClose() {
  btnAddNewPointComponent.element.disabled = false;
}

// вызываю метод инициации основного презентера отвечающего за создание шапки и списка с точками путешествия
tripPresenter.init();
filterPresenter.init();
pointsModel.init()
  .finally(() => {
    render(btnAddNewPointComponent, headerContainer);
  });
