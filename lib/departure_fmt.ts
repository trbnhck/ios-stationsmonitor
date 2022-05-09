export default (current: Date, departure: Date) => {
  const diff = departure.getTime() - current.getTime();
  const minute_difference = Math.floor(diff / 1000 / 60);

  if (minute_difference < 0) {
    return `vor ${-minute_difference}min`;
  }

  if (minute_difference > 60) {
    return `um ${departure.getHours()}:${departure.getMinutes()}`;
  }

  return `in ${minute_difference}min`;
};
