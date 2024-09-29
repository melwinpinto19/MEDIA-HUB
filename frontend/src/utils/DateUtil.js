const getFormatFromDiff = (createdAt) => {
  const timeSinceUploaded =
    new Date().getTime() - new Date(createdAt).getTime(); // Time difference in milliseconds
  console.log(timeSinceUploaded);
  const seconds = Math.floor(timeSinceUploaded / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 12);
  const years = Math.floor(months / 12);

  return { months, days, hours, minutes, seconds, years };
};

const getUTCFormatFromDiff = (createdAt) => {
  console.log(createdAt);

  const date1 = new Date(createdAt);
  const date2 = new Date();

  console.log(date1.getTime());

  return { days: date2.getDate() - date1.getUTCDate() };
};

const getCurrrentDate = () => {
  const date = new Date();

  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
    year: date.getFullYear(),
  };
};

export { getFormatFromDiff, getCurrrentDate, getUTCFormatFromDiff };
