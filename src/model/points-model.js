import { generatePoint } from '../mock/point';

const POINT__COUNT = 3;

export default class PointsModel {
  points = Array.from({ length: POINT__COUNT}, generatePoint());

  getPoints() {
    return this.points;
  }
}
