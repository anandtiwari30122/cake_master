import { DisplayObject } from 'pixi.js';
import { PopupAnimationParams } from '../view/popup/PopupAnimationConfig';
import { Tweener } from '../../core/tweener/engineTween';

export class PopupUtils {
    public static DoScale(dp: DisplayObject, params: PopupAnimationParams, startScale: number, onStart: () => void = null, onComplete: () => void = null): void {
        if (!params)
            return;

        dp.scale.set(startScale);
        Tweener.addTween(dp.scale, {
            x: params.value,
            y: params.value,
            time: params.time ?? 1,
            transition: params.transition ?? 'easeOutSine',
            onStart: () => {
                if (onStart)
                    onStart();
            },
            onComplete: () => {
                if (onComplete)
                    onComplete();
            }
        })
    }

    public static DoAlphaFade(dp: DisplayObject, params: PopupAnimationParams, onStart: () => void = null, onComplete: () => void = null): void {
        if (!params)
            return;

        Tweener.addTween(dp, {
            alpha: params.value,
            time: params.time ?? 1,
            transition: params.transition ?? 'easeOutSine',
            onStart: () => {
                if (onStart)
                    onStart();
            },
            onComplete: () => {
                if (onComplete)
                    onComplete();
            }
        })
    }

    public static DoChangeY(dp: DisplayObject, params: PopupAnimationParams, startY: number, onStart: () => void = null, onComplete: () => void = null): void {
        if (!params)
            return;

        dp.y = startY;
        Tweener.addTween(dp, {
            y: params.value,
            time: params.time ?? 1,
            transition: params.transition ?? 'easeOutSine',
            onStart: () => {
                if (onStart)
                    onStart();
            },
            onComplete: () => {
                if (onComplete)
                    onComplete();
            }
        })
    }

    public static DoChangePivotY(dp: DisplayObject, params: PopupAnimationParams, startY: number, endY: number, onStart: () => void = null, onComplete: () => void = null): void {
        if (!params)
            return;
        
        dp.pivot.y = startY;
        Tweener.addTween(dp.pivot, {
            y: endY,
            time: params.time ?? 1,
            transition: params.transition ?? 'easeOutSine',
            onStart: () => {
                if (onStart)
                    onStart();
            },
            onComplete: () => {
                if (onComplete)
                    onComplete();
            }
        })
    }
}
