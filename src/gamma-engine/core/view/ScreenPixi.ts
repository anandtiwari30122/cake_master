import { Application, Container, IRenderer, Ticker } from 'pixi.js';
import ScreenConfig from './ScreenConfig';
import { ResizeMethod } from './ResizeMethod';
import StatsPanel from '../utils/StatsPanel';
import Screen from './Screen';

export default class ScreenPixi extends Screen {

    readonly pixi: Application;

    constructor(config: Partial<ScreenConfig> & Pick<ScreenConfig, 'id'>) {
        super(config);

        // Create PIXI application
        this.pixi = new Application({
            backgroundColor: config.backgroundColor,
            width: this.baseWidth,
            height: this.baseHeight,
            autoDensity: true,
            resolution: window.devicePixelRatio || 1,
            hello: true
        });

        console.log(`window.devicePixelRatio: ${window.devicePixelRatio}`);

        Ticker.shared.maxFPS = config.fps;

        this.view.id = this.id;

        // Display stats if needed
        if (config.debug) {
            StatsPanel.create(this.pixi);
        }
    }

    public get view(): HTMLElement {
        return this.pixi.view as HTMLCanvasElement;
    }

    public get stage(): Container {
        return this.pixi.stage;
    }

    protected doResize(availableWidth: number, availableHeight: number, resizeMethod: ResizeMethod, autoUpdateSizeToOrientation: boolean): void {
        const renderer: IRenderer = this.pixi.renderer;

        let baseWidth: number = this.baseWidth;
        let baseHeight: number = this.baseHeight;
        let screenWidth: number;
        let screenHeight: number;
        let rendererWidth: number;
        let rendererHeight: number;
        let stageScaleX: number = 1;
        let stageScaleY: number = 1;

        if (autoUpdateSizeToOrientation) {
            if (this._orientation == this.baseOrientation) {
                baseWidth = this.baseWidth;
                baseHeight = this.baseHeight;
            } else {
                baseWidth = this.baseHeight;
                baseHeight = this.baseWidth;
            }
        }

        let scale: number = availableWidth / baseWidth;
        if (scale * baseHeight > availableHeight) {
            scale = availableHeight / baseHeight;
        }

        // Logger.debug(`Base size: ${baseWidth}x${baseHeight}`);

        switch (resizeMethod) {
            case ResizeMethod.DEFAULT:
                this._width = screenWidth = availableWidth;
                this._height = screenHeight = availableHeight;
                rendererWidth = availableWidth;
                rendererHeight = availableHeight;
                break;
            case ResizeMethod.CONTAIN:
                this._width = baseWidth;
                this._height = baseHeight;
                screenWidth = rendererWidth = Math.ceil(scale * baseWidth);
                screenHeight = rendererHeight = Math.ceil(scale * baseHeight);
                stageScaleX = stageScaleY = scale;
                break;
            case ResizeMethod.SHOW_ALL:
                screenWidth = rendererWidth = availableWidth;
                screenHeight = rendererHeight = availableHeight;
                stageScaleX = stageScaleY = scale;
                this._width = rendererWidth / scale;
                this._height = rendererHeight / scale;
                break;
            case ResizeMethod.EXACT_FIT:
                this._width = baseWidth;
                this._height = baseHeight;
                screenWidth = rendererWidth = availableWidth;
                screenHeight = rendererHeight = availableHeight;
                stageScaleX = availableWidth / baseWidth;
                stageScaleY = availableHeight / baseHeight;
                break;
            case ResizeMethod.NONE:
            default:
                this._width = screenWidth = rendererWidth = baseWidth;
                this._height = screenHeight = rendererHeight = baseHeight;
                break;
        }

        this.view.style.width = `${screenWidth}px`;
        this.view.style.height = `${screenHeight}px`;

        renderer.resize(rendererWidth, rendererHeight);

        this.stage.scale.set(stageScaleX, stageScaleY);

        // console.log(`Screen resized: ${this._width}x${this._height} Renderer resized: ${rendererWidth}x${rendererHeight}`);
    }
}
