import { ResizeMethod } from './ResizeMethod';
import ScreenConfig from './ScreenConfig';
import EventEmitter from 'eventemitter3';
import { ScreenOrientation } from './ScreenOrientation';

export default abstract class Screen extends EventEmitter {
    protected defaultConfig: Partial<ScreenConfig> = {
        backgroundColor: 0x000000,
        baseWidth: 1920,
        baseHeight: 1080,
        fps: 0, // no limit
        debug: true
    }

    readonly id: string;
    readonly baseWidth: number;
    readonly baseHeight: number;
    readonly baseOrientation: ScreenOrientation;

    protected _width: number;
    protected _height: number;
    protected _orientation: ScreenOrientation;

    protected constructor(config: Partial<ScreenConfig> & Pick<ScreenConfig, 'id'>) {
        super();

        // merge config with default values
        config = {...this.defaultConfig, ...config};

        this.id = config.id;
        this.baseWidth = this._width = config.baseWidth;
        this.baseHeight = this._height = config.baseHeight;
        this.baseOrientation = this._orientation = this.calculateOrientation(this.baseWidth, this.baseHeight);
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get orientation(): ScreenOrientation {
        return this._orientation;
    }

    public abstract get view(): HTMLElement;

    public resize(availableWidth: number, availableHeight: number, resizeMethod: ResizeMethod, autoUpdateSizeToOrientation: boolean): void {
        // Logger.debug(`Screen ${this.id} resize: ${availableWidth}, ${availableHeight}`);

        resizeMethod = resizeMethod || ResizeMethod.NONE;

        const oldWidth: number = this._width;
        const oldHeight: number = this._height;
        const oldOrientation: ScreenOrientation = this.orientation;

        this._orientation = this.calculateOrientation(availableWidth, availableHeight);

        // each screen type should implement its own resizing logic
        this.doResize(availableWidth, availableHeight, resizeMethod, autoUpdateSizeToOrientation);

        if (oldWidth != this._width || oldHeight != this.height) {
            if (oldOrientation != this.orientation) {
                this.emit('change-orientation', this.orientation);
            }
            this.emit('resize', this.width, this.height);
        }
    }

    protected calculateOrientation(width: number, height: number): ScreenOrientation {
        return height > width ? ScreenOrientation.VERTICAL : ScreenOrientation.HORIZONTAL
    }

    protected abstract doResize(availableWidth: number, availableHeight: number, resizeMethod: ResizeMethod, autoUpdateSizeToOrientation: boolean): void;
}
