import Button from '../../../core/view/ui/Button';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { UIPanelEvent } from '../../control/event/UIPanelEvent';
import SoundManager from '../../../core/sound/SoundManager';
import SlotMachine from '../../../slots/model/SlotMachine';
import { container } from 'tsyringe';
import { UIEvent } from '../../../slots/control/event/UIEvent';
import Panel from './Panel';
import SoundList from '../../sound/SoundList';
import {UpdateLayoutDescription} from '../../../core/view/UpdateLayoutDescription';
import {ScreenOrientation} from '../../../core/view/ScreenOrientation';
import BetSettings from './BetSettings';
import LayoutElement from '../../../core/view/model/LayoutElement';
import ValueText from '../../../core/view/text/ValueText';
import {Container, Text} from 'pixi.js';
import {SlotMachineEvent} from '../../../slots/model/event/SlotMachineEvent';
import Wallet from '../../../slots/model/Wallet';
import {WalletEvent} from '../../../slots/model/event/WalletEvent';
import {Tweener} from '../../../core/tweener/engineTween';
import {UIPanelType} from '../../model/UIState';

export default class AdjustBetPanel extends Panel {
    private wallet:Wallet;
    // VISUALS
    private title: Container;
    private backgroundWidthDefault: number;
    private tfTitle: Text;
    private tfMultiplier: Text;

    public creditComponent:Container;
    public btnMaxBet: Button;
    private btnInfo:Button;
    private btnSettings:Button;

    constructor(layout: LayoutElement) {
        super(layout);
        this.tfMultiplier = this.title['tfMultiplier']
        this.tfTitle= this.title['tfTitle']
        this.btnMaxBet.on('pointerup', this.onBtnMaxBet, this);
        this.backgroundWidthDefault = this['background'].width;

        this.tfMultiplier.text = `${container.resolve(SlotMachine).combinations}x`;

        this.tfTitle.x = 0;
        const xSpacer: number = 15;
        this.tfMultiplier.x = this.tfTitle.width + xSpacer;
        this.title.pivot.x = this.title.width / 2;
        this.title.x = this.background.width / 2;

        this.wallet = container.resolve(Wallet);
        // Status bars are only in mobile panel
        if(this.creditComponent) {
            this.wallet.on(WalletEvent.COIN_VALUE_CHANGED, this.onBetValueChanged, this);
            this.wallet.on(WalletEvent.BALANCE_CHANGED, this.onWalletBalanceChanged, this);
            this.onWalletBalanceChanged()


            container.resolve(SlotMachine).on(SlotMachineEvent.BET_VALUE_CHANGED, this.onBetValueChanged, this);
            this.onBetValueChanged()
        }
        if(this.btnInfo)
            this.btnInfo.on('pointerup', this.onBtnInfo, this)
        if(this.btnSettings)
            this.btnSettings.on('pointerup', this.onBtnSettings, this)
    }
    private onWalletBalanceChanged() {
        const creditValue:ValueText = this.creditComponent['creditValue'];
        creditValue.renderValueFunction = ((tf, value) => {
            tf.text = `${this.wallet.getCurrencyValue(value, true)}`
        })

        if (Tweener.isTweening(creditValue)) {
            Tweener.removeTweens(creditValue);
            creditValue.value = this.wallet.balance;
            return;
        }

        const balance: number = this.wallet.balance
        const doAnimation: boolean = (balance >creditValue.value);

        if (doAnimation) {
            creditValue.setValue(balance, {
                countUpDuration: 1
            });
        } else {
            creditValue.value = balance;
        }
    }
    private onBetValueChanged(){
        const betValue:ValueText = this.creditComponent['betValue'];
        betValue.tfValue.text = `${this.wallet.getCurrencyValue(container.resolve(SlotMachine).totalBet * this.wallet.coinValue * Wallet.denomination, true)}`;
    }

    public customClassElementCreate(le) {
        let instance: unknown = null;
        switch (le.customClass) {
            case 'BetSettings':
                instance = new BetSettings(le);
                break;
            case 'ValueText':
                instance = new ValueText(le);
                break;
            default:
                instance = super.customClassElementCreate(le);
        }

        return instance;
    }

    // PUBLIC API
    public updateLayout(desc: UpdateLayoutDescription) {
       super.updateLayout(desc);
       if(desc.orientation == ScreenOrientation.HORIZONTAL){
           this.background.width = this.backgroundWidthDefault;
        }
        this.background.pivot.x = this.background.width / 2;

        this.children.forEach((child) => child['updateLayout']?.(desc));
    }

    // PRIVATE API
    // USER INTERACTION
    private onBtnInfo(){
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.CLOSE_PANEL).dispatch();
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.PAYTABLE).dispatch();
    }
    private onBtnSettings(){
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.CLOSE_PANEL).dispatch();
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.SYSTEM_SETTINGS).dispatch();
    }
    private onBtnMaxBet(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIEvent.COIN_VALUE_MAX).dispatch();
        new ControlEvent(UIEvent.BET_QUANTITY_MAX).dispatch();
        new ControlEvent(UIPanelEvent.CLOSE_PANEL).dispatch();
    }

    // private onBtnConfirm(): void {
    //     SoundManager.play(SoundList.UI_BUTTON_CLICK);
    //     if (this.selectedButton != null) {
    //         new ControlEvent(UIEvent.BET_SELECT, this.selectedButton.value).dispatch();
    //         new ControlEvent(UIPanelEvent.CLOSE_PANEL).dispatch();
    //     }
    // }
}
