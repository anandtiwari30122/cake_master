import {Container, Text} from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import {container} from 'tsyringe';
import Wallet from '../../../slots/model/Wallet';
import SlotMachine from '../../../slots/model/SlotMachine';
import LayoutElement from '../../../core/view/model/LayoutElement';

export default class MetricsView extends Container {
    private balance:Container;
    private bet:Container;
    private win:Container;

    constructor(le:LayoutElement) {
        super();

        LayoutBuilder.create(le, this);

        const wallet:Wallet = container.resolve(Wallet);
        const slotMachine:SlotMachine = container.resolve(SlotMachine);

        (this.balance['text'] as Text).text = `${wallet.getCurrencyValue(wallet.balance)}`;
        (this.bet['text'] as Text).text = `${wallet.getCurrencyValue(slotMachine.totalBet)}`;
        (this.win['text'] as Text).text = `${wallet.getCurrencyValue((slotMachine.roundResult?slotMachine.roundResult.totalWinValue:0)) }`;
    }

    private updateText(container:Container, value:string):void{
        (container['text'] as Text).text = value;
    }
}
