import { Container, Graphics, Text } from 'pixi.js';
import { HistoryCell } from './HistoryCell';
import Button from '../../../core/view/ui/Button';
import SoundManager from '../../../core/sound/SoundManager';
import { container } from 'tsyringe';
import Panel from './Panel';
import { HistoryEntry } from '../../model/HistoryEntry';
import History from '../../model/History';
import SoundList from '../../sound/SoundList';
import { UpdateLayoutDescription } from '../../../core/view/UpdateLayoutDescription';
import { ScreenOrientation } from '../../../core/view/ScreenOrientation';
import AssetsManager from '../../../core/assets/AssetsManager';
import { CommonTokenConstants } from '../../tsyringe/tokens/CommonTokenConstants';

export default class HistoryPanel extends Panel {
    private cells: HistoryCell[] = [];
    private _currentPage: number = 0;
    private cellsPerPage: number;
    private history: History;

    // VISUALS
    public btnPrevious: Button;
    public btnNext: Button;
    public tfPages: Text;
    public cellsContainer: Container;
    public tableHeader: Container;
    public tableHeaderBackground: Graphics
    private offsetXToMaskBorders: number;
    private borderPadding: number;
    private backgroundWidth: number;

    constructor(layout) {
        super(AssetsManager.layouts.get(layout));
        this.offsetXToMaskBorders = container.resolve(CommonTokenConstants.MOBILE_BORDER_PADDING);
        this.borderPadding = container.resolve(CommonTokenConstants.HISTORY_PANEL_DESKTOP_BORDER_PADDING);
        this.backgroundWidth = container.resolve(CommonTokenConstants.HISTORY_PANEL_DESKTOP_BACKGROUND_WIDTH);
        this.cellsContainer['area'].visible = false;

        this.btnPrevious.on('pointerup', this.onBtnPrevious, this);
        this.btnNext.on('pointerup', this.onBtnNext, this);
        this.tableHeaderBackground = this.tableHeader['background'];
        // create cells
        for (let i = 0; i < 10; i++) {
            const cell: HistoryCell = new HistoryCell(i, layout);
            this.cellsContainer.addChild(cell);
            cell.position.set(0, cell.height * i);
            this.cells.push(cell);
        }

        this.history = container.resolve(History);

        // Test code only
        // for (let i = 0; i < 25; i++) {
        //     const demoItem: HistoryEntry = {
        //         datetime: Date.now(),
        //         totalBet: Math.floor(Math.random() * 1000),
        //         win: Math.floor(Math.random() * 1000),
        //         balance: Math.floor(Math.random() * 1000)
        //     };
        //     this.entries.push(demoItem);
        // }
        this.currentPage = 0;
    }

    // PUBLIC API
    public override updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);

        // if (desc.currentHeight > 1920) {
        //     this.background.height = desc.currentHeight;
        // } else {
        //     this.background.height = 1920;
        // }
        const cellSize = this.cells[0].height ?? this.cellsAreaHeight;
        this.cellsPerPage = Math.floor(this.cellsAreaHeight / cellSize);

        this.currentPage = 0;
        if (desc.orientation == ScreenOrientation.VERTICAL) {
            this.background.pivot.x = this.background.width / 2
            this.tableHeaderBackground.width = desc.currentWidth
            this.cellsContainer.pivot.x = 540
            this.cellsContainer.x = 540

            this.cells.forEach((cell) => {
                cell.x = 0
                cell.backgroundDark.width = desc.currentWidth
                cell.backgroundLight.width = desc.currentWidth
            })
        }
        else if (desc.orientation == ScreenOrientation.HORIZONTAL) {
            const desktopPanelWidth = this.backgroundWidth;
            const borderOffset = this.borderPadding;
            this.background.width = desktopPanelWidth;
            this.tableHeaderBackground.width = desktopPanelWidth - borderOffset * 2
            this.background.pivot.x = this.background.width / 2

            this.cells.forEach((cell) => {
                cell.backgroundDark.width = desktopPanelWidth - borderOffset * 2
                cell.backgroundLight.width = desktopPanelWidth - borderOffset * 2
            })
        }
    }
    public get cellsAreaHeight(): number {
        return this.cellsContainer['area'].height;
    }

    public get pagesTotal(): number {
        return Math.ceil(this.history.entries.length / this.cellsPerPage);
    }

    public get currentPage(): number {
        return this._currentPage;
    }

    public set currentPage(value: number) {
        this._currentPage = value;

        const startPos: number = this._currentPage * this.cellsPerPage;
        const data: HistoryEntry[] = this.history.entries.slice(startPos, startPos + this.cellsPerPage);
        for (let i = 0; i < this.cells.length; i++) {
            const cell: HistoryCell = this.cells[i];
            cell.visible = data[i] !== undefined;
            if (data[i]) {
                cell.entry = data[i];
            }
        }

        this.updateItemsVertically(this.cells, 0);

        if (!this.history.entries.length) {
            this.btnNext.visible = false;
            this.btnPrevious.visible = false;
            this.tfPages.text = 'No history entries';
        } else {
            this.btnNext.visible = true;
            this.btnPrevious.visible = true;
            this.tfPages.text = `${this.currentPage + 1} / ${this.pagesTotal}`;
        }
    }

    // PRIVATE API
    protected updateLayoutElements(width: number, backgroundX: number) {
        super.updateLayoutElements(width, backgroundX);
    }

    // USER INTERACTION
    private onBtnNext(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        this.currentPage = this.currentPage + 1 >= this.pagesTotal ? 0 : this.currentPage + 1;
    }

    private onBtnPrevious(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        this.currentPage = this.currentPage - 1 < 0 ? this.pagesTotal - 1 : this.currentPage - 1;
    }
}
