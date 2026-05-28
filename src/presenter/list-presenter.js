import ListTripEvents from '../view/list-trip-view.js';
import PointTripEvent from '../view/point-trip-view.js';
import FormEditEvent from '../view/form-edit-view.js';
import { render } from '../render.js';

export default class ListPresenter {
  listEventComponent = new ListTripEvents();
  formEditComponent = new FormEditEvent();

  constructor (container) {
    this.container = container; // container - tripEventsContainer приходит из точки входа
  }

  init () {
    render (this.listEventComponent, this.container);
    render (this.formEditComponent, this.listEventComponent.getElement());

    for (let i = 0; i < 3; i += 1) {
      render(new PointTripEvent(), this.listEventComponent.getElement());
    }
  }
}
