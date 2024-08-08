import { AnimatedSprite, Container, Graphics, Point } from 'pixi.js';
import LayoutElement from '../../core/view/model/LayoutElement';
import LayoutBuilder from '../../core/utils/LayoutBuilder';
import ReelView from './ReelView';
import { FrameByFrameIconAnimation, SymbolData } from './SymbolData';
import { ReelConfiguration, ReelDescription, ReelSetDescription } from '../model/SlotMachineDescription';
import ControlEvent from '../../core/control/event/ControlEvent';
import { SlotGameEvent } from '../control/event/SlotGameEvent';
import { ReelsViewEvent } from './event/ReelsViewEvent';
import SymbolView from './SymbolView';
import { SymbolViewEvent } from './event/SymbolViewEvent';
import { removeArrayElement } from '../../core/utils/Utils';
import AssetsManager from '../../core/assets/AssetsManager';
import { SoundData } from '../../core/sound/SoundData';
import { Tweener } from '../../core/tweener/engineTween';

export default class ReelsView extends Container {
    public static defaultReelConfiguration: ReelConfiguration = {
        symbolSize: new Point(212, 212),
        winFrameAnimation: null,
        anticipationTime: 0,
        fallingCascade: false
    }

    private reelViews: ReelView[] = [];
    private reelSetDescription: ReelSetDescription;
    private symbols: Map<number, SymbolData> = new Map<number, SymbolData>();

    private gameSpeedLevel: number = 0;

    private symbolWinAnimations: SymbolView[] = [];
    private winFrameAnimations: AnimatedSprite[][] = [];
    protected anticipationDelay: number = 0;

    protected reelConfiguration: ReelConfiguration;

    // VIEWS
    public reelsContainer: Container;
    public symbolAnimationContainer: Container;
    public symbolAnimationContainerMask: Graphics;
    public winFrameAnimationContainer: Container;

    constructor(le: LayoutElement, reelSetDescription: ReelSetDescription, symbols: SymbolData[], reelConfiguration: ReelConfiguration = ReelsView.defaultReelConfiguration) {
        super();

        this.reelSetDescription = reelSetDescription;
        this.reelConfiguration = reelConfiguration;

        for (const symbol of symbols) {
            this.symbols.set(symbol.id, symbol);
        }

        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        if (this.symbolAnimationContainerMask) {
            this.symbolAnimationContainer.mask = this.symbolAnimationContainerMask;
        }

        const winFrameAnimation: FrameByFrameIconAnimation = this.reelConfiguration.winFrameAnimation;
        if (winFrameAnimation) {
            if ('animationPrefix' in winFrameAnimation) {
                winFrameAnimation.animationTextures = AssetsManager.getAnimationTextures(winFrameAnimation.animationPrefix);
            }

            for (let i = 0; i < this.reelViews.length; i++) {
                const rv: ReelView = this.reelViews[i];
                this.winFrameAnimations.push([]);
                for (let j = 0; j < rv.numRows; j++) {
                    const winFrameAnimatedSprite: AnimatedSprite = new AnimatedSprite(winFrameAnimation.animationTextures);
                    winFrameAnimatedSprite.animationSpeed = winFrameAnimation.fps / 60;
                    winFrameAnimatedSprite.anchor.set(0.5, 0.5);
                    winFrameAnimatedSprite.gotoAndStop(0);
                    winFrameAnimatedSprite.loop = true;
                    winFrameAnimatedSprite.visible = false;
                    this.winFrameAnimations[i].push(winFrameAnimatedSprite);
                    this.winFrameAnimationContainer.addChild(winFrameAnimatedSprite);
                }
            }
        }


        // // TESTING CODE
        // this.eventMode = 'dynamic';
        // this.cursor = 'pointer';
        // let s: boolean = true;
        // this.on('pointerup', () => {
        //     if (s) {
        //         this.spin();
        //     } else {
        //         this.stop([
        //             [randomArrayElement(this.reelSetDescription.reels[0].availableSymbols), randomArrayElement(this.reelSetDescription.reels[0].availableSymbols), randomArrayElement(this.reelSetDescription.reels[0].availableSymbols)],
        //             [randomArrayElement(this.reelSetDescription.reels[1].availableSymbols), randomArrayElement(this.reelSetDescription.reels[1].availableSymbols), randomArrayElement(this.reelSetDescription.reels[1].availableSymbols)],
        //             [randomArrayElement(this.reelSetDescription.reels[2].availableSymbols), randomArrayElement(this.reelSetDescription.reels[2].availableSymbols), randomArrayElement(this.reelSetDescription.reels[2].availableSymbols)],
        //             [randomArrayElement(this.reelSetDescription.reels[3].availableSymbols), randomArrayElement(this.reelSetDescription.reels[3].availableSymbols), randomArrayElement(this.reelSetDescription.reels[3].availableSymbols)],
        //             [randomArrayElement(this.reelSetDescription.reels[4].availableSymbols), randomArrayElement(this.reelSetDescription.reels[4].availableSymbols), randomArrayElement(this.reelSetDescription.reels[4].availableSymbols)],
        //         ]);
        //     }
        //     s = !s;
        // });
    }

