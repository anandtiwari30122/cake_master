import AssetsManager from '../../../core/assets/AssetsManager';
import { Container, Text } from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import LayoutElement from '../../../core/view/model/LayoutElement';
import Button from '../../../core/view/ui/Button';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { UIPanelEvent } from '../../control/event/UIPanelEvent';
import { SlotGameEventExtension } from '../event/SlotGameEventExtension';
import { container } from 'tsyringe';
import Wallet from '../../../slots/model/Wallet';
import SlotMachine from '../../../slots/model/SlotMachine';
import { autoscaleText } from '../../../core/utils/TextUtils';
import { UpdateLayoutDescription } from '../../../core/view/UpdateLayoutDescription';
import ICommonGameService from '../../services/ICommonGameService';

export default class PopupFeatureBuy extends Container {
    private tfMainText: Text;
    private tfAmount: Text;
    private tfFreespins: Text;

    private btnStart: Button;
    private btnCancel: Button;

    private gs: ICommonGameService;
    private wallet: Wallet;
    private sm: SlotMachine;

    constructor() {
        super();
        LayoutBuilder.create(AssetsManager.layouts.get('PopupFeatureBuy'), this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        if (this['tfMainText']) {
            this['tfMainText'].style.align = 'center';
        }

        this.tfFreespins.style.align = 'center';

        autoscaleText(this.tfFreespins, this.tfFreespins.style.fontSize as number, 537, 244.5);

        this.gs = container.resolve<ICommonGameService>('GameService');
        this.wallet = container.resolve(Wallet);
        this.sm = container.resolve(SlotMachine);
        this.tfAmount.text = this.wallet.getCurrencyValue(
            this.gs.featureBuyConfig.Rate * this.sm.totalBet * this.wallet.coinValue,
            true
        );
        autoscaleText(this.tfAmount, this.tfAmount.style.fontSize as number, 537, 120);

        this.btnStart.on('pointerup', this.onBtnStart, false);
        this.btnCancel.on('pointerup', this.onBtnCancel, false);
    }

    public updateLayout(desc: UpdateLayoutDescription) {
        this.tfAmount.text = this.wallet.getCurrencyValue(
            this.gs.featureBuyConfig.Rate * this.sm.totalBet * this.wallet.coinValue,
            true
        );
        autoscaleText(this.tfAmount, 120, 600, 120);
    }

    protected customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'Button':
                instance = new Button(le);
                break;
        }
        return instance;
    }

    private onBtnStart(): void {
        new ControlEvent(UIPanelEvent.HIDE_POPUP).dispatch();
        new ControlEvent(SlotGameEventExtension.BUY_FREESPINS).dispatch();
    }

    private onBtnCancel(): void {
        new ControlEvent(UIPanelEvent.HIDE_POPUP).dispatch();
    }
}
