import { Circle, Graphics, isMobile } from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import Button from '../../../core/view/ui/Button';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { WalletEvent } from '../../../slots/model/event/WalletEvent';
import Wallet from '../../../slots/model/Wallet';
import SlotMachine from '../../../slots/model/SlotMachine';
import { SlotMachineEvent } from '../../../slots/model/event/SlotMachineEvent';
import { container } from 'tsyringe';
import SoundManager from '../../../core/sound/SoundManager';
import ValueText from '../../../core/view/text/ValueText';
import { UIPanelEvent } from '../../control/event/UIPanelEvent';
import UIState, { UIPanelType } from '../../model/UIState';
import AssetsManager from '../../../core/assets/AssetsManager';
import ButtonSpin from '../ButtonSpin';
import SoundList from '../../sound/SoundList';
import { UIPanellConfiguration } from '../../model/UIPanelConfiguration';
import AdjustableLayoutContainer from '../../../core/view/AdjustableLayoutContainer';
import ButtonAutospin from '../ButtonAutospin';
import { UIEvent } from '../../../slots/control/event/UIEvent';
import { AutoplayEvent } from '../../../slots/model/event/AutoplayEvent';
import { SlotMachineState } from '../../../slots/model/SlotMachineState';
import ButtonSpinAnimation from '../ButtonSpinAnimation';
import { SlotGameEvent } from '../../../slots/control/event/SlotGameEvent';
import { UpdateLayoutDescription } from '../../../core/view/UpdateLayoutDescription';
import BalanceInfo from '../../model/BalanceInfo';
import { CascadeHistoryView } from './CascadeHistoryView';
import { FreeSpinButton } from './FreeSpinButton';
import { DoubleChanceButton } from './DoubleChanceButton';
import ButtonVolume from '../ButtonVolume';
import PopupState, { PopupType } from '../../model/PopupState';
import { Tweener } from '../../../core/tweener/engineTween';
import UISettingsDesktop from './UISettingsDesktop';
import StatusComponent from './StatusComponent';
import { GameServiceEvent } from '../../services/GameServiceEvent';
import MultiplierFrame from '../MultiplierFrame';
import ICommonGameService from '../../services/ICommonGameService';
import EventEmitter from 'eventemitter3'

export default class UIPanelDesktop extends AdjustableLayoutContainer {
    private baseYPositions: {
        btnTurbo: number,
        btnAutospin: number,
        btnMinus: number,
        btnPlus: number,
        btnSpin: number,
        uiSettings: number,
        btnFreeSpin: number
    }

    private gs: ICommonGameService;
    private wallet: Wallet;
    private slotMachine: SlotMachine;

    private _config: UIPanellConfiguration;

    // VISUALS
    private uiSettingsDesktop: UISettingsDesktop;

    private btnBetUp: Button
    private btnBetDown: Button
    private btnAutoSpin: ButtonAutospin;
    private btnFreeSpin: FreeSpinButton;

   // private btnDoubleChance: DoubleChanceButton;
    //private cascadeHistoryPanel: CascadeHistoryView;


   // public multiplierFrame: MultiplierFrame

    public btnTurboSpinEnable: Button;
    public btnTurboSpinDisable: Button;
    public statusComponent: StatusComponent

    private background: Graphics
    // helper structure description

    public btnSpin: ButtonSpin;

    constructor(config: UIPanellConfiguration) {
        super(AssetsManager.layouts.get('UIPanelDesktop'));

        this._config = config;

        LayoutBuilder.create(this.layout, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });


        // additional container is used to keep scale bounce animation intact
        this.btnSpin = this['btnSpinContainer'].btnSpin;

        this.baseYPositions = {
            btnTurbo: this.btnTurboSpinEnable.position.y,
            btnAutospin: this.btnAutoSpin.position.y,
            btnMinus: this.btnBetDown.position.y,
            btnPlus: this.btnBetUp.position.y,
            btnSpin: this['btnSpinContainer'].position.y,
            uiSettings: this.uiSettingsDesktop.position.y,
            btnFreeSpin: this.btnFreeSpin.position.y
        }

