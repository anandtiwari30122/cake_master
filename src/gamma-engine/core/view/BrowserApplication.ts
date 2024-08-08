import Application from './Application';
import ApplicationConfig from './ApplicationConfig';
import ScreenPixi from './ScreenPixi';
import ScreenConfig from './ScreenConfig';
import { Application as PixiApplication, Container } from 'pixi.js';
import { ScreenOrientation } from './ScreenOrientation';

export class BrowserApplication extends Application {

    private mainScreen: ScreenPixi;
    constructor(
        container: HTMLDivElement,
        config: Partial<ApplicationConfig> & Pick<ApplicationConfig, 'id' | 'container'>
    ) {
        super(config);

        const mainScreenConfig: ScreenConfig = {
            id: 'main',
            backgroundColor: 0x000000,
            baseWidth: config.baseWidth,
            baseHeight: config.baseHeight,
            fps: config.fps,
            debug: config.debug
        }

        // initialize one and only application screen (browser application)
        this.mainScreen = new ScreenPixi(mainScreenConfig);
        this.addScreen(this.mainScreen);

        // this.mainScreen.on('resize', this.onScreenResize, this);
        // this.onScreenResize();
    }

    public get width(): number {
        return this.mainScreen.width;
    }

    public get height(): number {
        return this.mainScreen.height;
    }

    public get stage(): Container {
        if(this.mainScreen) {
            return this.mainScreen.stage;
        } else {
            return null;
        }
    }

    public get pixi(): PixiApplication {
        return this.mainScreen.pixi;
    }

    public get orientation(): ScreenOrientation {
        return this.mainScreen.orientation;
    }

    // protected onScreenResize(width: number, height: number): void {
    //     this.mainScreen.stage.x = ;
    // }
}
