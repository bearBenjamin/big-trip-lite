import AbstractView from '../framework/view/abstract-view.js';
import { MessageNoEvent } from '../const.js';

const createTemplate = () => `<p class="trip-events__msg">
                                ${MessageNoEvent.EVERITHING}
                              </p>`;

export default class ListEmpty extends AbstractView {
  get template() {
    return createTemplate();
  }
}
