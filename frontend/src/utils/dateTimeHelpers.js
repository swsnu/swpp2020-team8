import { format } from 'date-fns';

export const formatDate = (
  date,
  dateFormat = 'yyyy.MM.dd. HH:mm',
  options = {}
) => {
  try {
    const newDate = new Date(date);
    return format(newDate, dateFormat, options);
  } catch (error) {
    return date;
  }
};

export const getCreatedTime = (createdTime) => {
  if (!createdTime) {
    return '';
  }
  const now = new Date();
  const writeTime = new Date(createdTime);

  const betweenSeconds = Math.floor(
    (now.getTime() - writeTime.getTime()) / 1000
  );
  const betweenTime = Math.floor(
    (now.getTime() - writeTime.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) {
    return betweenSeconds < 1 ? '방금 전' : `${betweenSeconds}초 전`;
  }
  if (betweenTime < 60) {
    return `${betweenTime}분 전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간 전`;
  }

  return formatDate(createdTime);

  // const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  // if (betweenTimeDay < 31) {
  //   return `${betweenTimeDay}일 전`;
  // }
  // if (betweenTimeDay < 365) {
  //   return formatDate(writeTime, 'yyyy-MM-dd');
  // }

  // return `${Math.floor(betweenTimeDay / 365)}년 전`;
};
