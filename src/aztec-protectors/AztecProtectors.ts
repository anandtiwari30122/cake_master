import {DisplayObject, Rectangle, Text, utils} from 'pixi.js';
import 'reflect-metadata'; // required by tsyringe
import {container} from 'tsyringe';
import ChangeUISettingsStateCommand from '../gamma-engine/common/control/command/ChangeUISettingsStateCommand';
import ClosePanelCommand from '../gamma-engine/common/control/command/ClosePanelCommand';
import HidePopupCommand from '../gamma-engine/common/control/command/HidePopupCommand';
import OpenPanelCommand from '../gamma-engine/common/control/command/OpenPanelCommand';
import SetPanelInteractivity from '../gamma-engine/common/control/command/SetPanelInteractivity';
import ShowPopupCommand from '../gamma-engine/common/control/command/ShowPopupCommand';
import {UIPanelEvent} from '../gamma-engine/common/control/event/UIPanelEvent';
import {AutospinOption} from '../gamma-engine/common/model/AutospinOption';
import {UIStateEvent} from '../gamma-engine/common/model/event/UIStateEvent';
import History from '../gamma-engine/common/model/History';
import PopupState, {PopupData, PopupType} from '../gamma-engine/common/model/PopupState';
import UIState, {UIPanelType} from '../gamma-engine/common/model/UIState';
import '../gamma-engine/common/tsyringe/tokens/defaults';
import {IntroScreenEvent} from '../gamma-engine/common/view/event/IntroScreenEvent';
import {LoadingScreen} from '../gamma-engine/common/view/LoadingScreen';
import PopupBigWin from '../gamma-engine/common/view/popup/PopupBigWin';
import PopupConnectionLost from '../gamma-engine/common/view/popup/PopupConnectionLost';
import PopupFeatureBuy from '../gamma-engine/common/view/popup/PopupFeatureBuy';
import PopupFreespins, {PopupFreespinsType} from '../gamma-engine/common/view/popup/PopupFreespins';
import PopupNotEnoughBalance from '../gamma-engine/common/view/popup/PopupNotEnoughBalance';
import AdjustBetPanel from '../gamma-engine/common/view/ui/AdjustBetPanel';
import AutospinPanel from '../gamma-engine/common/view/ui/AutospinPanel';
import HistoryPanel from '../gamma-engine/common/view/ui/HistoryPanel';
import Panel from '../gamma-engine/common/view/ui/Panel';
import PaytablePanelDesktop from '../gamma-engine/common/view/ui/PaytablePanelDesktop';
import PaytablePanelMobile from '../gamma-engine/common/view/ui/PaytablePanelMobile';
import SystemSettingsPanel from '../gamma-engine/common/view/ui/SystemSettingsPanel';
import SystemSettingsPanelMobile from '../gamma-engine/common/view/ui/SystemSettingsPanelMobile';
import AssetsManager from '../gamma-engine/core/assets/AssetsManager';
import {ApplicationEvent} from '../gamma-engine/core/control/event/ApplicationEvent';
import ControlEvent from '../gamma-engine/core/control/event/ControlEvent';
import {VERSION as CORE_VERSION} from '../gamma-engine/core/EngineCore';
import AssetsConfigLoader from '../gamma-engine/core/load/AssetsConfigLoader';
import SoundManager from '../gamma-engine/core/sound/SoundManager';
import Translation from '../gamma-engine/core/translations/Translation';
import {Tweener} from '../gamma-engine/core/tweener/engineTween';
import Logger from '../gamma-engine/core/utils/Logger';
import MobileBrowserLog from '../gamma-engine/core/utils/MobileBrowserLog';
import {BrowserApplication} from '../gamma-engine/core/view/BrowserApplication';
import ISwapViewsEffect from '../gamma-engine/core/view/effect/ISwapViewsEffect';
import SwapViewsEffectFadeToBlack from '../gamma-engine/core/view/effect/SwapViewsEffectFadeToBlack';
import IAdjustableLayout from '../gamma-engine/core/view/IAdjustableLayout';
import {ResizeMethod} from '../gamma-engine/core/view/ResizeMethod';
import {ScreenOrientation} from '../gamma-engine/core/view/ScreenOrientation';
import {UpdateLayoutDescription} from '../gamma-engine/core/view/UpdateLayoutDescription';
import CompleteRoundCommand from '../gamma-engine/slots/control/command/CompleteRoundCommand';
import SpinStartCommand from '../gamma-engine/slots/control/command/SpinStartCommand';
import {SlotGameEvent} from '../gamma-engine/slots/control/event/SlotGameEvent';
import SlotGameFrontController from '../gamma-engine/slots/control/SlotGameFrontController';
import {SlotMachineEvent} from '../gamma-engine/slots/model/event/SlotMachineEvent';
import {WalletEvent} from '../gamma-engine/slots/model/event/WalletEvent';
import SlotMachine from '../gamma-engine/slots/model/SlotMachine';
import {SlotMachineState} from '../gamma-engine/slots/model/SlotMachineState';
import Wallet from '../gamma-engine/slots/model/Wallet';
import IGameService from '../gamma-engine/slots/service/IGameService';
import GraphicUtils from '../gamma-engine/slots/utils/GraphicUtils';
import PopupManager from '../gamma-engine/slots/view/popup/PopupManager';
import {SymbolData} from '../gamma-engine/slots/view/SymbolData';
import AdjustBetQuantityCommand from './control/command/AdjustBetQuantityCommand';
import {AdjustTotalBetCommand} from './control/command/AdjustTotalBetCommand';
import BuyFeatureCommandOverride from './control/command/BuyFeatureCommandOverride';
import CompleteRoundCommandOverride from './control/command/CompleteRoundCommandOverride';
import SpinStartCommandOverride from './control/command/SpinStartCommandOverride';
import {SlotGameEventExtension} from './control/event/SlotGameEventExtension';
import {UIEventExtension} from './control/event/UIEventExtension';
import {getFromLocalStorage} from './model/LocalStorageUtils';
import GameService from './services/GameService';
import SoundListExtended from './sound/SoundListExtended';
import IntroScreen from './view/IntroScreen';
import MainGameScreen from './view/MainGameScreen';
import {BackgroundType} from './view/MainScreenBackground';
import {SymbolListDoubled, SymbolListWild, SymbolsList} from './view/SymbolsList';

