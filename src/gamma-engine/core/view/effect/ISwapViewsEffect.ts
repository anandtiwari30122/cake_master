import { Container, DisplayObject } from 'pixi.js';

export default interface ISwapViewsEffect {
    apply(viewOut: DisplayObject, viewIn: DisplayObject, container: Container, onComplete?: () => unknown): void;
}
