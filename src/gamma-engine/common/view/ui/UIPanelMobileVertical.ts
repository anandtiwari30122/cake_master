import { Container, Graphics, Text } from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import Button from '../../../core/view/ui/Button';
import ControlEvent from '../../../core/control/event/ControlEvent';
import Wallet from '../../../slots/model/Wallet';
import SlotMachine from '../../../slots/model/SlotMachine';
import { SlotMachineEvent } from '../../../slots/model/event/SlotMachineEvent';
import { container } from 'tsyringe';
import SoundManager from '../../../core/sound/SoundManager';
import ValueText from '../../../core/view/text/ValueText';
import { UIPanelEvent } from '../../control/event/UIPanelEvent';
import UISettingsMobileVertical from './UISettingsMobileVertical';
import UIState, { UIPanelType } from '../../model/UIState';
import { UIStateEvent } from '../../model/event/UIStateEvent';
import AssetsManager from '../../../core/assets/AssetsManager';
import UIMain from './UIMain';
import ButtonSpin from '../ButtonSpin';
import SoundList from '../../sound/SoundList';
import { UIPanellConfiguration } from '../../model/UIPanelConfiguration';
import AdjustableLayoutContainer from '../../../core/view/AdjustableLayoutContainer';
import { UpdateLayoutDescription } from '../../../core/view/UpdateLayoutDescription';
import BalanceInfo from '../../model/BalanceInfo';
import { DoubleChanceButton } from './DoubleChanceButton';
import { CascadeHistoryView } from './CascadeHistoryView';
import { FreeSpinButton } from './FreeSpinButton';
import { SlotMachineState } from '../../../slots/model/SlotMachineState';
import StatusComponent from './StatusComponent';
import MultiplierFrame from '../MultiplierFrame';
import { Tweener } from '../../../core/tweener/engineTween';
import ICommonGameService from '../../services/ICommonGameService';

export default class UIPanelMobileVertical extends AdjustableLayoutContainer {

    private wallet: Wallet;
    private slotMachine: SlotMachine;

    private _config: UIPanellConfiguration;

    // VISUALS
   // public cascadeHistoryPanelMobile: CascadeHistoryView;
    public btnFreeSpin: FreeSpinButton
   // public multiplierFrameMobile: MultiplierFrame
    public statusComponent: StatusComponent

    private uiSettings: UISettingsMobileVertical;
    private uiMain: UIMain;

    //private btnDoubleChance: DoubleChanceButton;


    private tfBalance: ValueText;
    private tfBet: Text;


    private uiPosition

    // private btnBet: Button;
    //private btnWin: Button;

    private balanceInfo: BalanceInfo
    private background: Graphics;

    constructor(config: UIPanellConfiguration) {
        super(AssetsManager.layouts.get('UIPanelMobileVertical'));

        this._config = config;

        LayoutBuilder.create(this.layout, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });
        this.uiPosition = 0
        //
        // this.tfBalance = this.balanceInfo.tfCredit;
        // this.tfBet = this.balanceInfo.tfBet;


        this.wallet = container.resolve(Wallet);
        this.slotMachine = container.resolve(SlotMachine);
        this.slotMachine.on(SlotMachineEvent.STATE_CHANGED, this.onSlotMachineStateChanged, this);
        const uiState = container.resolve(UIState);
        uiState.on(UIStateEvent.SETTINGS_OPEN_CHANGED, this.onUiSettingsOpenChange, this);
        this.onUiSettingsOpenChange();
        this.statusComponent.setStatusWinValue(0)


