import { DisplayObject } from 'pixi.js';

export default interface IEffect {
    apply(displayObject: DisplayObject): void;
}
