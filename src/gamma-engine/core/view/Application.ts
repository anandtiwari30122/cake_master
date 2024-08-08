import ApplicationConfig from './ApplicationConfig';
import { ResizeMethod } from './ResizeMethod';
import { Color } from 'pixi.js';
import Logger from '../utils/Logger';
import Screen from './Screen';

export default class Application {
    readonly defaultConfig: Partial<ApplicationConfig> = {
        backgroundColor: 0x000000,
        baseWidth: 1920,
        baseHeight: 1080,
        autoUpdateSizeToOrientation: false,
        fps: 60,
        resizeMethod: ResizeMethod.NONE,
        debug: true
    }

    readonly id: string;
    readonly container: HTMLDivElement

    protected baseWidth: number;
    protected baseHeight: number;

    readonly autoUpdateSizeToOrientation: boolean;
    readonly defaultResizeMethod: ResizeMethod;

    readonly screens: Screen[] = [];

    constructor(config: Partial<ApplicationConfig> & Pick<ApplicationConfig, 'id' | 'container'>) {
        // merge config with default values
        config = {...this.defaultConfig, ...config};

        this.id = config.id;
        this.container = config.container;
        this.baseWidth = config.baseWidth;
        this.baseHeight = config.baseHeight;
        this.autoUpdateSizeToOrientation = config.autoUpdateSizeToOrientation;
        this.defaultResizeMethod = config.resizeMethod;

        this.container.style.backgroundColor = Color.shared.setValue(config.backgroundColor).toHex();
        this.container.style.overflow = 'hidden';
        this.container.style.position = 'absolute';
        this.container.style.top = '50%';
        this.container.style.left = '50%';
        this.container.style.transform = 'translate(-50%, -50%)';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';

        // Attach resize listener
        window.addEventListener('resize', () => {
            this.onWindowResize();
        });
        window.addEventListener('orientationchange', () => {
            this.onWindowResize();
        });

        this.onWindowResize();
    }

    public addScreen(screen: Screen): void {
        if (this.getScreen(screen.id)) {
            Logger.warning(`Screen with id: ${screen.id} already exists!`);
            return;
        }

        this.screens.push(screen);

        this.container.prepend(screen.view);

        this.onWindowResize();
    }

    public getScreen(id: string): Screen | undefined {
        return this.screens.find((existingScreen) => {
            return existingScreen.id === id;
        });
    }

    public get numScreens(): number {
        return this.screens.length;
    }



    protected resize(availableWidth: number, availableHeight: number, resizeMethod?: ResizeMethod): void {
        resizeMethod = resizeMethod || this.defaultResizeMethod || ResizeMethod.NONE;

        let applicationWidth: number;
        let applicationHeight: number;
        let singleScreenWidth: number;
        let singleScreenHeight: number;

        let baseWidth:number = this.baseWidth;
        let baseHeight:number = this.baseHeight;
        if(this.autoUpdateSizeToOrientation) {
            if(availableHeight > availableWidth) {
                baseWidth = Math.min(this.baseWidth, this.baseHeight);
                baseHeight = Math.max(this.baseWidth, this.baseHeight);
            } else {
                baseWidth = Math.max(this.baseWidth, this.baseHeight);
                baseHeight = Math.min(this.baseWidth, this.baseHeight);
            }
        }
        this.baseWidth = baseWidth;
        this.baseHeight = baseHeight;

        // console.log(baseWidth, baseHeight);

        switch (resizeMethod) {
            case ResizeMethod.DEFAULT:
            case ResizeMethod.SHOW_ALL:
            case ResizeMethod.EXACT_FIT:
                applicationWidth = availableWidth;
                applicationHeight = availableHeight;
                singleScreenWidth = availableWidth;
                singleScreenHeight = Math.round(availableHeight / this.numScreens);
                break;

            case ResizeMethod.CONTAIN:
                let scale: number = availableWidth / baseWidth;
                if (scale * baseHeight > availableHeight) {
                    scale = availableHeight / baseHeight;
                }

                applicationWidth  = Math.round(scale * baseWidth);
                applicationHeight  = Math.round(scale * baseHeight);
                singleScreenWidth = applicationWidth;
                singleScreenHeight = Math.round(applicationHeight / this.numScreens);
                break;

            case ResizeMethod.NONE:
            default:
                applicationWidth = singleScreenWidth = baseWidth;
                applicationHeight = singleScreenHeight = baseHeight;
                break;
        }

        this.container.style.width = `${applicationWidth}px`;
        this.container.style.height = `${applicationHeight}px`;

        this.screens.forEach((screen: Screen) => {
            screen.resize(singleScreenWidth, singleScreenHeight, resizeMethod, this.autoUpdateSizeToOrientation);
        });
    }

    protected onWindowResize(): void {
        this.resize(window.innerWidth, window.innerHeight, this.defaultResizeMethod);
    }
}
