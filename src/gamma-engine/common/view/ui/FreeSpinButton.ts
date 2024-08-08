import Button from '../../../core/view/ui/Button';
import LayoutElement from '../../../core/view/model/LayoutElement';
import { Graphics, Text } from 'pixi.js';
import { container } from 'tsyringe';
import Wallet from '../../../slots/model/Wallet';
import { PopupData, PopupType } from '../../model/PopupState';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { UIPanelEvent } from '../../control/event/UIPanelEvent';
import SlotMachine from '../../../slots/model/SlotMachine';
import { SlotMachineEvent } from '../../../slots/model/event/SlotMachineEvent';
import { WalletEvent } from '../../../slots/model/event/WalletEvent';
import { GameServiceEvent } from '../../services/GameServiceEvent';
import { autoscaleText } from '../../../core/utils/TextUtils';
import { SlotMachineState } from '../../../slots/model/SlotMachineState';
import Translation from '../../../core/translations/Translation';
import ICommonGameService from '../../services/ICommonGameService';
import EventEmitter from 'eventemitter3'

export class FreeSpinButton extends Button {

    private tfTitle: Text;
    private tfValue: Text;
    private area: Graphics;

    constructor(le: LayoutElement) {
        super(le);

        this.tfTitle = this.normal['tfTitle'];
        this.tfValue = this.normal['tfValue'];
        this.area = this.normal['area'];
        this.area.visible = false;

        this.tfTitle.style.align = 'center';

        const sm: SlotMachine = container.resolve(SlotMachine);
        const wallet: Wallet = container.resolve(Wallet);
        const gs: ICommonGameService = container.resolve<ICommonGameService>('GameService')

        sm.on(SlotMachineEvent.STATE_CHANGED, this.onSlotMachineStateChanged, this);

        sm.on(SlotMachineEvent.BET_VALUE_CHANGED, () => {
            this.setTexts(Translation.t('freeSpins.buy'), wallet.getCurrencyValue(gs.featureBuyConfig.Rate * sm.totalBet * wallet.coinValue, true));
        }, this);

        wallet.on(WalletEvent.COIN_VALUE_CHANGED, () => {
            this.setTexts(Translation.t('freeSpins.buy'), wallet.getCurrencyValue(gs.featureBuyConfig.Rate * sm.totalBet * wallet.coinValue, true));
        }, this);

        (gs as unknown as EventEmitter).on(GameServiceEvent.DOUBLE_CHANCE_CHANGED, () => {
            this.setActive(!gs.doubleUpChance);
        }, this);

        this.on('pointerup', this.onClick, this);

        // At this point SlotMachine, Wallet and GameService are fully initialized and contains valid data to be displayed
        this.setTexts(Translation.t('freeSpins.buy'), wallet.getCurrencyValue(gs.featureBuyConfig.Rate * sm.totalBet * wallet.coinValue, true));
    }

    private onSlotMachineStateChanged(currentState: SlotMachineState): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        const wallet: Wallet = container.resolve(Wallet);
        const gs: ICommonGameService = container.resolve<ICommonGameService>('GameService')

        switch (currentState) {
            case SlotMachineState.SPIN_RESULT_FREE_SPINS:
                this.setTexts(Translation.t('freeSpins.left'), sm.currentSpinResult.freespins.totalCount.toString(), false, true);
                break;
            case SlotMachineState.FREE_SPINS_ROUND_START:
                this.setTexts(Translation.t('freeSpins.left'), (sm.currentSpinResult.freespins.remainingCount).toString(), false, true);
                break
            case SlotMachineState.FREE_SPINS:
                this.setTexts(Translation.t('freeSpins.left'), (sm.currentSpinResult.freespins.remainingCount - 1).toString(), false);
                break;
            case SlotMachineState.IDLE:
                this.setTexts(Translation.t('freeSpins.buy'), wallet.getCurrencyValue(gs.featureBuyConfig.Rate * sm.totalBet * wallet.coinValue, true), true, true);
                break;
        }
    }

    private onClick(): void {
        const data: PopupData = {
            type: PopupType.FEATURE_BUY,
            hideOnClick: false,
            duration: -1,
            callbacks: null
        }
        new ControlEvent(UIPanelEvent.SHOW_POPUP, data).dispatch();
    }

    public setTexts(title: string, value: string, isActive: boolean = true, isNotAlpha: boolean = true): void {
        this.tfTitle.text = title;
        this.tfValue.text = value;

        autoscaleText(this.tfTitle, 32, this.area.width, 100)
        autoscaleText(this.tfValue, 54, this.area.width, 65);

        this.setActive(isActive);

        isNotAlpha ? this.alpha = 1 : this.alpha = 0.4
    }

    private setActive(isActive: boolean): void {
        this.enabled = isActive;
    }
}
