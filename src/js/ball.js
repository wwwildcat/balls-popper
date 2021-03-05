import { NEEDLE_LENGTH, MAX_BLOW_RATE } from './constants.js';
import { getCircleX } from './math_utils.js';
import { getGradient, getSize, getInitialTranslate, getWindDuration } from './random_utils.js';

const animateBall = ({ duration, draw, timing }) => {
    const start = performance.now();

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        let progress = timing(timeFraction);

        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}

export default class Ball {
    constructor(container, totalWidth) {
        this.node = document.createElement('div');
        this.size = getSize(totalWidth);
        this.isPopped = false;

        this.node.className = 'game__ball';
        this.node.style.width = `${this.size}px`;
        this.node.style.height = `${this.size}px`;
        this.node.style.background = getGradient();
        this.node.style.bottom = `${-this.size}px`;
        this.node.style.setProperty('--translate-x', getInitialTranslate(this.size, totalWidth));

        container.append(this.node);
    }

    rise(duration, totalHeight, popCb, missCb) {
        const { node, size } = this;

        animateBall({
            duration: duration,
            timing: x => x,
            draw: progress => {
                node.style.setProperty('--translate-y', `${-progress * (totalHeight + size)}px`);

                const needleFraction = (totalHeight - NEEDLE_LENGTH) / (totalHeight + size);

                if(progress >= needleFraction) {
                    const { x: ballLeft, y: ballTop } = node.getBoundingClientRect();
                    const needleX = document.querySelector('.game__needle').getBoundingClientRect().x;

                if (ballTop + size / 2 >= NEEDLE_LENGTH
                    && needleX >= getCircleX(ballLeft, ballTop, size, NEEDLE_LENGTH, -1)
                    && needleX <= getCircleX(ballLeft, ballTop, size, NEEDLE_LENGTH, 1))
                    {
                        node.style.display = 'none';
                        this.isPopped = true;
                    }
                }

                if(progress === 1) {
                    this.getResult(popCb, missCb);
                    this.node.remove();
                    this.node = null;
                }
            }
        });
    }

    blow(totalWidth, direction) {
        const { node, size } = this;
        const currentTranslate = parseFloat(getComputedStyle(node).getPropertyValue('--translate-x'));

        const blowFraction = direction === 'left'
            ? 1 - (currentTranslate + size / 2) / totalWidth
            : (currentTranslate + size / 2) / totalWidth;
        const maxBlowValue = totalWidth * MAX_BLOW_RATE;
        const blowValue = direction === 'left'
            ? blowFraction * maxBlowValue
            : - blowFraction * maxBlowValue;

        animateBall({
            duration: getWindDuration(),
            timing: x => x,
            draw: progress => {
                let newTranslate = currentTranslate + progress * blowValue;

                if (newTranslate < 0) newTranslate = 0;
                if (newTranslate > totalWidth - size) newTranslate = totalWidth - size;

                node.style.setProperty('--translate-x', `${newTranslate}px`);
            }
        });
    }

    getResult(popCb, missCb) {
        if (this.isPopped) {
            popCb();
        } else {
            missCb();
        }
    }
}