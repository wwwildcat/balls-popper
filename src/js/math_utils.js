export const getNewBallsPeriod = time => Math.sqrt(time) * 100;
export const getNewBallDuration = time => Math.sqrt(time) * 1000;

export const getCircleX = (left, top, d, y, sign) =>
    left + d / 2 + sign * Math.sqrt((y - top) * (d + top - y));
