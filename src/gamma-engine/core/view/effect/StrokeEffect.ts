import IEffect from './IEffect';
import { DisplayObject, ITextStyle, Text, TextStyle, TextStyleLineJoin } from 'pixi.js';

/**
 * Example:
 * {
 *      "effects":[
 *          {
 *              "type":"stroke"
 *              "options":{
 *                  "color":"0xFFFFFF",
 *                  "lineJoin":"round",
 *                  "thickness":1
 *              },
 *          }
 *      ]
 * }
 */
export default class StrokeEffect implements IEffect {
    readonly options: StrokeEffectOptions;

    constructor(options: Partial<StrokeEffectOptions>) {
        this.options = {
            color: options.color,
            thickness: options.thickness,
            lineJoin: options.lineJoin || 'round'
        };
    }

    public apply(displayObject: DisplayObject): void {
        if (displayObject instanceof Text) {
            const tf: Text = displayObject as Text;
            const ts: TextStyle | Partial<ITextStyle> = tf.style;
            ts.stroke = this.options.color;
            ts.strokeThickness = this.options.thickness;
            ts.padding = Math.max(ts.padding, this.options.thickness);
            ts.lineJoin = this.options.lineJoin;
            tf.style = ts;
        } else {
            throw new Error('Unsupported DisplayObject for effect StrokeEffect');
        }
    }
}

export interface StrokeEffectOptions {
    color: string | number;
    thickness: number;
    lineJoin: TextStyleLineJoin;
}