declare let VERSION: string;

export class AztecProtectors extends BrowserApplication {
    private frontController: SlotGameFrontController;
    private gameService: IGameService;

    private _activeMainGameView: DisplayObject & IAdjustableLayout;
    private slotMachine: SlotMachine;

    private currentWidth: number = 0;
    private currentHeight: number = 0;

    private assetsBaseUrl: string = './assets';

    // VIEWS
    private loadingScreen: LoadingScreen;
    private introScreen: IntroScreen;
    private mainGameScreen: MainGameScreen;

    private popupManager: PopupManager;
    private popupDesktop: Panel;
    private popupVertical: Panel;

    // ACTIVE PANELS
    private historyPanelVertical: HistoryPanel;
    private historyPanelHorizontal: HistoryPanel;
    private autospinPanelVertical: AutospinPanel;
    private autospinPanelHorizontal: AutospinPanel;
    private adjustBetPanelVertical: AdjustBetPanel;
    private adjustBetPanelHorizontal: AdjustBetPanel;
    private paytablePanelVertical: PaytablePanelMobile;
    private paytablePanelHorizontal: PaytablePanelDesktop;
    private systemSettingsPanelVertical: SystemSettingsPanelMobile;
    private systemSettingsPanelHorizontal: SystemSettingsPanel;
    private popupBalanceVertical: PopupNotEnoughBalance;
    private popupBalanceHorizontal: PopupNotEnoughBalance;
    private popupConnectionLostVertical: PopupConnectionLost;
    private popupConnectionLostHorizontal: PopupConnectionLost;
    private popupFeatureBuyVertical: PopupFeatureBuy;
    private popupFeatureBuyHorizontal: PopupFeatureBuy;
    private popupBigWinVertical: PopupBigWin;
    private popupBigWinHorizontal: PopupBigWin;
    private popupFreespinsVertical: PopupFreespins;
    private popupFreespinsHorizontal: PopupFreespins;

