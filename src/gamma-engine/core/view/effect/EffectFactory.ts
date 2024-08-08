import IEffect from './IEffect';
import Logger from '../../utils/Logger';
import DropShadowEffect from './DropShadowEffect';
import StrokeEffect from './StrokeEffect';
import GradientEffect from './GradientEffect';

export default class EffectFactory {

    public static create(effectData: IEffectDescription): IEffect {
        try {
            switch (effectData.type) {
                case 'dropShadow':
                    return new DropShadowEffect(effectData.options);
                case 'stroke':
                    return new StrokeEffect(effectData.options);
                case 'gradient':
                    return new GradientEffect(effectData.options)
                default:
                    throw new Error(`Unknown effect type: ${effectData.type}`);
            }
        } catch (e: unknown) {
            Logger.warning(e.toString());
            return null;
        }
    }
}

export interface IEffectDescription {
    type: string;
    options?: object;
}
