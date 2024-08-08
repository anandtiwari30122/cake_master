import ISwapViewsEffect from './ISwapViewsEffect';
import { Container, DisplayObject } from 'pixi.js';
import { Tweener } from '../../tweener/engineTween';

export default class SwapViewsEffectFadeOut implements ISwapViewsEffect {

    private time: number;

    constructor(time: number = 0.5) {
        this.time = time;
    }

    // PUBLIC API
    public apply(viewOut: DisplayObject, viewIn: DisplayObject, container: Container, onComplete?: () => unknown): void {
        container.addChildAt(viewIn, 0);

        Tweener.addTween(viewOut, {
            alpha: 0,
            time: this.time,
            transition: 'easeOutQuad',
            onComplete: () => {
                container.removeChild(viewOut);
                if (onComplete) {
                    onComplete();
                }
            }
        });
    }
}
