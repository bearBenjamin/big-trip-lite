function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}


export { getRandomArrayElement, getRandomInteger, updateItem };
