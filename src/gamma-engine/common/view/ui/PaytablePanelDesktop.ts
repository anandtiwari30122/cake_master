import { Container, DisplayObject, Text } from 'pixi.js';
import AssetsManager from '../../../core/assets/AssetsManager';
import LayoutElement from '../../../core/view/model/LayoutElement';
import Button from '../../../core/view/ui/Button';
import { PaytablePanelConfig } from './PaytablePanelMobile';
import PaytableSymbolCell from './PaytableSymbolCell';
import { SymbolData } from '../../../slots/view/SymbolData';
import SlotMachine from '../../../slots/model/SlotMachine';
import { container } from 'tsyringe';
import Panel from './Panel';
import { UpdateLayoutDescription } from '../../../core/view/UpdateLayoutDescription';
import { CommonTokenConstants } from '../../tsyringe/tokens/CommonTokenConstants';
import { DekstopMobileConfiguration, PlainPoint } from '../../tsyringe/tokens/Types';

export default class PaytablePanelDesktop extends Panel {
    private symbolCells: PaytableSymbolCell[][] = [];

    private pages: Container[] = [];
    private currentPage: Container = null;
    private _currentPageIndex: number = -1;
    private standardTextureSymbolSize:number;
    public symbolsContainers: Container[] = [];
    // VISUALS
    private btnPreviousPage: Button
    private btnNextPage: Button
    private tfPageNumber: Text;

    private cellsSpacing: PlainPoint;

    constructor(private config: PaytablePanelConfig) {
        super(AssetsManager.layouts.get('PaytablePanelDesktop'));

        this.cellsSpacing = container.resolve<DekstopMobileConfiguration<PlainPoint>>(CommonTokenConstants.PAYTABEL_PANEL_SYMBOL_CELL_SPACING).desktop;
        for (let i: number = 0; this['page_' + i]; i++) {
            const p: Container = this['page_' + i];
            this.removeChild(p);
            this.pages.push(p);
        }
        this.currentPageIndex = 0;
        
        this.symbolsContainers = this.pages
            .map(page => page['item_1'] as Container)
            .filter(container => container)
        // wait for reposition of all symbols to center container
        this.createSymbols()
        this.onChangePageIndex();
        this.combineTextSprite();

        this.btnPreviousPage.on('pointerup', this.onButtonPrev, this);
        this.btnNextPage.on('pointerup', this.onButtonNext, this);
    }

