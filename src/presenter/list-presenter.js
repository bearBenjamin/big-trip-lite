import ListTripEvents from '../view/list-trip-view.js';
import PointTripEvent from '../view/point-trip-view.js';
import FormEditEvent from '../view/form-edit-view.js';
import { render } from '../render.js';

export default class ListPresenter {
  listEventComponent = new ListTripEvents();
  //formEditComponent = new FormEditEvent();

  constructor ({ container, pointsModel }) {
    this.listContainer = container; // container - tripEventsContainer приходит из точки входа - контейнер для списка точек путешествия;
    this.pointsModel = pointsModel; // массив точек путешествия;
  }

  init () {
    // делаю копию массива точек, чтобы случайно не мутировать данные - это временное решение
    this.listPoints = [...this.pointsModel.getPoints()];

    //отрисоваваю контейнер списка - <ul></ul>
    render (this.listEventComponent, this.listContainer);

    //отрисовываю форму редактирования точки списка - первым элементом списка
    render (new FormEditEvent ({ point: this.listPoints[0] }), this.listEventComponent.getElement());

    for (let i = 1; i < this.listPoints.length; i += 1) {
      // отрисовываю точки списка по одной из массива точек, который приходит из модели
      render(new PointTripEvent({ point: this.listPoints[i] }), this.listEventComponent.getElement());
    }
  }
}
