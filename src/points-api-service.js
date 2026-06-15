import ApiService from './framework/api-service';

const METHOD = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApiServer {
  get points() {
    return this._load({
      url: 'points',
    }).then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = this._load({
      url: `points/${point.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    const parseResponse = await ApiService.parseResponse(response);

    return parseResponse;
  }


}
