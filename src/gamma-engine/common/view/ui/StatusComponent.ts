import { Container } from 'pixi.js';
import StatusBar from './StatusBar';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import LayoutElement from '../../../core/view/model/LayoutElement';
import ValueText from '../../../core/view/text/ValueText';
import { Tweener } from '../../../core/tweener/engineTween';
import Wallet from '../../../slots/model/Wallet';
import SlotMachine from '../../../slots/model/SlotMachine';
import { container } from 'tsyringe';
import { WalletEvent } from '../../../slots/model/event/WalletEvent';
import { SlotMachineEvent } from '../../../slots/model/event/SlotMachineEvent';
import { autoscaleText, measureFontSize } from '../../../core/utils/TextUtils';

export default class StatusComponent extends Container {
    private statusWin: StatusBar
    private statusBalance: StatusBar
    private statusBet: StatusBar

    private slotMachine: SlotMachine
    private wallet: Wallet;
    constructor(le: LayoutElement, private maxFontSize: number = 20) {
        super();

        this.wallet = container.resolve(Wallet)
        this.slotMachine = container.resolve(SlotMachine)
        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.wallet.on(WalletEvent.COIN_VALUE_CHANGED, this.onBetValueChanged, this);
        this.wallet.on(WalletEvent.BALANCE_CHANGED, this.onWalletBalanceChanged, this);
        this.onWalletBalanceChanged()

        this.slotMachine.on(SlotMachineEvent.NEW_LINE_SHOW, this.setStatusWinValue, this)
        this.slotMachine.on(SlotMachineEvent.BET_VALUE_CHANGED, this.onBetValueChanged, this);
        this.onBetValueChanged()

    }
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;
        switch (le.customClass) {
            case 'StatusBar':
                instance = new StatusBar(le, this.maxFontSize);
                break;
        }

        return instance;
    }
    public setStatusWinValue(value:number):void{
        this.statusWin.text.tfValue.text = `${this.wallet.getCurrencyValue(value , false)}`
    }
    private onWalletBalanceChanged() {
        this.statusBalance.text.renderValueFunction = ((tf, value) => {
            tf.text = `${this.wallet.getCurrencyValue(value, false)}`
            this.uniformScale();
        })

        if (Tweener.isTweening(this.statusBalance.text)) {
            Tweener.removeTweens(this.statusBalance.text);
            this.statusBalance.text.value = this.wallet.balance;
            return;
        }

        const balance: number = this.wallet.balance
        const doAnimation: boolean = (balance > this.statusBalance.text.value);

        if (doAnimation) {
            this.statusBalance.text.setValue(balance, {
                countUpDuration: 1
            });
        } else {
            this.statusBalance.text.value = balance;
        }
    }
    private onBetValueChanged() {
        this.statusBet.text.tfValue.text = `${this.wallet.getCurrencyValue(this.slotMachine.totalBet * this.wallet.coinValue * Wallet.denomination, false)}`;

        this.animateText(this.statusBet.text);
    }
    private animateText(tf: ValueText): void {
        Tweener.removeTweens(tf.scale);
        Tweener.addTween(
            tf.scale, {
            x: 1.25,
            y: 1.3,
            transition: 'easeInSine',
            time: 0.1,
            onComplete: () => {
                Tweener.addTween(
                    tf.scale, {
                    x: 1,
                    y: 1,
                    time: 0.12,
                    transition: 'easeOutSine',
                }
                );
            }
        }
        );
    }

    private uniformScale() {
        const statusBars = [this.statusBalance, this.statusWin, this.statusBet];
        const fontSizes = statusBars.map(statusBar =>
            measureFontSize(statusBar.text.tfValue, statusBar.text['area'].width, statusBar.text['area'].height)
        )

        const uniformFontSize = Math.min(...fontSizes);

        statusBars.forEach(statusBar => {
            autoscaleText(
                statusBar.text.tfValue,
                uniformFontSize,
                statusBar.text['area'].width,
                statusBar.text['area'].height
            )
        })
    }
}
