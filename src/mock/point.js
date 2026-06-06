import { POINT__TYPE } from '../const';
import { getTypeOffers } from '../utils/point.js';
import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';

const destinationsData = [
  {
    name: 'Amsterdam',
    description: 'Amsterdam is the charming capital of the Netherlands, famous for its historic canals and vibrant cycling culture...',
    picturesData: ['The Van Gogh Museum', 'The Canals of Amsterdam', 'Vondelpark']
  },
  {
    name: 'Geneva',
    description: 'Geneva is a stunning Swiss city nestled on the shores of Europe\'s largest Alpine lake...',
    picturesData: ['Jet d\'Eau', 'The Old Town (Vieille Ville)']
  },
  {
    name: 'Chamonix',
    description: 'Chamonix is a world-famous Alpine resort town nestled at the base of Mont Blanc...',
    picturesData: ['Mont Blanc', 'Aiguille du Midi', 'Mer de Glace']
  }
];

const offersData = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to Business Class',
        price: 30,
      },
      {
        id: 2,
        title: 'Child seat',
        price: 5,
      },
      {
        id: 3,
        title: 'Upgrade to XL/Van',
        price: 20,
      },
      {
        id: 4,
        title: 'Meet & Greet with a sign',
        price: 15,
      },
    ],
  },
  {
    type: 'bus',
    offers: [
      {
        id: 5,
        title: 'Select a specific seat',
        price: 5,
      },
      {
        id: 6,
        title: 'Add extra luggage',
        price: 15,
      },
      {
        id: 7,
        title: 'In-bus Wi-Fi and power outlet',
        price: 3,
      },
      {
        id: 8,
        title: 'Lounge access at the station',
        price: 10,
      },
    ],
  },
  {
    type: 'train',
    offers: [
      {
        id: 9,
        title: 'Upgrade to First Class',
        price: 40,
      },
      {
        id: 10,
        title: 'Add hot meal',
        price: 15,
      },
      {
        id: 11,
        title: 'Choose a quiet zone seat',
        price: 5,
      },
      {
        id: 12,
        title: 'Additional oversized baggage',
        price: 20,
      },
    ],
  },
  {
    type: 'ship',
    offers: [
      {
        id: 13,
        title: 'Upgrade to Business Lounge',
        price: 35,
      },
      {
        id: 14,
        title: 'Book a private cabin',
        price: 100,
      },
      {
        id: 15,
        title: 'Dinner buffet included',
        price: 25,
      },
      {
        id: 16,
        title: 'Priority boarding and vehicle check-in',
        price: 15,
      },
    ],
  },
  {
    type: 'drive',
    offers: [
      {
        id: 17,
        title: 'Full insurance coverage (Zero deductible)',
        price: 25,
      },
      {
        id: 18,
        title: 'Add GPS navigation system',
        price: 10,
      },
      {
        id: 19,
        title: 'Register an additional driver',
        price: 15,
      },
      {
        id: 20,
        title: 'Unlimited mileage',
        price: 20,
      },
    ],
  },
  {
    type: 'flight',
    offers: [
      {
        id: 21,
        title: 'Add checked baggage',
        price: 35,
      },
      {
        id: 22,
        title: 'Select extra legroom seat',
        price: 20,
      },
      {
        id: 23,
        title: 'In-flight hot meal',
        price: 15,
      },
      {
        id: 24,
        title: 'Priority boarding',
        price: 10,
      },
    ],
  },
  {
    type: 'check-in',
    offers: [
      {
        id: 25,
        title: 'Add breakfast buffet',
        price: 20,
      },
      {
        id: 26,
        title: 'Early check-in',
        price: 30,
      },
      {
        id: 27,
        title: 'Late check-out',
        price: 25,
      },
      {
        id: 28,
        title: 'Upgrade to room with a view',
        price: 50,
      },
    ],
  },
  {
    type: 'sightseeing',
    offers: [
      {
        id: 29,
        title: 'Book a professional local guide',
        price: 45,
      },
      {
        id: 30,
        title: 'Skip-the-line ticket',
        price: 15,
      },
      {
        id: 31,
        title: 'Add multilingual audio guide',
        price: 5,
      },
      {
        id: 32,
        title: 'Photography pass included',
        price: 10,
      },
    ],
  },
  {
    type: 'restaurant',
    offers: [
      {
        id: 33,
        title: 'Welcome drink (Champagne/Cocktail)',
        price: 12,
      },
      {
        id: 34,
        title: 'Book a window table with a view',
        price: 15,
      },
      {
        id: 35,
        title: 'Add wine pairing to dinner',
        price: 35,
      },
      {
        id: 36,
        title: 'Vegetarian/Vegan menu option',
        price: 0,
      },
    ],
  },
];

const generatePointDates = () => {
  const daysGap = getRandomInteger(-7, 7);
  const hoursGap = getRandomInteger(1, 23);
  const minutesGap = getRandomInteger(1, 59);

  const dateFrom = dayjs()
    .add(daysGap, 'day')
    .add(hoursGap, 'hour')
    .add(minutesGap, 'minute');

  const durationInMinutes = getRandomInteger(30, 300);
  const dateTo = dateFrom.add(durationInMinutes, 'minute');

  return {
    dateFrom: dateFrom.toISOString(),
    dateTo: dateTo.toISOString()
  };
};

const getRandomDestination = (destinations) => {
  const randomCity = getRandomArrayElement(destinations);

  const pictures = randomCity.picturesData.map((description) => ({
    src: `https://loremflickr.com/248/152?random=${Math.random()}`,
    description: description
  }));

  return {
    name: randomCity.name,
    description: randomCity.description,
    pictures: pictures
  };
};

const getRandomOffer = (offers, type) => {
  const currentOffers = getTypeOffers(offers, type); // получаю объект из массива соответствующего типа
  const id = currentOffers.offers // в текущем объекте работаю с содержимым по ключу offers - массивом доп.предложений
    .filter(() => Math.random() > 0.5) // массив доп.предложений фильтрую 50 на 50 (собираю массив из случайных доп.предложений)
    .map((offer) => offer.id); // выбираю из отфильтрованного массива только значения по ключу id;
  return id; // в точке в ключ offers уходят только id доп.предложений если они есть либо пустой массив
};

const generatePoint = () => {
  const currentPointType = getRandomArrayElement(POINT__TYPE);
  const dates = generatePointDates();

  return {
    id: nanoid(),
    type: currentPointType,
    destination: getRandomDestination(destinationsData),
    dateFrom: dates.dateFrom,
    dateTo: dates.dateTo,
    price: 20,
    offers: getRandomOffer(offersData, currentPointType),
    isFavorite: Math.random() > 0.5,
  };
};

export { generatePoint, offersData, destinationsData };