    constructor(
        gameContainer: HTMLDivElement,
        config: {
            debug?: true;
            mobileLog?: true;
            logLevel: number;
            assetsBaseUrl?: string;
            lobbyUrl?: string;
            startingBalance?: number;
            serverApiUrl: string;
            jwtToken: string;
            gameCode: string;
            language: 'en' | 'tr';
        }
    ) {
        if (config.mobileLog && utils.isMobile.any) {
            new MobileBrowserLog();
        }

        if (utils.isMobile.any) {
            // window.onblur = () => {
            //     // pause when window focus lost
            //     SoundManager.mute = true;
            // };
            // window.onfocus = () => {
            //     // Unpause when window gains focus
            //     SoundManager.mute = false;
            // };

            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    // Ticker.shared.stop();
                    SoundManager.mute = false;
                } else {
                    // Ticker.shared.start();
                    SoundManager.mute = true;
                }
            });
        }

        Logger.info(`Gammastack - Aztec Protector [${VERSION}]`);

        Logger.logLevel = config.logLevel;

        super(gameContainer, {
            id: 'game',
            container: gameContainer,
            resizeMethod: ResizeMethod.SHOW_ALL,
            backgroundColor: 0x000000,
            baseWidth: 1920,
            baseHeight: 1080,
            autoUpdateSizeToOrientation: true,
            debug: config.debug,
            fps: (getFromLocalStorage('settings')?.batterySaver ?? false) == true ? 20 : 60,
        });

        Logger.warning(`FPS VALUE - ${(getFromLocalStorage('settings')?.batterySaver ?? false) == true ? 20 : 60}`);

        // PixiJS Chrome extension support
        globalThis.__PIXI_APP__ = this.pixi;

        this.gameService = new GameService(
            config.serverApiUrl,
            config.jwtToken,
            config.gameCode,
            config.lobbyUrl ?? ''
        );
        // this.gameService = new DummyGameService(config.lobbyUrl ?? '',config.startingBalance ?? 0);
        container.registerInstance<IGameService>('GameService', this.gameService);

        this.frontController = new SlotGameFrontController();
        this.frontController.addCommand(UIPanelEvent.OPEN_SETTINGS, ChangeUISettingsStateCommand);
        this.frontController.addCommand(UIPanelEvent.CLOSE_SETTINGS, ChangeUISettingsStateCommand);
        this.frontController.addCommand(UIPanelEvent.OPEN_PANEL, OpenPanelCommand);
        this.frontController.addCommand(UIPanelEvent.CLOSE_PANEL, ClosePanelCommand);
        this.frontController.removeCommand(SlotGameEvent.ROUND_COMPLETE, CompleteRoundCommand);
        this.frontController.addCommand(SlotGameEvent.ROUND_COMPLETE, CompleteRoundCommandOverride);
        this.frontController.addCommand(UIPanelEvent.SHOW_POPUP, ShowPopupCommand);
        this.frontController.addCommand(UIPanelEvent.HIDE_POPUP, HidePopupCommand);
        this.frontController.addCommand(UIPanelEvent.SET_INTERACTIVITY_TRUE, SetPanelInteractivity);
        this.frontController.addCommand(UIPanelEvent.SET_INTERACTIVITY_FALSE, SetPanelInteractivity);

        this.frontController.addCommand(UIEventExtension.BET_QUANTITY_UP, AdjustBetQuantityCommand);
        this.frontController.addCommand(UIEventExtension.BET_QUANTITY_DOWN, AdjustBetQuantityCommand);
        this.frontController.addCommand(UIEventExtension.BET_QUANTITY_MAX, AdjustBetQuantityCommand);

        this.frontController.addCommand(UIEventExtension.TOTAL_BET_DOWN, AdjustTotalBetCommand);
        this.frontController.addCommand(UIEventExtension.TOTAL_BET_UP, AdjustTotalBetCommand);

        this.frontController.removeCommand(SlotGameEvent.SPIN_START, SpinStartCommand);
        this.frontController.addCommand(SlotGameEvent.SPIN_START, SpinStartCommandOverride);

        this.frontController.addCommand(SlotGameEventExtension.BUY_FREESPINS, BuyFeatureCommandOverride);

        container.registerSingleton(UIState);
        container.registerSingleton(PopupState);
        container.registerSingleton(History);

        this.popupManager = new PopupManager();
        this.popupManager.position.set(this.baseWidth / 2, this.baseHeight / 2);
        this.stage.addChild(this.popupManager);

        if (config.assetsBaseUrl) this.assetsBaseUrl = config.assetsBaseUrl;

        const loadingScreenAssetsLoader: AssetsConfigLoader = new AssetsConfigLoader(
            `${this.assetsBaseUrl}/loading-screen-assets-config.json`,
            this.pixi.renderer
        );
        loadingScreenAssetsLoader.on(AssetsConfigLoader.EVENT_LOADING_COMPLETE, this.onLoadingScreenAssetsLoaded, this);

        SoundManager.getChannel('default').mute = !(getFromLocalStorage('settings')?.soundFx ?? true);
        SoundManager.getChannel('ambient').mute = !(getFromLocalStorage('settings')?.ambientMusic ?? true);

        this.getTranslationFile(config.language ?? 'en').then(() => {
            loadingScreenAssetsLoader.load();
        });
    }

    private async getTranslationFile(lang: string): Promise<void> {
        // fetch json file
        const response: Response = await fetch(`${this.assetsBaseUrl}/translations/${lang}.json`);
        const data = await response.json();
        Translation.addLanguageData(lang, data);
        Translation.setCurrentLanguage(lang);
    }

    public set activeMainGameView(value: DisplayObject & IAdjustableLayout) {
        if (this._activeMainGameView == value) {
            return;
        }

        const oldView: DisplayObject = this._activeMainGameView;
        this._activeMainGameView = value;
        this.onWindowResize();
        //
        // const w: number = Math.ceil(this.width);
        // const h: number = Math.ceil(this.height);
        const w: number = 4000;
        const h: number = 4000;
        const x: number = -(w - this.baseWidth) / 2;
        const y: number = -(h - this.baseHeight) / 2;
        const fadeSize: Rectangle = new Rectangle(x, y, w, h);

        if (oldView) {
            const swapEffect: ISwapViewsEffect = new SwapViewsEffectFadeToBlack(fadeSize);
            // let swapEffect: ISwapViewsEffect = new SwapViewsEffectFadeOut();
            swapEffect.apply(oldView, this._activeMainGameView, this.stage, () => {
                if (oldView == this.loadingScreen) {
                    oldView.destroy({
                        children: true,
                    });
                }
            });
        } else {
            this.stage.addChildAt(this._activeMainGameView, 0);
        }
    }

    private onLoadingScreenAssetsLoaded(): void {
        Logger.info('Loading screen assets loaded');

       // console.dir(AssetsManager.layouts);
        this.loadingScreen = new LoadingScreen(AssetsManager.layouts.get('loading-screen'), () => {
            this.activeMainGameView = this.introScreen;
        });
        this.loadingScreen.start();
        this.activeMainGameView = this.loadingScreen;

        const gameAssetsLoader: AssetsConfigLoader = new AssetsConfigLoader(
            `${this.assetsBaseUrl}/main-game-assets-config.json`,
            this.pixi.renderer
        );
        // gameAssetsLoader.on(AssetsConfigLoader.EVENT_LOADING_PROGRESS, (progress: number) => {
        //     this.loadingScreen.setProgress(progress);
        // }, this);
        gameAssetsLoader.on(AssetsConfigLoader.EVENT_LOADING_COMPLETE, this.onGameAssetsLoaded, this);
        gameAssetsLoader.load();

        new ControlEvent(ApplicationEvent.INIT).dispatch();
    }

    private onGameAssetsLoaded(): void {
        Logger.info('Game assets loaded');
        GraphicUtils.init(this.pixi.renderer);
        GraphicUtils.processSymbolsData(SymbolsList);

        if ((getFromLocalStorage('settings')?.introScreen ?? true) == false) {
            this.onAllAssetsLoaded();
            return;
        }

        this.introScreen = new IntroScreen();
        this.introScreen.on(IntroScreenEvent.ON_GET_STARTED_CLICKED, this.onAllAssetsLoaded, this);
        this.loadingScreen.stop();
    }

    private onAllAssetsLoaded(): void {
        // check config complete
        if (!container.isRegistered(SlotMachine)) {
            Tweener.addCaller(this, {
                count: 1,
                time: 0.1,
                onComplete: () => {
                    this.onAllAssetsLoaded();
                },
            });
            return;
        }

        this.slotMachine = container.resolve(SlotMachine);
        this.slotMachine.on(SlotMachineEvent.STATE_CHANGED, this.onSlotMachineStateChanged, this);

        const uiState = container.resolve(UIState);
        uiState.on(UIStateEvent.ACTIVE_PANEL_CHANGED, this.onUiActivePanelChanged, this);

        const popupState: PopupState = container.resolve(PopupState);
        popupState.on(UIStateEvent.ACTIVE_POPUP_CHANGED, this.onActivePopupChanged, this);

        // TODO: uncomment these and remove the bottom line for feature presentation screen
        // this.featurePresentationScreen = new FeaturePresentationScreen();
        // this.featurePresentationScreen.on('continue', this.onFeaturePresentationScreenContinue, this);
        // this.activeMainGameView = this.featurePresentationScreen;

        new ControlEvent(ApplicationEvent.LOADING_COMPLETE).dispatch();
    }

    private onFeaturePresentationScreenContinue(): void {
        new ControlEvent(ApplicationEvent.LOADING_COMPLETE).dispatch();
    }

    private onSlotMachineStateChanged(currentState: SlotMachineState, previousState: SlotMachineState): void {
        switch (currentState) {
            case SlotMachineState.IDLE:
                if (!this.mainGameScreen) {
                    this.mainGameScreen = container.resolve(MainGameScreen);
                    container.resolve(Wallet).on(WalletEvent.NOT_ENOUGH_BALANCE, this.onNotEnoughBalance, this);
                }
                this.activeMainGameView = this.mainGameScreen;
                //TEST CODE
                // this.popupBigWinHorizontal?.['updateLayout']?.(this.updateLayoutDescription);
                // this.popupBigWinVertical?.['updateLayout']?.(this.updateLayoutDescription);
                // this.popupManager.show(
                //     (this.popupBigWinHorizontal ??= new PopupBigWin(
                //         () => 2,
                //         () => 1111,
                //         new Text('', {
                //             fontFamily: AssetsManager.webFonts.get('LuckiestGuy').family,
                //             fill: [0xffffff],
                //             fontSize: 120,
                //             lineJoin: 'round',
                //             dropShadow: true,
                //             dropShadowColor: 0x000000,
                //             dropShadowBlur: 4,
                //             dropShadowAngle: 1.5
                //         }),
                //         0.9
                //     )),
                //     (this.popupBigWinVertical ??= new PopupBigWin(
                //         () => 1,
                //         () => 11111,
                //         new Text('', {
                //             fontFamily: AssetsManager.webFonts.get('LuckiestGuy').family,
                //             fill: [0xffffff],
                //             fontSize: 120,
                //             lineJoin: 'round',
                //             dropShadow: true,
                //             dropShadowColor: 0x000000,
                //             dropShadowBlur: 4,
                //             dropShadowAngle: 1.5
                //         }),
                //         0.65
                //     )),
                //     5,
                //     true,
                //     {
                //         onPopupHidden: () => {
                //             new ControlEvent(SlotGameEvent.BIG_WIN_SHOWN).dispatch();
                //         },
                //     },
                //     () => PopupManager.jumpAnimationConfiguration,
                //     {
                //         showSound: {
                //             id: this.getProperWinSound(this.slotMachine.bigWinLevel(this.slotMachine.roundResult)),
                //             volume: 0.6,
                //         },
                //         hideSound: {
                //             id: SoundListExtended.UI_POPUP_HIDE,
                //         },
                //     }
                // );

                break;
            case SlotMachineState.BIG_WIN:
                this.popupBigWinHorizontal?.['updateLayout']?.(this.updateLayoutDescription);
                this.popupBigWinVertical?.['updateLayout']?.(this.updateLayoutDescription);
                this.popupManager.show(
                    (this.popupBigWinHorizontal ??= new PopupBigWin(
                        () => this.slotMachine.bigWinLevel(this.slotMachine.roundResult),
                        () => this.slotMachine.roundResult.totalWinValue,
                        new Text('', {
                            fontFamily: AssetsManager.webFonts.get('LuckiestGuy').family,
                            fill: [0xffffff],
                            fontSize: 120,
                            lineJoin: 'round',
                            dropShadow: true,
                            dropShadowColor: 0x000000,
                            dropShadowBlur: 4,
                            dropShadowAngle: 1.5
                        }),
                        0.9
                    )),
                    (this.popupBigWinVertical ??= new PopupBigWin(
                        () => this.slotMachine.bigWinLevel(this.slotMachine.roundResult),
                        () => this.slotMachine.roundResult.totalWinValue,
                        new Text('', {
                            fontFamily: AssetsManager.webFonts.get('LuckiestGuy').family,
                            fill: [0xffffff],
                            fontSize: 120,
                            lineJoin: 'round',
                            dropShadow: true,
                            dropShadowColor: 0x000000,
                            dropShadowBlur: 4,
                            dropShadowAngle: 1.5
                        }),
                        0.65
                    )),
                    5,
                    true,
                    {
                        onPopupHidden: () => {
                            new ControlEvent(SlotGameEvent.BIG_WIN_SHOWN).dispatch();
                        },
                    },
                    () => PopupManager.jumpAnimationConfiguration,
                    {
                        showSound: {
                            id: this.getProperWinSound(this.slotMachine.bigWinLevel(this.slotMachine.roundResult)),
                            volume: 0.6,
                        },
                        hideSound: {
                            id: SoundListExtended.UI_POPUP_HIDE,
                        },
                    }
                );
                break;
            case SlotMachineState.FREE_SPINS_ROUND_START:
                if (!this.slotMachine.showFreeSpinsPopup) {
                    this.slotMachine.showFreeSpinsPopup = true;
                    this.mainGameScreen.background.setTheme(BackgroundType.FREEGAME);
                    new ControlEvent(SlotGameEvent.FREE_SPIN_ROUND_STARTED).dispatch();
                    return;
                }
                this.popupFreespinsVertical?.['updateLayout']?.(this.updateLayoutDescription);
                this.popupFreespinsHorizontal?.['updateLayout']?.(this.updateLayoutDescription);
                this.popupManager.show(
                    (this.popupFreespinsHorizontal ??= new PopupFreespins(
                        () => this.slotMachine.currentSpinResult.freespins.totalCount,
                        () => this.slotMachine.currentState === SlotMachineState.FREE_SPINS_ROUND_START ? PopupFreespinsType.START : PopupFreespinsType.END
                    )),
                    (this.popupFreespinsVertical ??= new PopupFreespins(
                        () => this.slotMachine.currentSpinResult.freespins.totalCount,
                        () => this.slotMachine.currentState === SlotMachineState.FREE_SPINS_ROUND_START ? PopupFreespinsType.START : PopupFreespinsType.END,
                        0.65
                    )),
                    5,
                    true,
                    {
                        onPopupHidden: () => {
                            this.mainGameScreen.background.setTheme(BackgroundType.FREEGAME).then(() => {
                                new ControlEvent(SlotGameEvent.FREE_SPIN_ROUND_STARTED).dispatch();
                            });

                        },
                    },
                    () => PopupManager.jumpAnimationConfiguration,
                    {
                        showSound: {
                            id: SoundListExtended.FREESPIN_AWARD,
                            volume: 0.6,
                        },
                        hideSound: {
                            id: SoundListExtended.UI_POPUP_HIDE,
                        },
                    }
                );
                break;
            case SlotMachineState.FREE_SPINS_ROUND_END:
                this.mainGameScreen.background.setTheme(BackgroundType.NORMAL).then(() => new ControlEvent(SlotGameEvent.FREE_SPIN_ROUND_COMPLETE).dispatch());

                break;
            case SlotMachineState.COMMUNICATION_ERROR:
                const data: PopupData = {
                    type: PopupType.CONNECTION_LOST,
                    hideOnClick: false,
                    duration: -1,
                    callbacks: null,
                };
                new ControlEvent(UIPanelEvent.SHOW_POPUP, data).dispatch();
                break;
        }
    }

    protected resize(availableWidth: number, availableHeight: number, resizeMethod?: ResizeMethod) {
        super.resize(availableWidth, availableHeight, resizeMethod);

        if (!this.stage) {
            return;
        }

        this.stage.x = (availableWidth - this.baseWidth * this.stage.scale.x) / 2;
        this.stage.y = (availableHeight - this.baseHeight * this.stage.scale.y) / 2;

        this.currentWidth = availableWidth / this.stage.scale.x;
        this.currentHeight = availableHeight / this.stage.scale.y;

        if (this._activeMainGameView) {
            this._activeMainGameView.updateLayout(this.updateLayoutDescription);
        }

        if (this.popupManager) {
            this.popupManager.updateLayout(this.updateLayoutDescription);
            this.popupManager.position.set(this.baseWidth / 2, this.baseHeight / 2);
        }
    }

    private onUiActivePanelChanged(): void {
        const uiState = container.resolve(UIState);

        switch (uiState.activePanel) {
            case UIPanelType.HISTORY:
                this.popupVertical = this.historyPanelVertical ??= new HistoryPanel('HistoryPanel');
                this.popupDesktop = this.historyPanelHorizontal ??= new HistoryPanel('HistoryPanelDesktop');
                break;
            case UIPanelType.AUTOSPIN_SETTINGS:
                this.popupVertical = this.autospinPanelVertical ??= new AutospinPanel(
                    AssetsManager.layouts.get('AutospinPanel'),
                    AssetsManager.layouts.get('CheckboxOption'),
                    [
                        AutospinOption.ON_ANY_WIN,
                        AutospinOption.ON_BONUS_GAME_WON,
                        AutospinOption.ON_SINGLE_WIN_EXCEEDS,
                        AutospinOption.ON_CASH_BALANCE_INCREASE_BY,
                        AutospinOption.ON_CASH_BALANCE_DECREASE_BY,
                    ]
                );

                this.popupDesktop = this.autospinPanelHorizontal ??= new AutospinPanel(
                    AssetsManager.layouts.get('AutospinPanelDesktop'),
                    AssetsManager.layouts.get('CheckboxOptionDesktop'),
                    [
                        AutospinOption.ON_ANY_WIN,
                        AutospinOption.ON_BONUS_GAME_WON,
                        AutospinOption.ON_SINGLE_WIN_EXCEEDS,
                        AutospinOption.ON_CASH_BALANCE_INCREASE_BY,
                        AutospinOption.ON_CASH_BALANCE_DECREASE_BY,
                    ]
                );
                break;
            case UIPanelType.BET_SETTINGS:
                this.popupVertical = this.adjustBetPanelVertical ??= new AdjustBetPanel(
                    AssetsManager.layouts.get('AdjustBetPanelMobile')
                );
                this.popupDesktop = this.adjustBetPanelHorizontal ??= new AdjustBetPanel(
                    AssetsManager.layouts.get('AdjustBetPanel')
                );
                break;
            case UIPanelType.PAYTABLE:
                this.popupVertical = this.paytablePanelVertical ??= new PaytablePanelMobile({
                    symbolsList: SymbolsList,
                    symbolsPerPage: [
                        {
                            rows: [3, 3],
                        },
                        {
                            rows: [3],
                        },
                    ],
                    excludedSymbols: [25, 302, 301].concat((SymbolListWild.concat(SymbolListDoubled)).map((symbolData: SymbolData) => symbolData.id)),
                    symbolsWithDescription: [
                        {
                            itemId: 2,
                            symbolId: 302,
                            symbolDouble: 301
                        },
                        {
                            itemId: 3,
                            symbolId: 25
                        },

                    ],
                    symbolsDoubles: SymbolListDoubled

                });

                this.popupDesktop = this.paytablePanelHorizontal ??= new PaytablePanelDesktop({
                    symbolsList: SymbolsList,
                    symbolsPerPage: [
                        {
                            rows: [3, 3],
                        },
                        {
                            rows: [3],
                        },
                    ],
                    excludedSymbols: [25, 302, 301].concat((SymbolListWild.concat(SymbolListDoubled)).map((symbolData: SymbolData) => symbolData.id)),
                    symbolsWithDescription: [
                        {
                            itemId: 2,
                            symbolId: 302,
                            symbolDouble: 301
                        },
                        {
                            itemId: 3,
                            symbolId: 25
                        },

                    ],
                    symbolsDoubles: SymbolListDoubled

                });
                break;
            case UIPanelType.SYSTEM_SETTINGS:
                this.popupDesktop = this.systemSettingsPanelHorizontal ??= new SystemSettingsPanel();
                this.popupVertical = this.systemSettingsPanelVertical ??= new SystemSettingsPanelMobile();
                break;
            default:
                this.popupManager.hide();
                return;
        }

        // if(this.orientation == ScreenOrientation.VERTICAL && this.popupVertical) {
        //     this.popupVertical.updateLayout(this.updateLayoutDescription);
        //
        //     this.popupManager.show(
        //         this.popupVertical,
        //         -1,
        //         false,
        //         null,
        //         uiState.activePanel==UIPanelType.BET_SETTINGS?this.popupVertical.animationConfiguration:this.popupVertical.animationPaytableConfiguration
        //         // {
        //         //     showSound: {
        //         //         id: SoundListExtended.UI_POPUP_COMMON_WINDOW
        //         //     },
        //         //     hideSound: {
        //         //         id: SoundListExtended.UI_POPUP_HIDE
        //         //     }
        //         // }
        //     );
        // } if(this.orientation == ScreenOrientation.HORIZONTAL && this.popupDesktop){
        //     this.popupDesktop.updateLayout(this.updateLayoutDescription)
        //     this.popupManager.show(
        //         this.popupDesktop,
        //         -1,
        //         false,
        //         null,
        //         PopupManager.defaultAnimationConfiguration,
        //         {
        //             showSound: {
        //                 id: SoundListExtended.UI_POPUP_COMMON_WINDOW
        //             },
        //             hideSound: {
        //                 id: SoundListExtended.UI_POPUP_HIDE
        //             }
        //         }
        //     );
        // }

        this.popupVertical?.updateLayout(this.updateLayoutDescription);
        this.popupDesktop?.updateLayout(this.updateLayoutDescription);

        this.popupManager.show(
            this.popupDesktop,
            this.popupVertical,
            -1,
            false,
            null,
            () =>
                this.orientation == ScreenOrientation.VERTICAL
                    ? PopupManager.slideAnimationConfiguration
                    : PopupManager.defaultAnimationConfiguration,
            {
                showSound: {
                    id: SoundListExtended.UI_POPUP_COMMON_WINDOW,
                },
                hideSound: {
                    id: SoundListExtended.UI_POPUP_HIDE,
                },
            }
        );
    }

    private get updateLayoutDescription(): UpdateLayoutDescription {
        return {
            orientation: this.orientation,
            baseWidth: this.baseWidth,
            baseHeight: this.baseHeight,
            currentWidth: this.currentWidth,
            currentHeight: this.currentHeight,
        };
    }

    private onActivePopupChanged(): void {
        const popupState: PopupState = container.resolve(PopupState);

        if (popupState.activePopup === null) {
            this.popupManager.hide();
            return;
        }

        let popupHorizontal: DisplayObject = null;
        let popupVertical: DisplayObject = null;
        let showSound: string = SoundListExtended.UI_POPUP_COMMON_WINDOW;
        switch (popupState.activePopup.type) {
            case PopupType.NOT_ENOUGH_BALANCE:
                popupHorizontal = this.popupBalanceVertical ??= new PopupNotEnoughBalance();
                popupVertical = this.popupBalanceHorizontal ??= new PopupNotEnoughBalance();
                break;
            case PopupType.CONNECTION_LOST:
                popupHorizontal = this.popupConnectionLostVertical ??= new PopupConnectionLost();
                popupVertical = this.popupConnectionLostHorizontal ??= new PopupConnectionLost();
                showSound = SoundListExtended.UI_ERROR_APPEARANCE;
                break;
            case PopupType.FEATURE_BUY:
                popupHorizontal = this.popupFeatureBuyVertical ??= new PopupFeatureBuy();
                popupVertical = this.popupFeatureBuyHorizontal ??= new PopupFeatureBuy();
                break;
        }

        popupHorizontal?.['updateLayout']?.(this.updateLayoutDescription);
        popupVertical?.['updateLayout']?.(this.updateLayoutDescription);

        this.popupManager.show(
            popupHorizontal,
            popupVertical,
            popupState.activePopup.duration + 50,
            popupState.activePopup.hideOnClick,
            popupState.activePopup.callbacks,
            () => PopupManager.defaultAnimationConfiguration,
            {
                showSound: {
                    id: showSound,
                },
                hideSound: {
                    id: SoundListExtended.UI_POPUP_HIDE,
                },
            }
        );
    }

    private onNotEnoughBalance(): void {
        const data: PopupData = {
            type: PopupType.NOT_ENOUGH_BALANCE,
            hideOnClick: true,
            duration: -1,
            callbacks: null,
        };
        new ControlEvent(UIPanelEvent.SHOW_POPUP, data).dispatch();
    }

    private getProperWinSound(winLevel: number): string {
        if (winLevel === 1) return SoundListExtended.GREAT_WIN;
        else if (winLevel === 2) return SoundListExtended.HUGE_WIN;
        else if (winLevel === 3) return SoundListExtended.INSANE_WIN;

        return SoundListExtended.GOOD_WIN;
    }
}
