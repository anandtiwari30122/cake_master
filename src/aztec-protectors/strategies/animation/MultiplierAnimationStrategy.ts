import { Text } from 'pixi.js';
import { Tweener } from '../../../gamma-engine/core/tweener/engineTween';
import { Transformation } from '../../model/Transformation';
import { IAnimationStrategy } from './IAnimationStrategy';

export class BaseMultiplierAnimationStrategy implements IAnimationStrategy<Text> {
    public async animate(target: Text, time: number, delay: number = 0, data: Transformation): Promise<void> {
        return new Promise(resolve => {
            const { translation, scale } = data;
            Tweener.addTween(target, {
                x: translation.x,
                time,
                delay,
                transition: 'linear'
            });

            Tweener.addTween(target, {
                y: translation.y,
                time,
                delay,
                transition: 'easeOutSine'
            });

            Tweener.addCaller(target, {
                count: 1,
                time,
                onComplete: () => resolve()
            });
        });
    }
}

export class ScalingMultiplierAnimationStrategy implements IAnimationStrategy<Text> {
    public async animate(target: Text, time: number, delay: number, data: Transformation): Promise<void> {
        return await new Promise(resolve => {
            const { translation, scale } = data;
            Tweener.addTween(target, {
                x: translation.x,
                time,
                delay,
                transition: 'linear'
            });

            Tweener.addTween(target, {
                y: translation.y,
                time,
                delay,
                transition: 'easeOutSine'
            });

            Tweener.addTween(target.scale, {
                x: scale.x,
                y: scale.y,
                time: 0.2,
                transition: 'easeOut',
                onComplete: () => {
                    Tweener.addTween(target.scale, {
                        x: 0.5,
                        y: 0.5,
                        time: 0.8,
                        transition: 'linear'
                    });
                }
            })

            Tweener.addCaller(target, {
                count: 1,
                time,
                delay,
                onComplete: () => resolve()
            });
        });
    }
}
export class BounceMultiplierAnimationStartegy implements IAnimationStrategy<Text> {
    public async animate(target: Text, time: number, delay: number, data: Transformation, times:number): Promise<void> {
        return new Promise(resolve => {
            const {x,y} = data.scale;
            for (let i = 0; i < times; i++) {
                Tweener.addTween(target.scale,{
                    x,
                    y,
                    time:time,
                    transition: 'easeOutBack',
                    delay: i*(time*2) *1.1,
                    onComplete: () => {
                        Tweener.addTween(target.scale, {
                            x: 1,
                            y: 1,
                            time: time,
                            transition: 'easeInOutSine',
                            onComplete:()=>{
                                if (i === times - 1)
                                    resolve()
                            }
                        });

                    }
                })

            }

        })
    }
}
export class InitializeMultiplierAnimationStartegy implements IAnimationStrategy<Text> {
    public async animate(target: Text, time: number, delay: number, data: Transformation): Promise<void> {
        return new Promise(resolve => {
            const { x, y } = data.scale;
            Tweener.addTween(target.scale, {
                x,
                y,
                time,
                transition: 'easeOutBack',
                delay,
                onComplete: () => resolve()
            });
        })
    }
}