        this.btnBetUp.on('pointerup', this.onBtnBetUp, this);
        this.btnBetDown.on('pointerup', this.onBtnBetDown, this);
        this.btnAutoSpin.on('pointerup', this.onBtnAutoSpin, this);
        this.btnTurboSpinEnable.on('pointerup', this.onBtnTurboSpinEnable, this);
        this.btnTurboSpinDisable.on('pointerup', this.onBtnTurboSpinDisable, this);
        this.btnSpin.on('pointerup', this.onBtnSpin, this);


        this.wallet = container.resolve(Wallet);
        this.slotMachine = container.resolve(SlotMachine);

        this.wallet.on(WalletEvent.NOT_ENOUGH_BALANCE, () => {
            this.btnSpin.spinAnimation(ButtonSpinAnimation.LOOP, ButtonSpinAnimation.STOP);
        }, this);

        this.slotMachine.on(SlotMachineEvent.STATE_CHANGED, this.onSlotMachineStateChanged, this);


        this.slotMachine.autoplay.on(AutoplayEvent.DISABLED, this.onAutospinDisabled, this);
        this.slotMachine.autoplay.on(AutoplayEvent.SPINS_LEFT_CHANGED, this.onAutospinSpinsLeftChange, this);
        this.onAutospinSpinsLeftChange();
        this.gs = container.resolve<ICommonGameService>('GameService');
        (this.gs as unknown as EventEmitter).on(GameServiceEvent.SETTINGS_CHANGED, () => {
            this.updateVolume();
        }, this);
        this.updateVolume()
        this.statusComponent.setStatusWinValue(0);
        this.slotMachine.on(SlotMachineEvent.GAME_SPEED_LEVEL_CHANGED, this.onGameSpeedLevelChanged, this);
        this.onGameSpeedLevelChanged(this.slotMachine.currentGameSpeedLevel);

