import ListPresenter from './presenter/list-presenter.js';
import SortView from './view/sort-view.js';
import TripInfoView from './view/trip-info-view.js';
import FilterView from './view/filter-view.js';
import { render, RenderPosition } from './render.js';

const header = document.querySelector('.page-header');
const tripInfoContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

const filterComponent = new FilterView();
const tripInfoComponent = new TripInfoView();

const sortComponent = new SortView();

// отрисовываю компоненты в header
render (tripInfoComponent, tripInfoContainer, RenderPosition.AFTERBEGIN);
render (filterComponent, filterContainer);

// отрисовываю компонены в main
render (sortComponent, tripEventsContainer);

const ListComponent = new ListPresenter(tripEventsContainer);

ListComponent.init();
