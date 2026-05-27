import ListPresenter from './presenter/list-presenter.js';
import SortView from './view/sort-main-view.js';
import TripInfoView from './view/trip-info-header-view.js';
import FilterView from './view/filter-header-view.js';
import { render, RenderPosition } from './render.js';

const header = document.querySelector('.page-header');
const tripInfoContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

const filterComponent = new FilterView(); // фильтер по времени в шапке
const tripInfoComponent = new TripInfoView(); // информация о путешествии в шапке

const sortComponent = new SortView(); // сортировка точек путешествия в main

// отрисовываю компоненты в header
render (tripInfoComponent, tripInfoContainer, RenderPosition.AFTERBEGIN);
render (filterComponent, filterContainer); // RenderPosition не передаю использую значение по дефолту

// отрисовываю компонены в main
render (sortComponent, tripEventsContainer); // RenderPosition использую значение по дефолту

const ListComponent = new ListPresenter(tripEventsContainer);

ListComponent.init();