    // PRIVATE API
    public customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'Button':
                instance = new Button(le);
                const btn: Button = instance as Button;
                // const radius: number = btn.width / 2;
                // btn.hitArea = new Circle(radius, radius, radius);
                break;
        }
        return instance;
    }

    private combineTextSprite(): void {
        const maxTfInPayTable: number = 8
        this.pages.forEach((p: Container): void => {
            for (let i: number = 0; i < maxTfInPayTable; i++) {
                const containerToFit: Container[] = []
                const spacingX: number = 10

                let sumWidth: number = 0;
                let startXPos: number;
                if (p[`tf${i}`]) {
                    this.textAlign(p[`tf${i}`] as Text, 'center')
                }


                if (p[`textCombined${i}`]) {
                    p[`textCombined${i}`]['area'].alpha = 0
                    p[`textCombined${i}`]['content'].children.forEach((child): void => {
                        sumWidth += child.width
                        containerToFit.push(child)

                    })
                    // calculate the sum of all texts/icons and get the start pos
                    sumWidth = sumWidth + (p[`textCombined${i}`]['content'].children.length * spacingX)
                    startXPos = (p[`textCombined${i}`]['area'].width - sumWidth) / 2

                    for (let j: number = 0; j < containerToFit.length; j++) {
                        if (j == 0) {
                            containerToFit[j].x = startXPos
                        } else {
                            containerToFit[j].x = containerToFit[j - 1].x + containerToFit[j - 1].width + spacingX
                        }
                    }
                }
            }
        })

    }

    private async createSymbols() {
        const sm: SlotMachine = container.resolve(SlotMachine);

        // Filter out excluded symbols
        const symbolsCopy: SymbolData[] = [...this.config.symbolsList]
        const excludedSymbols: number[] = this.config.excludedSymbols;
        const symbolsToCreate = symbolsCopy.filter(symbol => !excludedSymbols.includes(symbol.id));

        const symbolsSorted: SymbolData[] = symbolsToCreate.sort((a, b) => (
            (sm?.findRule(a.id, 5)?.reward?.line?.multiplier > sm?.findRule(b.id, 5)?.reward?.line?.multiplier) && a.id) ? -1 : 1
        );
        const symbolsDouble:SymbolData[] = this.config.symbolsDoubles ? [...this.config.symbolsDoubles] : [];
        let symbolsDoubleSorted:SymbolData[];
        if(symbolsDouble.length) {
            const indexMap:Map<number,number> = new Map<number, number>();
            sm.description.rules.forEach(rule => {
                symbolsSorted.forEach((value, index) => {
                    if(rule.pattern.symbolId == value.id)
                        indexMap.set(rule.symbolDoubled, index)
                })
            })
                symbolsDoubleSorted = sm.findDoubledSymbol(symbolsDouble,indexMap)
        }

        this.standardTextureSymbolSize  = this.findStandardTexture(symbolsSorted);


        const symbolsPerPage = this.config.symbolsPerPage.map(desc => desc.rows.reduce((p, c) => p + c, 0));
        const cummulativeSymbolsPerPage = symbolsPerPage.map((_, index, arr) => arr.slice(0, index).reduce((p, c) => p + c, arr[0]));
        const symbolCellLayout = AssetsManager.layouts.get('PaytableSymbolCellDesktop');
        symbolsPerPage.forEach(_ => this.symbolCells.push([]));
        for (let i = 0, insertedSymbols = 0; i < symbolsSorted.length; i++) {
            const symbolCell: PaytableSymbolCell = new PaytableSymbolCell(symbolCellLayout, symbolsSorted[i], {
                setMultipliers: true,
                maxFontSize: 15,
                maxHeight: 60,
                maxWidth: 80
            },
            symbolsDoubleSorted? symbolsDoubleSorted[i]:null,
                this.standardTextureSymbolSize,
                10
                );

            const symbolsPerPageIndex = cummulativeSymbolsPerPage.findIndex(count => count > insertedSymbols);
            if(symbolsPerPageIndex >= 0) {
                this.symbolCells[symbolsPerPageIndex].push(symbolCell);
                this.symbolsContainers[symbolsPerPageIndex].addChild(symbolCell);
                insertedSymbols++;
            }
        }
        this.createSymbolsWithDescription();
    }

    public updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);
        this.symbolCells.forEach((cells, index) => {
            this.updateSymbolsView(cells, this.symbolsContainers[index]['area'], this.config.symbolsPerPage[index].rows);
        })
    }

    private updateSymbolsView(symbols: DisplayObject[], container: Container, elementsInRow: number[]): void {
        let currentId: number = 0;
        let fullWidth
        const containerPivot = container['pivot']['x'];

        elementsInRow.forEach((elInRow, index) => {
            const symbolStandardHeight = 300;
            const symbolCell = symbols[currentId] as PaytableSymbolCell;

            const maxSpacing = Math.max(0, Math.min(this.cellsSpacing.x, (containerPivot * 2 -symbolCell.width * elInRow) / (elInRow - 1)));
            fullWidth = symbolCell.width * elInRow + maxSpacing* (elInRow-1);
            for (let i = 0; i < elInRow; i++) {
                const currentSymbolCell = symbols[currentId] as PaytableSymbolCell;
                currentSymbolCell.x = (currentSymbolCell.width + maxSpacing) * i;
                currentSymbolCell.y = (symbolStandardHeight + this.cellsSpacing.y) * index;
                currentId++;
            }
        });

        this.symbolsContainers.forEach((container:Container):void=>{
            container.pivot.x = fullWidth/2 ;
            container.x = this.background.width/2  ;

        })

    }

    public get currentPageIndex(): number {
        return this._currentPageIndex;
    }

    public set currentPageIndex(value: number) {
        if (this._currentPageIndex == value) {
            return;
        }
        this._currentPageIndex = value;

        if (this.currentPage) {
            this.removeChild(this.currentPage);
        }
        this.currentPage = this.pages[this._currentPageIndex];
        this.addChild(this.currentPage);

    }
    private createSymbolsWithDescription() {
        if(!this.config.symbolsWithDescription)
            return
        this.config.symbolsWithDescription.forEach((desc) => {
            this.createSymbolInProperItem(
                desc.itemId,
                this.config.symbolsList.find((symbol) => symbol.id === desc.symbolId),
                desc.symbolDouble ? this.config.symbolsDoubles.find((symbol) => symbol.id === desc.symbolDouble) : null,
                );
        });
    }
    private createSymbolInProperItem(itemId: number, symbolData: SymbolData, symbolDoubleData?:SymbolData) {
        if (!symbolData)
            return;
        const parent: Container = this.pages[1][`item_${itemId}`];
        const symbolIcon: PaytableSymbolCell = new PaytableSymbolCell(AssetsManager.layouts.get('PaytableSymbolCellDesktop'), symbolData, {
            setMultipliers: false,
            maxFontSize: 15,
            maxHeight: 60,
            maxWidth: 120
        },
            symbolDoubleData? symbolDoubleData : null,
            this.standardTextureSymbolSize,
            10
            );
        if (parent['area']) {
            parent['area'].visible = false;
        }
        parent['iconSlot'].addChild(symbolIcon);

    }

    // USER INTERACTION
    
    private onButtonPrev(): void {
        // Signed 0 needs special case with negatives -> ((n % m) + m) % m negates the side effect
        this.currentPageIndex = (((this.currentPageIndex - 1) % this.pages.length) + this.pages.length) % this.pages.length;
        this.onChangePageIndex()
    }

    private onButtonNext(): void {
        this.currentPageIndex = (this.currentPageIndex + 1) % this.pages.length;
        this.onChangePageIndex()
    }
    private onChangePageIndex(): void {
        this.tfPageNumber.text = `${this.currentPageIndex + 1}/${this.pages.length}`
    }
}
