import ListTripEvents from '../view/list-trip-events-view';
import PointTripEvent from '../view/point-trip-event-view';
import FormEditEvent from '../view/form-edit-event-view.js';
import { render } from '../render.js';

export default class ListPresenter {
  listEventTripComponent = new ListTripEvents();
  formEditEvent = new FormEditEvent();

  constructor (container) {
    this.container = container;
  }

  init () {
    render (this.listEventTripComponent, this.container);
    render (this.formEditEvent, this.listEventTripComponent.getElement()); // форма сейчас в списке но не в li - как то это не правильно

    for (let i = 0; i < 3; i += 1) {
      render(new PointTripEvent(), this.listEventTripComponent.getElement());
    }
  }
}
