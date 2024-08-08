import ISwapViewsEffect from './ISwapViewsEffect';
import { Rectangle, DisplayObject, Container, Graphics } from 'pixi.js';
import { Tweener } from '../../tweener/engineTween';

export default class SwapViewsEffectFadeToBlack implements ISwapViewsEffect {

    private fade: Graphics;

    private fadeOutTime: number;
    private fadeInTime: number;

    constructor(maskRect: Rectangle, fadeOutTime: number = 0.5, fadeInTime: number = 0.5) {
        this.fade = new Graphics();
        this.fade.clear();
        this.fade.lineStyle(0);
        this.fade.beginFill(0x000000);
        this.fade.drawRect(maskRect.x, maskRect.y, maskRect.width, maskRect.height);
        this.fade.endFill();

        this.fadeOutTime = fadeOutTime;
        this.fadeInTime = fadeInTime;
    }

    // PUBLIC API
    public apply(viewOut: DisplayObject, viewIn: DisplayObject, container: Container, onComplete?: () => unknown): void {

        const outViewIndex: number = container.getChildIndex(viewOut);

        container.addChildAt(this.fade, outViewIndex + 1);
        this.fade.alpha = 0;
        Tweener.addTween(this.fade, {alpha: 1, time: this.fadeOutTime, transition: 'easeOutQuad', onComplete: () => {
            container.removeChild(viewOut);
            container.addChildAt(viewIn, outViewIndex);
        }});
        Tweener.addTween(this.fade, {alpha: 0, time: this.fadeInTime, transition: 'easeInQuad', delay: this.fadeOutTime, onComplete: () => {
            container.removeChild(this.fade);
            if (onComplete) {
                onComplete();
            }
        }});
    }
}
