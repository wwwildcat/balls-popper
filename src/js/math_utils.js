export const getBallsPeriod = (time) => Math.sqrt(time) * 100;
export const getBallDuration = (time) => Math.sqrt(time) * 1000;

export const getCircleX = (left, top, d, y, sign) =>
    left + d / 2 + sign * Math.sqrt((y - top) * (d + top - y));
