import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

// плагин чтобы время не пересчитывалось на мой часовой пояс, т.е. сейчас идет +3 часа ко времени из данных
dayjs.extend(utc); // возможно это лишнее надо будет убрать и посмотреть, т.к. скорей всего дело было в flatpick - а там я вроде как все победил

//подключаю плагин для расчета разницы
dayjs.extend(durationPlugin);

const DATE__FORMAT = 'MMM D';
const MACHINE_DATE_FORMAT = 'YYYY-MM-DD';

const HUMAN_TIME_FORMAT = 'HH:mm';
const MACHINE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

const FORM__DATE__TIME__FORMAT = 'DD/MM/YY HH:mm';

// добавляю перед форматированием .utc() чтобы не было разницы в 3 часа
function humanazePointDueDate (dueDate) {
  return dueDate ? dayjs(dueDate).utc().format(DATE__FORMAT).toUpperCase() : '';
}

function formatMachineDate(dueDate) {
  return dueDate ? dayjs(dueDate).utc().format(MACHINE_DATE_FORMAT) : '';
}

function humanizePointTime(dueDate) {
  return dueDate ? dayjs(dueDate).utc().format(HUMAN_TIME_FORMAT) : '';
}

function formatMachineTime(dueDate) {
  return dueDate ? dayjs(dueDate).utc().format(MACHINE_TIME_FORMAT) : '';
}

function formatFormDateTime(dueDate) {
  return dueDate ? dayjs(dueDate).utc().format(FORM__DATE__TIME__FORMAT) : '';
}

function getEventDuration(dateFrom, dateTo) {
  const diff = dayjs(dateTo).utc().diff(dayjs(dateFrom).utc()); // Разница в миллисекундах
  const eventDuration = dayjs.duration(diff); // Превращаю в объект длительности

  const days = eventDuration.days();
  const hours = eventDuration.hours();
  const minutes = eventDuration.minutes();

  // Форматирую вывод в зависимости от получившегося времени (как в ТЗ)
  if (days > 0) {
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
  return `${String(minutes).padStart(2, '0')}M`;
}

function serializeDate(date) {
  return date ? dayjs(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : '';
}

function getTypeOffers(offers, type) {
  return offers.find((offer) => offer.type === type);
}

function getCapitalaizedType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function sortTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

function sortPrice(pointA, pointB) {
  return pointB.price - pointA.price;
}

function sortDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

export { humanazePointDueDate, formatMachineDate, formatMachineTime, formatFormDateTime, humanizePointTime, getEventDuration, getTypeOffers, getCapitalaizedType, sortTime, sortPrice, sortDay, serializeDate };
