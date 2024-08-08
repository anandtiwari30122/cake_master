import {Container, DisplayObject, Sprite} from 'pixi.js';
import SoundList from '../../gamma-engine/common/sound/SoundList';
import AssetsManager from '../../gamma-engine/core/assets/AssetsManager';
import Sound from '../../gamma-engine/core/sound/Sound';
import SoundManager from '../../gamma-engine/core/sound/SoundManager';
import {Tweener} from '../../gamma-engine/core/tweener/engineTween';
import IAdjustableLayout from '../../gamma-engine/core/view/IAdjustableLayout';
import {ScreenOrientation} from '../../gamma-engine/core/view/ScreenOrientation';
import {UpdateLayoutDescription} from '../../gamma-engine/core/view/UpdateLayoutDescription';
import SoundListExtended from '../sound/SoundListExtended';
import MainGameScreen from './MainGameScreen';

export default class MainScreenBackground extends Container implements IAdjustableLayout {
    private static DEFAULT_BACKGROUND_CHANNEL: string = 'ambient';

    private _theme: BackgroundType;
    private backgroundMusic: Sound;

    // VISUALS
    private backgroundSpriteNormal: Sprite;
    private mainGameScreen: MainGameScreen;
    private backgroundSpriteFreegame: Sprite;

    constructor(mainGameScreen: MainGameScreen) {
        super();
        this.mainGameScreen = mainGameScreen;
        this.backgroundSpriteNormal = new Sprite(AssetsManager.textures.get(BackgroundType.NORMAL));
        this.backgroundSpriteFreegame = new Sprite(AssetsManager.textures.get(BackgroundType.FREEGAME));
        this.setTheme(BackgroundType.NORMAL);
        this.updateBackgroundMusic();

    }

    public async setTheme(type: BackgroundType) {
        if (this._theme === type) {
            return;
        }

        this._theme = type;

        switch (this._theme) {
            case BackgroundType.NORMAL:
                this.swap(this.backgroundSpriteNormal);
                break;
            case BackgroundType.FREEGAME:
                SoundManager.play(SoundList.TRANSITION);
                this.swap(this.backgroundSpriteFreegame);
                break;
        }
    }

    private swap(background: Sprite): void {
        if (this.children.length == 0) {
            background.pivot.set(background.width / 2, background.height / 2);
            this.addChild(background);
            return;
        }
        const prevBackround: DisplayObject = this.children[0];
        Tweener.addTween(background, {
            alpha: 1,
            time: 0.75,
            transition: 'easeOutSine',
            onStart: () => {
                this.addChild(background);
                background.alpha = 0;
                background.pivot.set(background.width / 2, background.height / 2);
            },
            onComplete: () => {

                this.removeChild(prevBackround);
            }
        });

        if (this.backgroundMusic) {
            Tweener.addTween(this.backgroundMusic,
                {
                    volume: 0,
                    time: 0.45,
                    transition: 'linear',
                    onComplete: () => {
                        this.backgroundMusic.stop();
                        this.updateBackgroundMusic();
                    }
                });
        }

    }

    private updateBackgroundMusic(): void {
        this.backgroundMusic?.stop();
        this.backgroundMusic = SoundManager.loop({
            id: this._theme === BackgroundType.NORMAL ? SoundListExtended.BASEGAME_BACKGROUND : SoundListExtended.FREEGAME_BACKGROUND,
            volume: this._theme === BackgroundType.NORMAL ? 0.1 : 0.2,
            channel: MainScreenBackground.DEFAULT_BACKGROUND_CHANNEL
        });
    }

    public updateLayout(desc: UpdateLayoutDescription) {
        switch (desc.orientation) {
            case ScreenOrientation.HORIZONTAL:
                const xScale: number = desc.currentWidth / desc.baseWidth;
                const yScale: number = desc.currentHeight / desc.baseHeight;
                this.scale.set(xScale > yScale ? xScale : yScale);
                break;
            case ScreenOrientation.VERTICAL:
                this.scale.set((desc.currentHeight / desc.baseHeight) * 2);
                // Keep center after rescaling
                this.pivot.x = (desc.baseWidth / desc.currentWidth);
                // Ordinary offset
                this.x = 120;
                break;
        }

    }
}

export enum BackgroundType {
    NORMAL = 'main-screen-background',
    FREEGAME = 'freegame-screen-background'
}
