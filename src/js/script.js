import Ball from './ball';
import { NEEDLE_WIDTH, NEEDLE_STEP_RATE, GAME_DURATION, TIMER_STEP } from './constants';
import { getBallsPeriod, getBallDuration } from './math_utils';
import { getWindDirection, getWindPeriod } from './random_utils';

const startContainer = document.querySelector('#start');
const startButton = document.querySelector('.start__button');
const gameContainer = document.querySelector('#game');
const resultContainer = document.querySelector('#result');
const popValue = document.querySelector('.result__pop-value');
const missValue = document.querySelector('.result__miss-value');

startButton.onclick = () => {
    startContainer.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    const needle = document.querySelector('.game__needle');
    const timer = document.querySelector('.game__timer-value');

    const { innerWidth, innerHeight } = window;

    let remainingTime = GAME_DURATION;
    let popCounter = 0;
    let missCounter = 0;
    let needleMoveCounter = 0;
    const balls = [];

    const popCallback = () => {
        popCounter++;
    };

    const missCallback = () => {
        missCounter++;
    };

    document.body.onkeydown = ({ code }) => {
        const needleStep = innerWidth * NEEDLE_STEP_RATE;
        const needleX = needle.getBoundingClientRect().x;

        if (code === 'ArrowRight' && needleX + needleStep + NEEDLE_WIDTH < innerWidth) {
            needleMoveCounter++;
        } else if (code === 'ArrowLeft' && needleX > needleStep + NEEDLE_WIDTH) {
            needleMoveCounter--;
        }

        needle.style.setProperty('--translate-x', `${needleMoveCounter * needleStep}px`);
    };

    let timerId = setTimeout(
        function setNewTime() {
            remainingTime--;
            timer.innerHTML = remainingTime;

            if (!remainingTime) {
                clearTimeout(timerId);

                popValue.innerHTML = popCounter;
                missValue.innerHTML = missCounter;

                gameContainer.classList.add('hidden');
                setTimeout(() => {
                    resultContainer.classList.remove('hidden');
                }, TIMER_STEP / 2);
            } else {
                timerId = setTimeout(setNewTime, TIMER_STEP, remainingTime);
            }
        },
        TIMER_STEP,
        remainingTime
    );

    let newBallsId = setTimeout(function getBall() {
        const ball = new Ball(gameContainer, innerWidth);
        const ballDuration = getBallDuration(remainingTime);

        balls.push(ball);
        ball.rise(ballDuration, innerHeight, popCallback, missCallback);

        if (!remainingTime) {
            clearTimeout(newBallsId);
        } else {
            newBallsId = setTimeout(getBall, getBallsPeriod(remainingTime));
        }
    }, getBallsPeriod(remainingTime));

    let windId = setTimeout(function getWind() {
        const direction = getWindDirection();

        balls.forEach((ball) => {
            if (ball.node && !ball.isPopped) {
                ball.blow(innerWidth, direction);
            }
        });

        if (!remainingTime) {
            clearTimeout(windId);
        } else {
            windId = setTimeout(getWind, getWindPeriod());
        }
    }, getWindPeriod());
};
