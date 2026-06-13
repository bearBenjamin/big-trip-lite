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

const FILTER__TYPE = {
  EVERITHING: 'everithing',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const MESSAGE__NO__EVENT = {
  everithing: 'Click New Event to create your first point',
  past: 'There are no past events',
  present: 'There are no present events now',
  future: 'There are no future events now',
};

const SORT__TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

// объект где храним описания действий пользователя
const UserAction = {
  UPDATE__POINT: 'UPDATE__POINT',
  ADD__POINT: 'ADD__POINT',
  DELETE__POINT: 'DELETE__POINT',
};

// объект где хранятся типы обновлений: точечное (PATCH), маленькое (MINOR) и глобальное (MAJOR)
const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const EMPTY__POINT = {
  type: 'flight',
  destination: {},
  dateFrom: null,
  dateTo: null,
  price: 0,
  offers: [],
  isFavorite: false,
};

export { POINT__TYPE, FILTER__TYPE as FilterType, MESSAGE__NO__EVENT as MessageNoEvent, SORT__TYPE as SortType, UserAction, UpdateType, EMPTY__POINT };
