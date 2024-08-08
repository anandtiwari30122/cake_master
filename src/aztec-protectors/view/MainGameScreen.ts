import {Point, Sprite} from 'pixi.js';
import {container, inject, injectable} from 'tsyringe';
import MultiFunctionalButton from '../../gamma-engine/common/view/MultiFunctionalButton';
import TotalWinFrame from '../../gamma-engine/common/view/TotalWinFrame';
import UIPanelDesktop from '../../gamma-engine/common/view/ui/UIPanelDesktop';
import UIPanelMobileVertical from '../../gamma-engine/common/view/ui/UIPanelMobileVertical';
import AssetsManager from '../../gamma-engine/core/assets/AssetsManager';
import ControlEvent from '../../gamma-engine/core/control/event/ControlEvent';
import LayoutBuilder from '../../gamma-engine/core/utils/LayoutBuilder';
import AdjustableLayoutContainer from '../../gamma-engine/core/view/AdjustableLayoutContainer';
import LayoutElement from '../../gamma-engine/core/view/model/LayoutElement';
import {UpdateLayoutDescription} from '../../gamma-engine/core/view/UpdateLayoutDescription';
import {SlotGameEvent} from '../../gamma-engine/slots/control/event/SlotGameEvent';
import {SlotMachineEvent} from '../../gamma-engine/slots/model/event/SlotMachineEvent';
import {
    CombinationWin,
    FreespinWin,
    ScatterWin,
    SpinResult
} from '../../gamma-engine/slots/model/RoundResult';
import SlotMachine from '../../gamma-engine/slots/model/SlotMachine';
import {SlotMachineState} from '../../gamma-engine/slots/model/SlotMachineState';
import Wallet from '../../gamma-engine/slots/model/Wallet';
import {ReelsViewEvent} from '../../gamma-engine/slots/view/event/ReelsViewEvent';
import ReelsView from '../../gamma-engine/slots/view/ReelsView';
import {MultiplierEvent} from '../model/MultiplierEvent';
import GameService from '../services/GameService';
import SoundListExtended from '../sound/SoundListExtended';
import Character from './Character';
import Logo from './Logo';
import MainScreenBackground from './MainScreenBackground';
import Multiplier from './Multiplier';
import ReelsBackground from './ReelsBackground';
import {SymbolsList} from './SymbolsList';

@injectable()
export default class MainGameScreen extends AdjustableLayoutContainer {
    private totalWinFrameBaseYPositions: {
        desktop: number;
        mobile: number;
    };

    private slotMachine: SlotMachine;

    private currentLineWinIndex: number = -1;
    private currentLineWinCycles: number = 0;
    private maxLineWinCycles: number = 2;

    // VIEWS
    public background: MainScreenBackground;
    public reels: ReelsView;
    public reelsBackground: ReelsBackground;
    public uiPanelMobileVertical: UIPanelMobileVertical;
    public uiPanelDesktop: UIPanelDesktop;
    public totalWinFrame: TotalWinFrame;
    public totalWinFrameDesktop: TotalWinFrame;

    public character: Character;
    public logo: Logo;

    private multiplier: Multiplier;

    //private reelHeader: ReelHeader;