        document.body.addEventListener('keydown', (e) => this.onSpaceClick(e));
    }

    // PUBLIC API
    public lock(): void {
        [
            this.btnBetDown,
           // this.btnDoubleChance,
            this.btnBetUp,
            this.btnSpin,
            this.btnTurboSpinDisable,
            this.btnTurboSpinEnable,
            this.btnFreeSpin,


        ].forEach((btn: Button) => {
            btn.enabled = false;
        });
        if (this.uiSettingsDesktop) {
            this.uiSettingsDesktop.lock()
        }

        if (!this.slotMachine.autoplay.enabled) {
            this.btnAutoSpin.enabled = false;
        }

        new ControlEvent(UIPanelEvent.CLOSE_SETTINGS).dispatch();
    }

    public unlock(): void {
        [
           // this.btnDoubleChance,
            this.btnAutoSpin,
            this.btnBetDown,
            this.btnBetUp,
            this.btnSpin,
            this.btnTurboSpinDisable,
            this.btnTurboSpinEnable,
            this.btnFreeSpin
        ].forEach((btn: Button) => {
            btn.enabled = true;
        });
        if (this.uiSettingsDesktop)
            this.uiSettingsDesktop.unlock()
        this.btnSpin.waitAnimation(ButtonSpinAnimation.WAIT_DELAY)
    }

    public onSlotMachineStateChanged(currentState: SlotMachineState): void {
        const sm: SlotMachine = this.slotMachine;
        const wallet: Wallet = container.resolve(Wallet);
        const gs: ICommonGameService = container.resolve<ICommonGameService>('GameService');

        switch (currentState) {
            case SlotMachineState.SPINNING:
                this.statusComponent.setStatusWinValue(0)
                break;
            case SlotMachineState.SPIN_END:
            case SlotMachineState.COMMUNICATION_ERROR:
                break;
            case SlotMachineState.SPIN_RESULT_MULTI_WIN:
                break;
            case SlotMachineState.SPIN_RESULT_SCATTER:
                break;
            case SlotMachineState.SPIN_RESULT_CASCADE:
                break;
            case SlotMachineState.SPIN_RESULT_FREE_SPINS:
                break;
            case SlotMachineState.FREE_SPINS_ROUND_START:
                this.showMultiplierFrame();
               // this.multiplierFrame.value = this.slotMachine.currentSpinResult.totalWinMultiplier;
                break;
            case SlotMachineState.FREE_SPINS:
                break;
            case SlotMachineState.FREE_SPINS_ROUND_END:
                break;
            case SlotMachineState.IDLE:
                this.statusComponent.setStatusWinValue(0);
                this.hideMultiplierFrame();
                //this.multiplierFrame.value = 0;
                break;
        }
    }

    private updateVolume(): void {
        //this.btnVolume.setInitialState(this.gs.settings.ambientMusic, this.gs.settings.soundFx)
    }
    // public set winValue(value: number | string) {
    //     if(typeof value == "number")
    //         this.tfWin.text = `${Translation.t('tfDesktopWin')} ${this.wallet.getCurrencyValue(value)}`;
    //
    // }

    public updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);

        this.background.width = desc.currentWidth;
        this.background.x = -(desc.currentWidth - desc.baseWidth) / 2;

        if (desc.currentHeight > desc.baseHeight) {
            this.background.y = this.statusComponent.y = desc.baseHeight + (desc.currentHeight - desc.baseHeight) / 2;
        } else {
            this.background.y = this.statusComponent.y = desc.baseHeight;
        }

        let bottomY: number = desc.baseHeight;
        if (desc.currentHeight > desc.baseHeight) {
            bottomY = desc.baseHeight + (desc.currentHeight - desc.baseHeight) / 2;
        }
        this.btnTurboSpinEnable.y = this.btnTurboSpinDisable.y = bottomY - (desc.baseHeight - this.baseYPositions.btnTurbo);
        this.btnAutoSpin.y = bottomY - (desc.baseHeight - this.baseYPositions.btnAutospin);
        this.btnBetDown.y = bottomY - (desc.baseHeight - this.baseYPositions.btnMinus);
        this.btnBetUp.y = bottomY - (desc.baseHeight - this.baseYPositions.btnPlus);
        this['btnSpinContainer'].y = bottomY - (desc.baseHeight - this.baseYPositions.btnSpin);
        this.uiSettingsDesktop.y = bottomY - (desc.baseHeight - this.baseYPositions.uiSettings);
    }

    // PRIVATE API
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;
        let btn: Button;
        let radius: number;

        switch (le.customClass) {
            case 'Button':
                instance = new Button(le);
                break;
            case 'ButtonSpin':
                instance = new ButtonSpin(le);
                btn = instance as Button;
                btn.hitArea = new Circle(105, 105, 110);
                break;
            case 'ButtonAutospin':
                instance = new ButtonAutospin(le);
                btn = instance as Button;
                btn.hitArea = new Circle(90, 90, 50);
                break;
            case 'ValueText':
                instance = new ValueText(le);
                break;
            case 'BalanceInfo':
                instance = new BalanceInfo(le);
                break;
            case 'CascadeHistoryPanel':
                instance = new CascadeHistoryView(le);
                break;
            case 'FreeSpinButton':
                instance = new FreeSpinButton(le);
                break;
            case 'DoubleChanceButton':
                instance = new DoubleChanceButton(le);
                break;
            case 'ButtonVolume':
                instance = new ButtonVolume(le);
                break
            // case 'MultiplierFrame':
            //     instance = new MultiplierFrame(le)
            //     break
            case 'UISettingsDesktop':
                instance = new UISettingsDesktop(le);
                break
            case 'ButtonTurbo':
                instance = new Button(le);
                btn = instance as Button;
                btn.hitArea = new Circle(90, 90, 50)
                break;
            case 'StatusComponent':
                instance = new StatusComponent(le);
                break;
        }

        return instance;
    }


    private onAutospinDisabled(): void {
        if (this.slotMachine.currentState != SlotMachineState.IDLE) {
            this.btnAutoSpin.enabled = false;
        }
    }

    private onAutospinSpinsLeftChange(): void {
        this.btnAutoSpin.autospinChange(this.slotMachine.autoplay.spinsLeft);
    }


    private onGameSpeedLevelChanged(speedLevel: number): void {
        this.btnTurboSpinEnable.visible = (speedLevel == 0);
        this.btnTurboSpinDisable.visible = (speedLevel == 1);

        this.gs.settings.quickSpin = speedLevel != 0

    }
    // USER INTERACTION

    private onBtnBetUp(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.BET_SETTINGS).dispatch();
        new ControlEvent(UIEvent.BET_QUANTITY_UP).dispatch();
    }
    private onBtnBetDown(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.BET_SETTINGS).dispatch();
        new ControlEvent(UIEvent.BET_QUANTITY_DOWN).dispatch();
    }



    private onBtnAutoSpin(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        if (this.slotMachine.autoplay.enabled) {
            new ControlEvent(UIEvent.AUTO_SPIN).dispatch();
        } else {
            new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.AUTOSPIN_SETTINGS).dispatch();
        }
    }

    private onBtnTurboSpinEnable(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIEvent.GAME_SPEED_LEVEL_UP).dispatch();
    }

    private onBtnTurboSpinDisable(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIEvent.GAME_SPEED_LEVEL_DOWN).dispatch();
    }

    private onBtnSpin(): void {
        if (this.slotMachine.currentState !== SlotMachineState.IDLE) {
            if (this.slotMachine.stopRequested)
                return;
            SoundManager.play(SoundList.UI_BUTTON_SPIN_STOP);
            this.btnSpin.spinAnimation(ButtonSpinAnimation.LOOP, ButtonSpinAnimation.SPIN);
            new ControlEvent(SlotGameEvent.STOP_REQUESTED).dispatch();
            this.btnSpin.enabled = false;
        } else {
            SoundManager.play({
                id: SoundList.UI_BUTTON_SPIN_START,
                volume: 0.3
            });

            this.btnSpin.spinAnimation(ButtonSpinAnimation.LOOP, ButtonSpinAnimation.SPIN, false, this._config.UIMainConfiguration.buttonSpinConfig.useRotationInStartAnimation, false);
            new ControlEvent(SlotGameEvent.SPIN_START).dispatch();
            this.btnSpin.enabled = true;
        }
    }
    private onSpaceClick(event: KeyboardEvent) {
        const uiState: UIState = container.resolve(UIState);
        const popupState: PopupState = container.resolve(PopupState);
        if (event.code === 'Space') {
            if (!uiState.activePanel && (!popupState.activePopup || popupState.activeType !== PopupType.CONNECTION_LOST)) {
                this.onBtnSpin();
            }
        }
    }

    private showMultiplierFrame(): void {
        // const offsetY: number = 15;
        // const newPosition: number = this.cascadeHistoryPanel.y - this.btnFreeSpin.height - offsetY;
        // Tweener.addTween(this.btnDoubleChance, {
        //     alpha: 0,
        //     time: 1,
        //     onComplete: () => {
        //         this.btnDoubleChance.visible = false
        //     },
        // });
        //
        // Tweener.addTween(this.btnFreeSpin, {
        //     y: newPosition,
        //     time: 1,
        //     delay: 0.5
        // });
        //
        // Tweener.addTween(this.multiplierFrame, {
        //     alpha: 1,
        //     time: 2,
        //     delay: 0.6,
        //     onStart: () => {
        //         this.multiplierFrame.visible = true;
        //     }
        // });
    }

    private hideMultiplierFrame(): void {
        //const offsetY: number = 17;
        // Tweener.addTween(this.multiplierFrame, {
        //     alpha: 0,
        //     time: 1,
        //     onStart: () => {
        //         Tweener.addTween(this.btnFreeSpin, {
        //             y: this.baseYPositions.btnFreeSpin, //- offsetY,
        //             time: 1
        //         });
        //     },
        //     onComplete: () => {
        //         this.multiplierFrame.visible = false;
        //     }
        // });
        //
        // this.btnDoubleChance.visible = true
        // Tweener.addTween(this.btnDoubleChance, {
        //     alpha: 1,
        //     time: 1
        // });
    }

}
