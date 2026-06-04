import dayjs from 'dayjs';
import { FilterType } from '../const';


const nowData = dayjs();

const filterEveriting = (points) => points;

const filterFuture = (points) => points.filter((point) => dayjs(point.dateFrom).isAfter(nowData));

const filterPresent = (points) => points.filter((point) => {
  const isStarted = dayjs(point.dateFrom).isBefore(nowData) || dayjs(point.dateFrom).isSame(nowData);
  const isNotEnded = dayjs(point.dateTo).isAfter(nowData) || dayjs(point.dateTo).isSame(nowData);
  // Поездка уже началась, но еще не закончилась
  return isStarted && isNotEnded;
});

const filterPast = (points) => points.filter((point) => dayjs(point.dateTo).isBefore(nowData));

const filter = {
  [FilterType.EVERITHING]: (points) => filterEveriting(points),
  [FilterType.FUTURE]: (points) => filterFuture(points),
  [FilterType.PRESENT]: (points) => filterPresent(points),
  [FilterType.PAST]: (points) => filterPast(points),
};

export { filter };
