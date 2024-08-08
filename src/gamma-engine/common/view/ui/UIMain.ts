import {Circle, Container} from 'pixi.js';
import Button from '../../../core/view/ui/Button';
import SoundManager from '../../../core/sound/SoundManager';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { UIEvent } from '../../../slots/control/event/UIEvent';
import { UIPanelEvent } from '../../control/event/UIPanelEvent';
import { SlotGameEvent } from '../../../slots/control/event/SlotGameEvent';
import SlotMachine from '../../../slots/model/SlotMachine';
import { SlotMachineState } from '../../../slots/model/SlotMachineState';
import { container } from 'tsyringe';
import { SlotMachineEvent } from '../../../slots/model/event/SlotMachineEvent';
import { AutoplayEvent } from '../../../slots/model/event/AutoplayEvent';
import LayoutElement from '../../../core/view/model/LayoutElement';
import ValueText from '../../../core/view/text/ValueText';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import  { UIPanelType } from '../../model/UIState';
import ButtonAutospin from '../ButtonAutospin';
import Wallet from '../../../slots/model/Wallet';
import { WalletEvent } from '../../../slots/model/event/WalletEvent';
import SoundList from '../../sound/SoundList';
import ButtonSpin from '../ButtonSpin';
import ButtonSpinAnimation from '../ButtonSpinAnimation';
import { UIMainConfiguration } from '../../model/UIMainConfiguration';
import ICommonGameService from '../../services/ICommonGameService';

export default class UIMain extends Container {
    private slotMachine: SlotMachine;
    private wallet :Wallet;
    private _config: UIMainConfiguration;

    public btnSpin: ButtonSpin;
    public btnMenu:Button;
    public btnAutoSpin: ButtonAutospin;
    private btnBetUp:Button
    private btnBetDown:Button
    public btnTurboSpinEnable: Button;
    public btnTurboSpinDisable: Button;

    constructor(le: LayoutElement, config: UIMainConfiguration) {
        super();

        this._config = config;

        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.btnSpin.on('pointerup', this.onBtnSpin, this);
        this.btnAutoSpin.on('pointerup', this.onBtnAutoSpin, this);
        this.btnBetUp.on('pointerup', this.onBtnBetUp, this);
        this.btnBetDown.on('pointerup', this.onBtnBetDown, this);
        // this.btnInfo.on('pointerup', this.onBtnInfo, this);


        this.btnTurboSpinEnable.on('pointerup', this.onBtnTurboSpinEnable, this);
        this.btnTurboSpinDisable.on('pointerup', this.onBtnTurboSpinDisable, this);
        this.btnMenu.on('pointerup', this.onBtnMenu, this);
        this.wallet = container.resolve(Wallet)
        this.wallet
            .on(WalletEvent.NOT_ENOUGH_BALANCE, () => {
                this.btnSpin.spinAnimation(ButtonSpinAnimation.LOOP, ButtonSpinAnimation.STOP);
            }, this)
        this.slotMachine = container.resolve(SlotMachine);
        this.slotMachine.on(SlotMachineEvent.GAME_SPEED_LEVEL_CHANGED, this.onGameSpeedLevelChanged, this);
        this.slotMachine.autoplay.on(AutoplayEvent.DISABLED, this.onAutospinDisabled, this);
        this.slotMachine.autoplay.on(AutoplayEvent.SPINS_LEFT_CHANGED, this.onAutospinSpinsLeftChange, this);




        this.on('added', this.onAdded, this);
    }



    public lock(): void {
        [this.btnSpin,this.btnBetUp,this.btnBetDown,this.btnTurboSpinEnable,this.btnTurboSpinDisable,this.btnMenu].forEach((btn: Button) => {
            btn.enabled = false;
        });
        if (!this.slotMachine.autoplay.enabled) {
            this.btnAutoSpin.enabled = false;
        }
    }

    public unlock(): void {
        [this.btnSpin,  this.btnBetUp,this.btnBetDown,this.btnAutoSpin,this.btnTurboSpinEnable,this.btnTurboSpinDisable,this.btnMenu].forEach((btn: Button) => {
            btn.enabled = true;
        });

        this.btnSpin.waitAnimation(ButtonSpinAnimation.WAIT_DELAY)
    }

    // PRIVATE API
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;
        let btn: Button;
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
                btn.hitArea = new Circle(90,90,50)
                break;
            case 'ButtonTurbo':
                instance = new Button(le);
                btn = instance as Button;
                btn.hitArea = new Circle(90,90,50)
                break;
            case 'ValueText':
                instance = new ValueText(le);
                break;


        }

        return instance;
    }

    private onAdded(): void {
        this.onGameSpeedLevelChanged(this.slotMachine.currentGameSpeedLevel);
        this.onAutospinSpinsLeftChange();
    }


    private onBtnMenu(){
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.OPEN_SETTINGS).dispatch()
    }

    private onGameSpeedLevelChanged(speedLevel: number): void {
        this.btnTurboSpinEnable.visible = (speedLevel == 0);
        this.btnTurboSpinDisable.visible = (speedLevel == 1);

        container.resolve<ICommonGameService>('GameService').settings.quickSpin = speedLevel != 0
    }

    private onAutospinDisabled(): void {
        if (this.slotMachine.currentState != SlotMachineState.IDLE) {
            this.btnAutoSpin.enabled = false;
        }
    }

    private onAutospinSpinsLeftChange(): void {
        this.btnAutoSpin.autospinChange(this.slotMachine.autoplay.spinsLeft);
    }

    // USER INTERACTION
    private onBtnSettings(){
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.SYSTEM_SETTINGS).dispatch();
    }
    private onBtnInfo(){
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.PAYTABLE).dispatch();
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

            this.btnSpin.spinAnimation(ButtonSpinAnimation.LOOP, ButtonSpinAnimation.SPIN, false, this._config.buttonSpinConfig.useRotationInStartAnimation,false);
            new ControlEvent(SlotGameEvent.SPIN_START).dispatch();
            this.btnSpin.enabled = true;
        }
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



}