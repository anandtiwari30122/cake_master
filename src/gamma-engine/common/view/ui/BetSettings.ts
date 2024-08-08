import { Container } from 'pixi.js';
import { container } from 'tsyringe';
import ControlEvent from '../../../core/control/event/ControlEvent';
import SoundManager from '../../../core/sound/SoundManager';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import LayoutElement from '../../../core/view/model/LayoutElement';
import ValueText from '../../../core/view/text/ValueText';
import Button, { ButtonState } from '../../../core/view/ui/Button';
import SlotMachine from '../../../slots/model/SlotMachine';
import Wallet from '../../../slots/model/Wallet';
import { SlotMachineEvent } from '../../../slots/model/event/SlotMachineEvent';
import { WalletEvent } from '../../../slots/model/event/WalletEvent';
import { UIEventExtension } from '../../control/event/UIEventExtension';
import SoundList from '../../sound/SoundList';
import { UIEvent } from '../../../slots/control/event/UIEvent';
import { UpdateLayoutDescription } from '../../../core/view/UpdateLayoutDescription';

export default class BetSettings extends Container {
    public btnBetDown: Button;
    public btnBetUp: Button;

    public btnCoinDown: Button;
    public btnCoinUp: Button;

    public btnTotalBetDown: Button;
    public btnTotalBetUp: Button;

    public tfBet: Text;
    public tfCoin: Text;
    public tfTotalBet: Text;
    public tfBetMax: Text;

    public tfBetValue: ValueText;
    public tfCoinValue: ValueText;
    public tfTotalBetValue: ValueText;

    private wallet: Wallet;
    private slotMachine: SlotMachine;
    constructor(le: LayoutElement) {
        super();

        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.wallet = container.resolve(Wallet);
        this.slotMachine = container.resolve(SlotMachine);

        this.slotMachine.on(SlotMachineEvent.BET_VALUE_CHANGED, this.onBetValueChanged, this);
        this.wallet.on(WalletEvent.COIN_VALUE_CHANGED, this.onBetValueChanged, this);

        this.btnTotalBetUp.on('pointerup', this.onTotalBetUp, this);
        this.btnTotalBetDown.on('pointerup', this.onTotalBetDown, this);

        this.btnCoinDown.on('pointerup', this.onCoinDown, this);
        this.btnCoinUp.on('pointerup', this.onCoinUp, this);

        this.btnBetUp.on('pointerup', this.onBetUp, this);
        this.btnBetDown.on('pointerup', this.onBetDown, this);

        this.setupButtonOnClickSound();

        this.onBetValueChanged();
        this.updateView();

        //this.fetchTranslationFile();
    }

    public updateLayout(desc: UpdateLayoutDescription) {
        this.updateView();
    }

    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'Button':
                instance = new Button(le);
                break;
            case 'ValueText':
                instance = new ValueText(le);
                break;
        }

        return instance;
    }

    private onTotalBetUp(): void {
        new ControlEvent(UIEventExtension.TOTAL_BET_UP).dispatch();
        this.updateView();
    }
    private onTotalBetDown(): void {
        new ControlEvent(UIEventExtension.TOTAL_BET_DOWN).dispatch();
        this.updateView();
    }
    private onCoinUp(): void {
        new ControlEvent(UIEvent.COIN_VALUE_UP).dispatch();
        this.updateView();
    }
    private onCoinDown(): void {
        new ControlEvent(UIEvent.COIN_VALUE_DOWN).dispatch();
        this.updateView();
    }
    private onBetUp(): void {
        new ControlEvent(UIEvent.BET_QUANTITY_UP).dispatch();
        this.updateView();
    }
    private onBetDown(): void {
        new ControlEvent(UIEvent.BET_QUANTITY_DOWN).dispatch();
        this.updateView();
    }

    private updateView(): void {
        const btnBetUpActive: boolean = this.slotMachine.betQuantity < this.slotMachine.description.betMaxQuantity;
        const btnBetDownActive: boolean = this.slotMachine.betQuantity > 1;
        const coinValueIndex: number = this.wallet.coinValueLimits.indexOf(this.wallet.coinValue);
        const btnCoinDownActive: boolean = coinValueIndex > 0;
        const btnCoinUpActive: boolean = coinValueIndex < this.wallet.coinValueLimits.length - 1;

        const view: Map<Button, boolean> = new Map<Button, boolean>([
            [this.btnBetUp, btnBetUpActive],
            [this.btnBetDown, btnBetDownActive],
            [this.btnCoinDown, btnCoinDownActive],
            [this.btnCoinUp, btnCoinUpActive],
            [this.btnTotalBetUp, !(!btnBetUpActive && !btnCoinUpActive)],
            [this.btnTotalBetDown, !(!btnBetDownActive && !btnCoinDownActive)],
        ]);

        view.forEach((active: boolean, btn: Button): void => {
            btn.setState(active ? ButtonState.NORMAL : ButtonState.DISABLED);
            btn.enabled = active;
        });
    }

    private onBetValueChanged(): void {
        this.tfTotalBetValue.tfValue.text = `${this.wallet.getCurrencyValue(
            this.slotMachine.totalBet * this.wallet.coinValue * Wallet.denomination
        )}`;
        this.tfBetValue.tfValue.text = `${this.slotMachine.betQuantity}`;
        this.tfCoinValue.tfValue.text = `${this.wallet.coinValue}`;
    }

    private setupButtonOnClickSound() {
        for (const key in this) {
            const button = this[key];
            if (button instanceof Button) {
                button.on('pointerup', () => SoundManager.play(SoundList.UI_BUTTON_CLICK), this);
            }
        }
    }
}
