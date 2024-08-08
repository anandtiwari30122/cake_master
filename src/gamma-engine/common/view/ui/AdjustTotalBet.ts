import {Container, Text} from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import LayoutElement from '../../../core/view/model/LayoutElement';
import ScrolledSettings from './ScrolledSettings';
import {ButtonOption} from './ButtonOption';
import Button from '../../../core/view/ui/Button';
import ValueText from '../../../core/view/text/ValueText';
import {SlotMachineEvent} from '../../../slots/model/event/SlotMachineEvent';
import {container} from 'tsyringe';
import SlotMachine from '../../../slots/model/SlotMachine';
import Wallet from '../../../slots/model/Wallet';
import ControlEvent from '../../../core/control/event/ControlEvent';
import {UIEvent} from '../../../slots/control/event/UIEvent';
import {WalletEvent} from '../../../slots/model/event/WalletEvent';
import SoundManager from '../../../core/sound/SoundManager';
import SoundList from '../../sound/SoundList';
import { UIEventExtension } from '../../control/event/UIEventExtension';

export default class AdjustTotalBet extends  Container{
    public tfTotalBetValue:ValueText
    private btnBetDown:Button
    private btnBetUp:Button
    public tfTotalBet:Text


    private slotMachine:SlotMachine;
    private wallet:Wallet
    constructor(le:LayoutElement) {
        super();

        LayoutBuilder.create(le,this,(le:LayoutElement)=>{
            return this.customClassElementCreate(le)
        })
        this.wallet = container.resolve(Wallet);
        this.slotMachine = container.resolve(SlotMachine);
        this.slotMachine.on(SlotMachineEvent.BET_VALUE_CHANGED, this.onBetValueChanged, this);
        this.wallet.on(WalletEvent.COIN_VALUE_CHANGED, this.onBetValueChanged, this);
        this.onBetValueChanged()


        this.btnBetDown.on('pointerup',this.onTotalBetDown, this)
        this.btnBetUp.on('pointerup',this.onTotalBetUp, this)

        this.setupButtonOnClickSound();
    }
    public onBetValueChanged(): void {
        this.tfTotalBetValue.tfValue.text = `${this.wallet.getCurrencyValue(this.slotMachine.totalBet*this.wallet.coinValue *Wallet.denomination)}`;
    }
    public customClassElementCreate(le:LayoutElement){
        let instance: unknown = null;
        switch (le.customClass) {
            case 'Button':
                instance = new Button(le)
                break
            case 'ValueText':
                instance = new ValueText(le)
                break
        }


        return instance;
    }
    private onTotalBetUp():void{
        new ControlEvent(UIEventExtension.TOTAL_BET_UP).dispatch();
    }
    private onTotalBetDown():void{
        new ControlEvent(UIEventExtension.TOTAL_BET_DOWN).dispatch();
    }

    private setupButtonOnClickSound() {
        for(const key in this) {
            const button = this[key];
            if(button instanceof Button) {
                button.on('pointerup', () => SoundManager.play(SoundList.UI_BUTTON_CLICK), this);
            }
        }
    }
}