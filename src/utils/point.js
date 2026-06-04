import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

//подключаю плагин для расчета разницы
dayjs.extend(durationPlugin);

const DATE__FORMAT = 'MMM D';
const MACHINE_DATE_FORMAT = 'YYYY-MM-DD';

const HUMAN_TIME_FORMAT = 'HH:mm';
const MACHINE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

const FORM__DATE__TIME__FORMAT = 'DD/MM/YY HH:mm';

function humanazePointDueDate (dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE__FORMAT).toUpperCase() : '';
}

function formatMachineDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(MACHINE_DATE_FORMAT) : '';
}

function humanizePointTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(HUMAN_TIME_FORMAT) : '';
}

function formatMachineTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(MACHINE_TIME_FORMAT) : '';
}

function formatFormDateTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(FORM__DATE__TIME__FORMAT) : '';
}

function getEventDuration(dateFrom, dateTo) {
  const diff = dayjs(dateTo).diff(dayjs(dateFrom)); // Разница в миллисекундах
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

function getTypeOffers(offers, type) {
  return offers.find((offer) => offer.type === type);
}

function getCapitalaizedType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export { humanazePointDueDate, formatMachineDate, formatMachineTime, formatFormDateTime, humanizePointTime, getEventDuration, getTypeOffers, getCapitalaizedType};
