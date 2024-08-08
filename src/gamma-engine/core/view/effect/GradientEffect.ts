import IEffect from './IEffect';
import { DisplayObject, ITextStyle, Text, TEXT_GRADIENT, TextStyle } from 'pixi.js';

/**
 * Example:
 * {
 *      "effects":[
 *          {
 *              "type":"gradient"
 *              "options":{
 *                  "fill": [
 *                      "0xFFFFFF",
 *                      "0x010101",
 *                  ],
 *                  "stopPoints": [
 *                      0,
 *                      100
 *                  ],
 *                  "orientation": "X"
 *              },
 *          }
 *      ]
 * }
 */
export default class GradientEffect implements IEffect {
    constructor(private options: Partial<GradientEffectOptions>) {}

    public apply(displayObject: DisplayObject): void {
        if (displayObject instanceof Text) {
            const tf: Text = displayObject as Text;
            const ts: TextStyle | Partial<ITextStyle> = tf.style;
            ts.fill = this.options.fill;

            switch(this.options.orientation) {
                case 'X': ts.fillGradientType = TEXT_GRADIENT.LINEAR_HORIZONTAL;
                    break;
                case 'Y': ts.fillGradientType = TEXT_GRADIENT.LINEAR_VERTICAL;
                    break;
            }

            if(this.options.stopPoints) {
                ts.fillGradientStops = this.options.stopPoints;
            }

            tf.style = ts;
        } else {
            throw new Error('Unsupported DisplayObject for effect StrokeEffect');
        }
    }
}

export type GradientEffectOptions = {
    fill: string[] | number[];
    stopPoints: number[];
    orientation: 'X' | 'Y';
}
