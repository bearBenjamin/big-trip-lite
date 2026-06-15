import Observable from '../framework/observable';
// import { destinationsData } from '../mock/point';

export default class DestinationsModel extends Observable {
  #destinationsApiService = null;
  // #destinations = destinationsData;
  #destinations = [];

  constructor({destinationsApiService}) {
    super();
    this.#destinationsApiService = destinationsApiService;

    // this.#destinationsApiService.destinations.then((destinations) => {
    //   console.log('destinations: ', destinations);
    // });
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.destinationsApiService.destinations;
    } catch(err) {
      this.#destinations = [];
    }
  }
}
