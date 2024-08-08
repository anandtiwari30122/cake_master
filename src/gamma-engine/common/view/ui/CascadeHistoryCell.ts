import { Container, Graphics, Text } from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import AssetsManager from '../../../core/assets/AssetsManager';
import SymbolView from '../../../slots/view/SymbolView';
import { SymbolData } from '../../../slots/view/SymbolData';
import { container } from 'tsyringe';
import { CommonTokenConstants } from '../../tsyringe/tokens/CommonTokenConstants';
import {autoscaleText} from '../../../core/utils/TextUtils';

export class CascadeHistoryCell extends Container {
    private background: Graphics;
    private tfCount: Text;
    private tfWin: Text;

    private symbolSlot: Container;
    private winTfSlot: Container;

    private maxFontSize: number;

    constructor(layout, config: {
        symbol: SymbolData,
        symbolCount: number,
        payout: string
    }) {
        super();

        LayoutBuilder.create(AssetsManager.layouts.get(layout), this);
        this.maxFontSize = container.resolve(CommonTokenConstants.CASCADE_HISTORY_CELL_MAX_FONT_SIZE);

        this.tfCount.text = config.symbolCount;

        this.tfWin = this.winTfSlot['tfWin'];
        this.tfWin.text = config.payout;
        this.createSymbolInSlot(config.symbol);
        this.scaleWinText();
    }

    private createSymbolInSlot(symbolData: SymbolData): void {
        this.symbolSlot['area'].visible = false;
        const symbol: SymbolView = new SymbolView(symbolData);
        symbol.height = this.symbolSlot['area'].height
        symbol.width = this.symbolSlot['area'].width;
        const scale = Math.min(symbol.scale.y, symbol.scale.x);
        symbol.scale.set(scale)

        this.symbolSlot.addChild(symbol);
    }

    private scaleWinText() {
        const area = this.winTfSlot['area'];
        area['visible'] = false;
        const width = area['width'];
        const height = area['height'];
        autoscaleText(this.tfWin, this.maxFontSize, width, height);
    }
}