        //this.winValue = 0;
    }

    // PUBLIC API
    public lock(): void {
        this.uiMain.lock();

        new ControlEvent(UIPanelEvent.CLOSE_SETTINGS).dispatch();
    }

    public unlock(): void {
        this.uiMain.unlock();

    }

    public updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);
        this.background.width = desc.currentWidth;
        this.background.x = -(desc.currentWidth - desc.baseWidth) / 2;

        if (desc.baseWidth < desc.currentWidth) {
            this.uiMain.y = this.background.y = this.statusComponent.y = this.uiSettings.y = 0
        } else {
            this.uiPosition = this.uiMain.y = this.background.y = this.statusComponent.y = this.uiSettings.y = (desc.currentHeight - desc.baseHeight) / 2
        }
    }



    // PRIVATE API
    public onSlotMachineStateChanged(currentState: SlotMachineState): void {
        const sm: SlotMachine = this.slotMachine;
        const wallet: Wallet = container.resolve(Wallet);
        const gs: ICommonGameService = container.resolve<ICommonGameService>('GameService');

        switch (currentState) {
            case SlotMachineState.SPINNING:
                this.statusComponent.setStatusWinValue(0);
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
                //this.multiplierFrameMobile.value = this.slotMachine.currentSpinResult.totalWinMultiplier;
                break;
            case SlotMachineState.FREE_SPINS:
                break;
            case SlotMachineState.FREE_SPINS_ROUND_END:
                break;
            case SlotMachineState.IDLE:
                this.hideMultiplierFrame();
                //this.multiplierFrameMobile.value = 0;
                this.statusComponent.setStatusWinValue(0)
                break;
        }
    }
    private showMultiplierFrame(): void {
        // Tweener.addTween(this.btnDoubleChance, {
        //     alpha: 0,
        //     time: 1,
        //     onComplete: () => {
        //         this.btnDoubleChance.visible = false
        //     },
        // });
        //
        // Tweener.addTween(this.multiplierFrameMobile, {
        //     alpha: 1,
        //     time: 2,
        //     delay: 0.6,
        //     onStart: () => {
        //         this.multiplierFrameMobile.visible = true;
        //     }
        // });

    }

    private hideMultiplierFrame(): void {
        // const offsetYMobile: number = 24;
        // Tweener.addTween(this.multiplierFrameMobile, {
        //     alpha: 0,
        //     time: 1,
        //     onComplete: () => {
        //         this.multiplierFrameMobile.visible = false;
        //     }
        // });
        //
        // this.btnDoubleChance.visible = true
        // Tweener.addTween(this.btnDoubleChance, {
        //     alpha: 1,
        //     time: 1
        // });
    }
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'Button':
                instance = new Button(le);
                break;
            case 'ButtonSpin':
                instance = new ButtonSpin(le);
                break;
            case 'ValueText':
                instance = new ValueText(le);
                break;
            case 'UIMain':
                instance = new UIMain(le, this._config.UIMainConfiguration);
                break;

            case 'FreeSpinButton':
                instance = new FreeSpinButton(le);
                break;
            // case 'DoubleChanceButton':
            //     instance = new DoubleChanceButton(le);
            //     break;
            // case 'MultiplierFrameMobile':
            //     instance = new MultiplierFrame(le, true);
            //     break
            // case 'CascadeHistoryPanelMobile':
            //     instance = new CascadeHistoryView(le);
            //     break
            case 'UISettings':
                instance = new UISettingsMobileVertical(le);
                break;
            case 'StatusComponent':
                instance = new StatusComponent(le, 24);
                break;
        }

        return instance;
    }

    private onUiSettingsOpenChange(): void {

        const uiState = container.resolve(UIState);
        if (uiState.settingsOpen) {
            this.animateUiOut(this.uiMain, this.uiMain.btnMenu);
            this.animateUiIn(this.uiSettings, this.uiSettings.btnClose);
        } else {
            this.animateUiIn(this.uiMain, this.uiMain.btnMenu);
            this.animateUiOut(this.uiSettings, this.uiSettings.btnClose);
        }
    }


    private animateUiIn(uiPanel: Container, btnToUnblock) {
        Tweener.addTween(uiPanel, {
            alpha: 1,
            time: 0.25,
            transition: 'easeInOutQuart',
            onStart: () => {
                uiPanel.visible = true;
            },
            onComplete: () => {
                btnToUnblock.enabled = true
            }
        });
    }

    private animateUiOut(uiPanel: Container, btnToBlock) {
        Tweener.addTween(uiPanel, {
            y: uiPanel.y + uiPanel.height,
            alpha: 0,
            time: 0.15,
            transition: 'easeInSine',
            onStart: () => {
                btnToBlock.enabled = false
            },
            onComplete: () => {
                uiPanel.visible = false;
                uiPanel.y = this.background.y

            }
        });
    }


    // USER INTERACTION
    private onBtnBet(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.BET_SETTINGS).dispatch();
    }

    private onBtnWin(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.HISTORY).dispatch();
    }
    public getUIMain() {
        return this.uiMain
    }

}
