import Logger from '../../utils/Logger';
import { DisplayObject, Point } from 'pixi.js';
import { Tweener } from '../../tweener/engineTween';

export default class ShakeEffect {
    public static apply(obj: DisplayObject, options: IShakeEffectOptions): void {
        const shakeNumber: number = options.shakeNumber || 3;
        let singleShakeDuration: number = options.singleShakeDuration || 1;
        const shakeDistance: Point = options.shakeDistance || new Point(5, 5);
        const initPos: Point = new Point(obj.position.x, obj.position.y);
        const durationDampening: number = options.durationDampening || 0;
        const distanceDampening: Point = options.distanceDampening || new Point();
        const randomizeDirection: boolean = options.randomizeDirection || false;
        let delay: number = options.delay || 0;
        const completeFunction: () => unknown = options.onComplete || null;

        const debug: boolean = options.debug || false;

        let randSign: () => number;
        if (randomizeDirection) {
            randSign = function() {
                return Math.random() > 0.5 ? 1 : -1;
            };
        } else {
            randSign = function() {
                return 1;
            };
        }

        Tweener.addTween(obj, {
            x: initPos.x + randSign() * shakeDistance.x,
            y: initPos.y + randSign() * shakeDistance.y,
            time: singleShakeDuration / 2,
            transition: 'easeOutQuad',
            delay: delay
        });

        delay += singleShakeDuration / 2;

        for (let i = 0; i < shakeNumber; i++) {
            Tweener.addTween(obj, {
                x: initPos.x + randSign() * shakeDistance.x,
                y: initPos.y + randSign() * shakeDistance.y,
                time: singleShakeDuration,
                transition: 'easeInOutQuad',
                delay: delay
            });

            delay += singleShakeDuration;
            singleShakeDuration = Math.max(0, singleShakeDuration - durationDampening);

            Tweener.addTween(obj, {
                x: initPos.x + randSign() * shakeDistance.x,
                y: initPos.y + randSign() * shakeDistance.y,
                time: singleShakeDuration,
                transition: 'easeInOutQuad',
                delay: delay
            });

            delay += singleShakeDuration;
            singleShakeDuration = Math.max(0, singleShakeDuration - durationDampening);

            shakeDistance.x = Math.max(0, shakeDistance.x - distanceDampening.x);
            shakeDistance.y = Math.max(0, shakeDistance.y - distanceDampening.y);
        }

        if (debug) {
            Logger.debug('Total time: ' + (delay + singleShakeDuration / 2));
        }

        Tweener.addTween(obj,
        {x: initPos.x,
            y: initPos.y,
            time: singleShakeDuration / 2,
            transition: 'easeOutQuad',
            delay: delay,
            onComplete: () => {
                if (completeFunction) {
                    completeFunction();
                }
            }
        });
    }
}

export interface IShakeEffectOptions {
    shakeNumber?: number; // defaults to 3
    singleShakeDuration?: number; // defaults to 1
    shakeDistance?: Point; // defaults to (5,5)
    distanceDampening?: Point; // defaults to (0,0)
    durationDampening?: number; // defaults to 0
    randomizeDirection?: boolean; // defaults to false
    delay?: number; // defaults to 0
    onComplete?: () => unknown; // defaults to null

    debug?: boolean; // defaults to false
}
