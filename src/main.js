import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

import FiltersModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import BtnAddNewPointView from './view/add-point-btn-view.js';
import { render } from './framework/render.js';

import PointsApiService from './points-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import OffersApiService from './offers-api-service.js';

import TripInfoPresenter from './presenter/trip-info-presenter.js';

const AUTORIZATION = 'Basic Hs5SfA77wcL3sa9j';
const END__POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const header = document.querySelector('.page-header');
const headerContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END__POINT, AUTORIZATION),
});
const offersModel = new OffersModel({
  offersApiService: new OffersApiService(END__POINT, AUTORIZATION)
});
const destinationsModel = new DestinationsModel({
  destinationsApiService: new DestinationsApiService(END__POINT, AUTORIZATION),
});
const filterModel = new FiltersModel();

const tripInfoPresenter = new TripInfoPresenter({container: headerContainer, pointsModel, offersModel, destinationsModel});

const btnAddNewPointComponent = new BtnAddNewPointView({
  onClick: handleBtnAddNewPointClick,
});

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

tripPresenter.init();
filterPresenter.init();
destinationsModel.init();
offersModel.init();
pointsModel.init()
  .finally(() => {
    render(btnAddNewPointComponent, headerContainer);
  });
tripInfoPresenter.init();
