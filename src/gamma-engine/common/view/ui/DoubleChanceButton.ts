import { Text } from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import SlotMachine from '../../../slots/model/SlotMachine';
import { container } from 'tsyringe';
import Wallet from '../../../slots/model/Wallet';
import { SlotMachineEvent } from '../../../slots/model/event/SlotMachineEvent';
import Button from '../../../core/view/ui/Button';
import { WalletEvent } from '../../../slots/model/event/WalletEvent';
import { DoubleChanceSwitch } from './DoubleChanceSwitch';
import { autoscaleText } from '../../../core/utils/TextUtils';
import ICommonGameService from '../../services/ICommonGameService';
import { CommonTokenConstants } from '../../tsyringe/tokens/CommonTokenConstants';

export class DoubleChanceButton extends Button {
    private costRate: number;

    private tfValue: Text;
    private tfDescription: Text;
    private tfTitle: Text;
    private tfDouble: Text;

    private doubleChanceSwitch: DoubleChanceSwitch;


    constructor(l: LayoutElement) {
        super(l, (le) => {
            let instance: unknown = null;

            switch (le.customClass) {
                case 'DoubleChanceSwitch':
                    instance = new DoubleChanceSwitch(le);
                    break;
            }
            return instance;
        });

        this.costRate = container.resolve(CommonTokenConstants.DOUBLE_CHANCE_BUTTON_COST_RATE);
        this.tfValue = this['normal']['tfValue'];
        this.tfDescription = this['normal']['tfDescription'];
        this.tfDouble = this['normal']['tfDouble'];
        this.tfTitle = this['normal']['tfTitle'];

        this.doubleChanceSwitch = this['normal']['doubleChanceSwitch'];

        const sm: SlotMachine = container.resolve(SlotMachine);
        const wallet: Wallet = container.resolve(Wallet);
        sm.on(SlotMachineEvent.BET_VALUE_CHANGED, () => {
            this.setValue(wallet.getCurrencyValue(this.costRate * sm.totalBet * wallet.coinValue, true));
        }, this);

        wallet.on(WalletEvent.COIN_VALUE_CHANGED, () => {
            this.setValue(wallet.getCurrencyValue(this.costRate * sm.totalBet * wallet.coinValue, true));
        }, this);

        this.setValue(wallet.getCurrencyValue(this.costRate * sm.totalBet * wallet.coinValue, true));

        this.setTexts();

        this.on('pointerup', this.onClick, this);
    }

    public setValue(value: string): void {
        if (this.tfValue) {
            this.tfValue.text = value;
            autoscaleText(this.tfValue, 48, 195, 65);
        }
    }

    private onClick(): void {
        const gs: ICommonGameService = container.resolve<ICommonGameService>('GameService');
        gs.doubleUpChance = !gs.doubleUpChance;
    }

    public setTexts(): void {
        if (this.tfDouble)
            autoscaleText(this.tfDouble, 32, 195, 42);
        if (this.tfDescription) {
            this.tfDescription.style.align = 'center';
            autoscaleText(this.tfDescription, 20, 195, 64);
        }
        if (this.tfTitle)
            autoscaleText(this.tfTitle, 46, 195, 50);
    }

}