    // PUBLIC API
    public spin(gameSpeedLevel: number, soundData: SoundData): void {
        this.reset();

        this.gameSpeedLevel = gameSpeedLevel;


        this.reelViews.forEach((reelView, index)=>{
            reelView.spin(this.gameSpeedLevel, (this.reelConfiguration.fallingCascade&& this.gameSpeedLevel==0)?(0.1*index):0, soundData);
        })

        new ControlEvent(SlotGameEvent.REELS_STARTED).dispatch();

        if (this.gameSpeedLevel == 0) {
            Tweener.addCaller(this, {
                count: 1,
                time: 1,
                onComplete: () => {
                    if (this.gameSpeedLevel == 0)
                        new ControlEvent(SlotGameEvent.SPIN_TIME_LAPSED).dispatch();
                }
            });
        } else {
            new ControlEvent(SlotGameEvent.SPIN_TIME_LAPSED).dispatch();
        }
    }

    public async stop(output: number[][],
                      sounds: {
                          stopSoundData: SoundData,
                          anticipationSoundData: SoundData
                      },
                      gameSpeedLevel: number = -1,
                      anticipationReelIds: number[] = null
    ): Promise<void> {
        if (gameSpeedLevel != -1) {
            this.gameSpeedLevel = gameSpeedLevel;
        }

        this.anticipationDelay = 0;

        const stopPromises: Promise<void>[] = [];
        for (let i = 0; i < output.length; i++) {
            const triggerAnticipation: boolean = (anticipationReelIds && anticipationReelIds.length > 0 && anticipationReelIds.includes(i));
            stopPromises.push(this.stopReel(i, output[i], sounds, triggerAnticipation));
        }
        await Promise.all(stopPromises);
    }

