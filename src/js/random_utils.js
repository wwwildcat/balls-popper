import {
    MIN_SIZE_RATE,
    MAX_SIZE_RATE,
    MIN_WIND_DURATION,
    MAX_WIND_DURATION,
    MIN_WIND_PERIOD,
    MAX_WIND_PERIOD,
} from './constants';

const getColor = () =>
    `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

const getGradientCenter = () => `${Math.random() * 100}% ${Math.random() * 100}%`;

const getRandomValue = (min, max) => min + Math.random() * (max - min);

export const getGradient = () =>
    `radial-gradient(circle at ${getGradientCenter()}, white, ${getColor()})`;

export const getSize = (totalWidth) =>
    getRandomValue(totalWidth * MIN_SIZE_RATE, totalWidth * MAX_SIZE_RATE);

export const getInitialTranslate = (size, totalWidth) => `${Math.random() * (totalWidth - size)}px`;

export const getWindDuration = () => getRandomValue(MIN_WIND_DURATION, MAX_WIND_DURATION);

export const getWindPeriod = () => getRandomValue(MIN_WIND_PERIOD, MAX_WIND_PERIOD);

export const getWindDirection = () => (Math.round(Math.random()) ? 'left' : 'right');
