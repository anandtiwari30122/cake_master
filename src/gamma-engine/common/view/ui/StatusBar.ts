import { Container, Graphics, Text } from 'pixi.js';
import Wallet from '../../../slots/model/Wallet';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import ValueText from '../../../core/view/text/ValueText';
import LayoutElement from '../../../core/view/model/LayoutElement';
import { autoscaleText } from '../../../core/utils/TextUtils';

export default class StatusBar extends Container {
    public text: ValueText;
    public currency: Text;
    private currencyContainer: Container;

    private background: Graphics;
    private icon: Graphics;
    constructor(le: LayoutElement, private maxFontSize: number = 20) {
        super();
        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.currency = this.currencyContainer['currency'];
        this.currency.text = Wallet.currency.isoCode

        const area = this.currencyContainer['area'];
        area['visible'] = false;
        autoscaleText(this.currency, this.maxFontSize, area['width'], area['height']);

        const valueArea = this.text['area'];
        valueArea['visible'] = false;
        //autoscaleText(this.currency, this.maxFontSize, valueArea['width'], valueArea['height']);
    }
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'ValueText':
                instance = new ValueText(le);
                break;
        }

        return instance;
    }
}