    public animateWins(symbolPattern: number[][], times: number = 1, visibleOnComplete: boolean = true): void {
        // const sm: SlotMachine = container.resolve(SlotMachine);

        for (let i = 0; i < symbolPattern.length; i++) {
            const reelView: ReelView = this.reelViews[i];
            const reelPattern: number[] = symbolPattern[i];
            const visibleSymbols: SymbolView[] = reelView.getVisibleSymbols();
            for (let j = 0; j < reelPattern.length; j++) {
                if (reelPattern[j]) {

                    const symbol: SymbolView = visibleSymbols[j];
                    this.symbolWinAnimations.push(symbol);

                    // //Select proper symbol to attach symbol on.
                    const symbolNewParent: Container = this.symbolAnimationContainer;
                    // if(this.specialSymbolAnimationContainer) {
                    //     //case where are ex. expanded or expanding wilds
                    //     if (sm.description.wildcards.find((wild:WildcardDescription) => wild.symbolId == symbol.id && (wild.type==WildcardType.EXPANDING || wild.type==WildcardType.EXPANDED))) {
                    //         symbolNewParent = this.specialSymbolAnimationContainer;
                    //     }
                    // }

                    symbol.reattachTo(symbolNewParent);

                    symbol.once(SymbolViewEvent.WIN_ANIMATION_COMPLETE, () => {
                        symbol.setStaticIconVisibility(visibleOnComplete);
                        symbol.reset();
                        this.resetWinFrameAnimation(i, j);
                        removeArrayElement(this.symbolWinAnimations, symbol);
                        if (!this.symbolWinAnimations.length) {
                            this.emit(ReelsViewEvent.WIN_ANIMATION_COMPLETE);
                        }
                    });
                    symbol.animateWin(times);

                    if(!symbol.isWinFrameEnabled())
                        continue;

                    // show win frame if any
                    if (this.winFrameAnimations.length) {
                        const winFrameAnimation: AnimatedSprite = this.winFrameAnimations[i][j];
                        winFrameAnimation.position.set(symbol.x, symbol.y);
                        winFrameAnimation.play();
                        winFrameAnimation.visible = true;
                    }
                }
            }
        }
    }

    public async cascade(symbolDisappearPattern: number[][], targetOutput: number[][]): Promise<void> {
        const cascadePromises: Promise<void>[] = [];
        for (let i = 0; i < symbolDisappearPattern.length; i++) {
            cascadePromises.push(this.reelViews[i].cascade(symbolDisappearPattern[i], targetOutput[i]));
        }
        await Promise.all(cascadePromises);
    }

    public reset(): void {
        for (const symbol of this.symbolWinAnimations) {
            symbol.off(SymbolViewEvent.WIN_ANIMATION_COMPLETE);
            symbol.reset();
        }
        this.symbolWinAnimations = [];

        if (this.winFrameAnimations.length) {
            for (let i = 0; i < this.reelViews.length; i++) {
                const rv: ReelView = this.reelViews[i];
                for (let j = 0; j < rv.numRows; j++) {
                    this.resetWinFrameAnimation(i, j);
                }
            }
        }
    }

    public getReelViews(): ReelView[] {
        return [...this.reelViews];
    }

    // PRIVATE API
    protected customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'ReelView':
                const reelDescription: ReelDescription = this.reelSetDescription.reels[this.reelViews.length];
                instance = new ReelView(le, reelDescription, this.symbols, this.reelConfiguration.symbolSize, this.reelConfiguration.fallingCascade);
                this.reelViews.push(instance as ReelView);
                break;
        }

        return instance;
    }

    protected async stopReel(index: number, output: number[], sounds: {
        stopSoundData: SoundData,
        anticipationSoundData: SoundData
    }, anticipation: boolean): Promise<void> {
        return new Promise((resolve) => {
            const rv: ReelView = this.reelViews[index];
            let stopDelay: number = (this.reelConfiguration.fallingCascade && this.gameSpeedLevel == 0) ? index * 0.12: 0;

            if (anticipation && this.gameSpeedLevel === 0) {
                rv.anticipationVisibility(1, stopDelay + this.anticipationDelay, sounds.anticipationSoundData);
                this.anticipationDelay += (stopDelay + this.reelConfiguration.anticipationTime);
            }

            stopDelay += this.anticipationDelay;
            Tweener.addTween(rv, {
                time: stopDelay,
                onComplete: () => {
                    rv.stop(output, sounds.stopSoundData)
                      .then(() => {
                          resolve();
                      });
                }
            });
        })
    }

    protected resetWinFrameAnimation(indexX: number, indexY: number): void {
        if (!this.winFrameAnimations || this.winFrameAnimations.length === 0)
            return;

        const winFrameAnimation: AnimatedSprite = this.winFrameAnimations[indexX][indexY];
        winFrameAnimation.gotoAndStop(0);
        winFrameAnimation.visible = false;
    }
}
