import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const count = filter.count === 0 ? 'disabled' : '';
  const checked = isChecked ? 'checked' : '';
  return `<div class="trip-filters__filter">
                  <input id="filter-${filter.type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filter.type}" ${count} ${checked}>
                  <label class="trip-filters__filter-label" for="filter-${filter.type}">${filter.type}</label>
                </div>`;
};

function createTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<form class="trip-filters" action="#" method="get">
                          ${filterItemsTemplate}
                          <button class="visually-hidden" type="submit">Accept filter</button>
                         </form>`;
}

export default class FilterView extends AbstractView {
  #filtersData = {};

  constructor (filtesData) {
    super ();
    this.#filtersData = filtesData;
  }

  get template() {
    return createTemplate(this.#filtersData);
  }
}
