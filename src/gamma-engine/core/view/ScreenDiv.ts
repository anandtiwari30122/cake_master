import { Color } from 'pixi.js';
import ScreenConfig from './ScreenConfig';
import { ResizeMethod } from './ResizeMethod';
import Screen from './Screen';

export default class ScreenDiv extends Screen {

    readonly div: HTMLDivElement;

    constructor(config: Partial<ScreenConfig> & Pick<ScreenConfig, 'id'>) {
        super(config);

        // Create HTML Div
        this.div = document.createElement('div');
        this.div.id = this.id;
        this.div.style.backgroundColor = Color.shared.setValue(config.backgroundColor).toHex();
    }

    public get view(): HTMLElement {
        return this.div;
    }

    protected doResize(availableWidth: number, availableHeight: number, resizeMethod?: ResizeMethod): void {
        switch (resizeMethod) {
            case ResizeMethod.DEFAULT:
            case ResizeMethod.SHOW_ALL:
            case ResizeMethod.EXACT_FIT:
                this._width = availableWidth;
                this._height = availableHeight;
                break;

            case ResizeMethod.CONTAIN:
                let scale: number = availableWidth / this.baseWidth;
                if (scale * this.baseHeight > availableHeight) {
                    scale = availableHeight / this.baseHeight;
                }

                this._width = Math.ceil(scale * this.baseWidth);
                this._height  = Math.ceil(scale * this.baseHeight);
                break;

            case ResizeMethod.NONE:
            default:
                this._width = this.baseWidth;
                this._height = this.baseHeight;
                break;

        }

        this.view.style.width = `${this._width}px`;
        this.view.style.height = `${this._height}px`;
    }
}
