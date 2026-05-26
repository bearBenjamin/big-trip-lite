import TripInfoView from './view/trip-info-header-view.js';
import { render, RenderPosition } from './render.js';

const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

const tripInfoComponent = new TripInfoView();

render (tripInfoComponent, tripEventsContainer, RenderPosition.AFTERBEGIN);


