import ISwapViewsEffect from './ISwapViewsEffect';
import { Rectangle, DisplayObject, Container, Graphics } from 'pixi.js';
import { Tweener } from '../../tweener/engineTween';

export default class SwapViewsEffectUnmaskFromCenter implements ISwapViewsEffect {

    private fade: Graphics;
    private circleMask: Graphics;

    private fadeOutTime: number;
    private unmaskTime: number;

    constructor(maskRect: Rectangle, fadeOutTime: number = 0.5, unmaskTime: number = 0.5) {
        this.fade = new Graphics();
        this.fade.clear();
        this.fade.lineStyle(0);
        this.fade.beginFill(0x000000);
        this.fade.drawRect(maskRect.x, maskRect.y, maskRect.width, maskRect.height);
        this.fade.endFill();

        this.circleMask = new Graphics()
        this.circleMask.clear();
        this.circleMask.lineStyle(0);
        this.circleMask.beginFill(0xFF0000);
        this.circleMask.drawCircle(0, 0, Math.ceil(Math.sqrt(Math.pow(maskRect.width / 2, 2) + Math.pow(maskRect.height / 2, 2))));
        this.circleMask.endFill();
        this.circleMask.x = maskRect.width / 2;
        this.circleMask.y = maskRect.height / 2;

        this.fadeOutTime = fadeOutTime;
        this.unmaskTime = unmaskTime;
    }

    // PUBLIC API
    public apply(
        viewOut: DisplayObject,
        viewIn: DisplayObject,
        container: Container,
        onComplete?: () => unknown
    ): void {

        const outViewIndex: number = container.getChildIndex(viewOut);

        container.addChildAt(this.fade, outViewIndex + 1);
        this.fade.alpha = 0;
        Tweener.addTween(this.fade, {alpha: 1, time: this.fadeOutTime, transition: 'easeOutQuad', onComplete: () => {
            container.removeChild(viewOut);
            container.addChildAt(viewIn, container.getChildIndex(this.fade) + 1);
            container.addChildAt(this.circleMask, container.getChildIndex(this.fade) + 2);
            viewIn.mask = this.circleMask;
            this.circleMask.scale.set(0, 0);
        }});
        Tweener.addTween(this.circleMask.scale, {x: 1, y: 1, time: this.unmaskTime, transition: 'easeInOutQuad', delay: this.fadeOutTime, onComplete: () => {
            container.removeChild(this.fade);
            viewIn.mask = null;
            container.removeChild(this.circleMask);
            if (onComplete) {
                onComplete();
            }
        }});
    }
}
