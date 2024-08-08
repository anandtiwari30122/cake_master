import { Container, Graphics, Text } from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import AssetsManager from '../../../core/assets/AssetsManager';
import Wallet from '../../../slots/model/Wallet';
import { container } from 'tsyringe';
import { HistoryEntry } from '../../model/HistoryEntry';

export class HistoryCell extends Container {
    public backgroundLight: Graphics;
    public backgroundDark: Graphics;

    public tfDate: Text;
    public tfTotalBet: Text;
    public tfWin: Text;
    public tfBalance: Text;

    constructor(id: number, panelLayout) {
        super();

        LayoutBuilder.create(
            panelLayout == 'HistoryPanel'
                ? AssetsManager.layouts.get('HistoryCell')
                : AssetsManager.layouts.get('HistoryCellDesktop'),
            this
        );

        this.backgroundDark.visible = id % 2 === 1;
        this.backgroundLight.visible = !this.backgroundDark.visible;

        this.tfDate.style.align = 'center';
    }

    public set entry(value: HistoryEntry) {
        const wallet: Wallet = container.resolve(Wallet);
        this.tfDate.text = new Date(value.datetime).toLocaleString().replace(', ', '\n');
        this.tfTotalBet.text = wallet.getCurrencyValue(value.totalBet);
        this.tfWin.text = wallet.getCurrencyValue(value.win);
        this.tfBalance.text = wallet.getCurrencyValue(value.balance);
    }

    public updateWidth(width: number, backgroundX: number): void {
        this.backgroundLight.width = this.backgroundDark.width = width;
        this.backgroundLight.position.x = this.backgroundDark.position.x = backgroundX;
    }

    public updateHeight(newHeight: number): void {
        this.backgroundLight.height = this.backgroundDark.height = newHeight;
        [this.tfBalance, this.tfDate, this.tfWin, this.tfTotalBet].forEach((value) => {
            value.y = newHeight / 2;
        });
    }
}
