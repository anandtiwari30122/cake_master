import IEffect from './IEffect';
import { DisplayObject, ITextStyle, Text, TextStyle } from 'pixi.js';
import { degToRad } from '../../utils/Utils';

/**
 * Example:
 * {
 *      "effects":[
 *          {
 *              "type":"dropShadow"
 *              "options":{
 *                  "alpha":1,
 *                  "angle":0,
 *                  "blur":6,
 *                  "color":"0x42B0FF",
 *                  distance":0
 *              },
 *          }
 *      ]
 * }
 */
export default class DropShadowEffect implements IEffect {
    readonly options:DropShadowEffectOptions;

    constructor(options: Partial<DropShadowEffectOptions>) {
        this.options = {
            color: options.color,
            alpha: options.alpha,
            angle: options.angle ? degToRad(options.angle) : 0,
            blur: options.blur | 0,
            distance: options.distance | 0
        };
    }
    public apply(displayObject: DisplayObject): void {
        if(displayObject instanceof Text) {
            const tf:Text = displayObject as Text;
            const ts: TextStyle | Partial<ITextStyle> = tf.style;
            ts.dropShadow = true;
            ts.dropShadowAlpha = this.options.alpha;
            ts.dropShadowAngle = this.options.angle;
            ts.dropShadowBlur = this.options.blur;
            ts.dropShadowColor = this.options.color;
            ts.dropShadowDistance = this.options.distance;
            ts.padding = Math.max(ts.padding, this.options.distance + this.options.blur);
            tf.style = ts;
        } else {
            throw new Error('Unsupported DisplayObject for effect DropShadowEffect');
        }
    }
}

export interface DropShadowEffectOptions {
    color: string | number;
    alpha: number;
    angle: number;
    blur: number;
    distance: number;
}
