import { filter } from '../utils/filter.js';

function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterType, filterPoints]) => ({
      type: filterType,
      data: filterPoints(points),
      count: filterPoints(points).length,
    }),
  );
}

export { generateFilter };