    constructor(@inject(SlotMachine) slotMachine: SlotMachine) {
        super(AssetsManager.layouts.get('main-screen'));

        this.slotMachine = slotMachine;

        LayoutBuilder.create(this.layout, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.totalWinFrameBaseYPositions = {
            desktop: this.totalWinFrameDesktop.y,
            mobile: this.totalWinFrame.y,
        };

        this.slotMachine.on(SlotMachineEvent.STATE_CHANGED, this.onSlotMachineStateChanged, this);
        //this.btnMultiFunctional.on(MultiFunctionalButtonEvent.STATE_CHANGED, this.onMultiFunctionalButtonStateChanged, this);
        // this.multiplier.on(MultiplierEvent.ON_MULTIPLIER_ANIMATION_END, this.updateTotalMultiplier, this);
        // this.multiplier.on(MultiplierEvent.ON_TOTAL_MULTIPLIER_ANIMATION_END, this.updateReelHeader, this);

        this.on('added', this.onAdded, this);

        this.addChild(new Sprite(AssetsManager.textures.get('black-rect')));

        // // TESTING CODE
        // this.eventMode = 'dynamic';
        // this.cursor = 'pointer';
        // let s: number = 0;
        // this.on('pointerup', () => {
        //     switch (s) {
        //         case 0:
        //             this.btnMultiFunctional.setText('FEATURE BUY',true);
        //             this.btnMultiFunctional.state = MultiFunctionalButtonState.FEATURE_BUY;
        //             break;
        //         case 1:
        //             this.btnMultiFunctional.setText('FREESPINS LEFT: 0',true);
        //             this.btnMultiFunctional.state = MultiFunctionalButtonState.FREESPINS_LEFT;
        //             break;
        //         case 2:
        //             this.btnMultiFunctional.state = MultiFunctionalButtonState.INVISIBLE;
        //             break;
        //     }
        //     s = (s + 1) % 3;
        // });
    }

    // PRIVATE API
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'ReelsBackground':
                instance = new ReelsBackground();
                break;
            case 'ReelsView':
                instance = new ReelsView(le, this.slotMachine.description.reels.regular, SymbolsList, {
                    // winFrameAnimation: {
                    //     animationPrefix: 'win-frame-win',
                    //     fps: 30
                    // },
                    winFrameAnimation: {
                        animationPrefix: 'win-frame-win',
                        fps: 30
                    },
                    anticipationTime: 1.5,
                    symbolSize: new Point(212, 212),
                    fallingCascade: true,
                });
                break;
            case 'UIPanelMobileVertical':
                instance = new UIPanelMobileVertical({
                    UIMainConfiguration: {
                        buttonSpinConfig: {
                            useRotationInStartAnimation: true,
                        },
                    },
                });
                break;
            case 'UIPanelDesktop':
                instance = new UIPanelDesktop({
                    UIMainConfiguration: {
                        buttonSpinConfig: {
                            useRotationInStartAnimation: true,
                        },
                    },
                });
                break;
            case 'MainScreenBackground':
                instance = new MainScreenBackground(this);
                break;
            case 'TotalWinFrame':
                instance = new TotalWinFrame(le);
                break;
            case 'TotalWinFrameDesktop':
                instance = new TotalWinFrame(le);
                break;
            case 'MultiFunctionalButton':
                instance = new MultiFunctionalButton(le);
                break;
            case 'Character':
                instance = new Character();
                break;
            case 'Multiplier':
                instance = new Multiplier(this.reels);
                break;
            case 'Logo':
                instance = new Logo();
                break;

        }

