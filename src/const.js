const POINT__TYPE = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const FilterType = {
  EVERITHING: 'all',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const MessageNoEvent = {
  EVERITHING: 'Click New Event to create your first point',
  PAST: 'There are no past events',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

export { POINT__TYPE, FilterType, MessageNoEvent, SortType };