        return instance;
    }

    public updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);
        let bottomY: number = desc.baseHeight;
        if (desc.currentHeight > desc.baseHeight) {
            bottomY = desc.baseHeight + (desc.currentHeight - desc.baseHeight) / 2;
        }
        this.totalWinFrame.y = bottomY - (desc.baseHeight - this.totalWinFrameBaseYPositions.mobile);
        this.totalWinFrameDesktop.y = bottomY - (desc.baseHeight - this.totalWinFrameBaseYPositions.desktop);
    }

    public onSlotMachineStateChanged(currentState: SlotMachineState): void {
        const sm: SlotMachine = this.slotMachine;
        const wallet: Wallet = container.resolve(Wallet);
        const gs: GameService = container.resolve<GameService>('GameService');
        let gameSpeedLevel: number;
        switch (currentState) {
            case SlotMachineState.SPINNING:
                // this.reelHeader.setHeader(0);

                this.currentLineWinIndex = -1;
                this.currentLineWinCycles = 0;

                this.reels.off(ReelsViewEvent.WIN_ANIMATION_COMPLETE);

                if (sm.previousRoundResult?.complete) {
                    this.totalWinFrameDesktop.setValue(0);
                    this.totalWinFrame.setValue(0);
                    this.uiPanelMobileVertical.statusComponent.setStatusWinValue(0);
                    this.uiPanelDesktop.statusComponent.setStatusWinValue(0);

                }

                // (this.uiPanelDesktop["cascadeHistoryPanel"] as CascadeHistoryView).reset();
                // this.uiPanelMobileVertical.cascadeHistoryPanelMobile.reset();

                this.uiPanelMobileVertical.lock();
                this.uiPanelDesktop.lock();

                gameSpeedLevel = sm.stopRequested ? 1 : this.slotMachine.currentGameSpeedLevel;
                this.reels.spin(sm.currentGameSpeedLevel, {
                    id: SoundListExtended.UI_REEL_SPIN,
                    volume: 0.1,
                });
                break;
            case SlotMachineState.SPIN_END:
            // this.multiplier.symbolArr = [];
            // this.multiplier.symbolArr.forEach((child: SymbolView): void => {
            //     child.destroy();
            // });

            case SlotMachineState.COMMUNICATION_ERROR:
                gameSpeedLevel = sm.stopRequested ? 1 : this.slotMachine.currentGameSpeedLevel;
                const spinResult: SpinResult = sm.currentSpinResult;
                const stopPromises: Promise<void>[] = [
                    this.reels.stop(
                        spinResult.result,
                        {
                            stopSoundData: {
                                id: SoundListExtended.UI_REEL_STOP,
                                volume: 0.2,
                            },
                            anticipationSoundData: {
                                id: SoundListExtended.REEL_ANTICIPATION,
                                volume: 0.2,
                            },
                        },
                        gameSpeedLevel,
                        this.getAnticipationReels(25, spinResult)
                    ),
                ];
                Promise.all(stopPromises).then(() => {
                    if (sm.currentSpinResult.winValue > 0) {
                        //this.character.playWinAnimation();
                        this.totalWinFrame.setValue(sm.currentSpinResult.currentTotalWinValue, true);
                        this.totalWinFrameDesktop.setValue(sm.currentSpinResult.currentTotalWinValue, true);

                        this.logo.playWinAnimation('win');
                        this.character.playWinAnimation();
                    }
                    this.multiplier.once(MultiplierEvent.ON_INITIALIZED_MULTIPLIER_SYMBOLS, () => {
                        if (sm.currentState != SlotMachineState.COMMUNICATION_ERROR) {
                            new ControlEvent(SlotGameEvent.REELS_STOPPED).dispatch();
                        }
                    }, this);
                    this.multiplier.initializeMultipliersOnSymbols(sm.roundResult.multiplierMap, true);


                });
                break;
            case SlotMachineState.SPIN_RESULT_MULTI_WIN:
                this.showMultiWin();
                this.multiplier.bounceAnimationMultiplier();
                this.totalWinFrame.setValue(sm.currentSpinResult.currentTotalWinValue, true);
                this.totalWinFrameDesktop.setValue(sm.currentSpinResult.currentTotalWinValue, true);


                break;
            case SlotMachineState.SPIN_RESULT_SCATTER:
                new ControlEvent(SlotGameEvent.SCATTER_WIN_SHOWN).dispatch();
                break;
            case SlotMachineState.SPIN_RESULT_CASCADE:
                this.reels.cascade(sm.multiWinPattern(sm.previousSpinResult), sm.currentSpinResult.result)
                    .then(() => {
                        new ControlEvent(SlotGameEvent.CASCADE_WIN_SHOWN).dispatch();
                    });
                break;

            case SlotMachineState.FREE_SPINS:
                new ControlEvent(SlotGameEvent.FREE_SPIN_START).dispatch();
                break;

            case SlotMachineState.IDLE:
                this.showNextLineWin();
                //this.background.setTheme(BackgroundType.NORMAL);
                this.uiPanelMobileVertical.unlock();
                this.uiPanelDesktop.unlock();
                break;
        }
    }

    private showMultiWin(): void {
        const sm: SlotMachine = this.slotMachine;
        const wallet: Wallet = container.resolve(Wallet);

        this.reels.once(ReelsViewEvent.WIN_ANIMATION_COMPLETE, () => {
            new ControlEvent(SlotGameEvent.MULTI_WIN_SHOWN).dispatch();
        });
        const winPattern: number[][] = this.slotMachine.multiWinPattern(this.slotMachine.currentSpinResult);
        this.reels.animateWins(winPattern, 1, true);

        const combinationWins = sm.currentSpinResult.win.combinations;
        if (combinationWins.length == 1)
            sm.currentLineWin = combinationWins[0].wayPayout;


        // const totalBet: number = sm.totalBet * wallet.coinValue;
        // const singleBet: number = totalBet / sm.combinations;
        // winingSymbols.forEach((count, symbolId) => {
        //     const rule: RuleDescription = this.slotMachine.findRule(symbolId, count);
        //     [
        //         this.uiPanelMobileVertical.cascadeHistoryPanelMobile,
        //         this.uiPanelDesktop["cascadeHistoryPanel"] as CascadeHistoryView,
        //     ].forEach((history) => {
        //         history.addCell(
        //             SymbolsList.find((symbol) => symbolId == symbol.id),
        //             count,
        //             wallet.getCurrencyValue(singleBet * rule.reward.line.multiplier, true)
        //         );
        //     });
        // });
    }

    private showScatterWin(): void {
        const sm: SlotMachine = this.slotMachine;
        const scatterWin: ScatterWin = sm.currentSpinResult.win?.scatters;

        this.reels.once(ReelsViewEvent.WIN_ANIMATION_COMPLETE, () => {
            this.reels.off(ReelsViewEvent.WIN_ANIMATION_COMPLETE);
            new ControlEvent(SlotGameEvent.SCATTER_WIN_SHOWN).dispatch();
        });
        this.reels.animateWins(scatterWin.pattern, 1, false);
    }

    private showFreespinsWin(): void {
        const sm: SlotMachine = this.slotMachine;
        const freespinsWin: FreespinWin = sm.currentSpinResult.win?.freespins;

        this.reels.once(ReelsViewEvent.WIN_ANIMATION_COMPLETE, () => {
            this.reels.off(ReelsViewEvent.WIN_ANIMATION_COMPLETE);
            new ControlEvent(SlotGameEvent.FREE_SPIN_WIN_SHOWN).dispatch();
        });
        this.reels.animateWins(freespinsWin.pattern, 1, false);
    }

    private showNextLineWin(): void {
        const sm: SlotMachine = this.slotMachine;
        const combinationWins: CombinationWin[] = sm.currentSpinResult.win?.combinations;

        if (!combinationWins) {
            return;
        }

        if (this.currentLineWinIndex == -1) {
            this.currentLineWinIndex = 0;
        } else {
            this.currentLineWinIndex = (this.currentLineWinIndex + 1) % combinationWins.length;

            if (!this.currentLineWinIndex) {
                this.currentLineWinCycles++;
                if (this.currentLineWinCycles >= this.maxLineWinCycles) {
                    return;
                } else {
                    this.currentLineWinIndex = -1;
                    this.showNextLineWin();
                    return;
                }
            }
        }

        const combinationWin: CombinationWin = combinationWins[this.currentLineWinIndex];
        sm.currentLineWin = combinationWin.wayPayout;
        this.reels.once(ReelsViewEvent.WIN_ANIMATION_COMPLETE, () => {
            this.reels.off(ReelsViewEvent.WIN_ANIMATION_COMPLETE);

            new ControlEvent(SlotGameEvent.WINLINE_WIN_SHOWN, combinationWin).dispatch();

            if (sm.currentState == SlotMachineState.IDLE) {
                this.showNextLineWin();
            }
        });


        this.reels.animateWins(combinationWin.pattern, 1, true);
    }

    private getWinningSymbols(output: number[][], winPattern: number[][]): Map<number, number> {
        const winingSymbols: Map<number, number> = new Map<number, number>();
        for (let i = 0; i < output.length; i++) {
            for (let j = 0; j < output[i].length; j++) {
                if (winPattern[i][j] == 1) {
                    if (winingSymbols.has(output[i][j])) {
                        const prevValue: number = winingSymbols.get(output[i][j]);
                        winingSymbols.set(output[i][j], prevValue + 1);
                    } else {
                        winingSymbols.set(output[i][j], 1);
                    }
                }
            }
        }

        return winingSymbols;
    }

    private getAnticipationReels(scatterId, spinResult: SpinResult): number[] {
        // let scattersCount: number = 0;
        // const anticipationReelIds: number[] = [];
        // spinResult.result.forEach((reel: number[], id: number) => {
        //     if (scattersCount >= 2)
        //         anticipationReelIds.push(id);
        //
        //     if (reel.includes(scatterId))
        //         scattersCount++;
        // });
        //
        // return anticipationReelIds;
        return null;
    }

    private onAdded(): void {
        //Set position of total win frame if multi func button is not visible
        // if (!this.btnMultiFunctional.isVisible()) {
        //     this.totalWinFrame.changePosition(-50, true);
        // }

        //Restore previous freespin state
        if (this.slotMachine.roundResult.nextType === 10 || this.slotMachine.roundResult.nextType === 31) {
            this.totalWinFrame.setValue(this.slotMachine.currentSpinResult.currentTotalWinValue);
            this.totalWinFrameDesktop.setValue(this.slotMachine.currentSpinResult.currentTotalWinValue);
            this.slotMachine.showFreeSpinsPopup = false;
            this.slotMachine.currentState = SlotMachineState.FREE_SPINS_ROUND_START;


            // this.multiplierFrameHelper((multiplierFrame) => {
            //     multiplierFrame.totalMultiplierValue = this.slotMachine.currentSpinResult.totalWinMultiplier;
            // });
        }
    }

    // //
    // private multiplierFrameHelper(doSomething: (MultiplierFrame) => void): void {
    //     [this.uiPanelDesktop.multiplierFrame, this.uiPanelMobileVertical.multiplierFrameMobile].forEach(
    //         (multiplierFrame: MultiplierFrame) => {
    //             doSomething(multiplierFrame);
    //         }
    //     );
    // }
}
