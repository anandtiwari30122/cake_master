import {Container, Text} from 'pixi.js';
import AssetsManager from '../../../core/assets/AssetsManager';
import SlotMachine from '../../../slots/model/SlotMachine';
import {container} from 'tsyringe';
import PaytableSymbolCell from './PaytableSymbolCell';
import {SymbolData} from '../../../slots/view/SymbolData';
import Panel from './Panel';
import {UpdateLayoutDescription} from '../../../core/view/UpdateLayoutDescription';
import PaytableContent from './PaytableContent';
import Button from '../../../core/view/ui/Button';
import MetricsView from './MetricsView';
import SwitchView from './SwitchView';
import {CommonTokenConstants} from '../../tsyringe/tokens/CommonTokenConstants';
import {DekstopMobileConfiguration, PlainPoint} from '../../tsyringe/tokens/Types';

export default class PaytablePanelMobile extends Panel {
    private config: PaytablePanelConfig;

    private symbolCells: PaytableSymbolCell[] = [];
    private pages: Container[] = [];
    private standardTextureSymbolSize: number;

    private static symbolDoubleOffset = 215;
    // VISUALS
    public scrollBox: PaytableContent;
    public content: Container;
    public symbolsContainer: Container;
    private textFieldVerticalSpacing: number;
    private cellsSpacing: PlainPoint;

    constructor(configuration: PaytablePanelConfig) {
        super(AssetsManager.layouts.get('PaytablePanelMobile'));

        // LayoutBuilder.create(this.layout, this, (le)=>{
        //     return this.customClassElementCreate(le);
        // });
        this.config = configuration;
        this.textFieldVerticalSpacing = container.resolve(CommonTokenConstants.PAYTBALE_PANEL_MOBILE_TEXTFIELD_VERTICAL_SPACING);
        this.cellsSpacing = container.resolve<DekstopMobileConfiguration<PlainPoint>>(CommonTokenConstants.PAYTABEL_PANEL_SYMBOL_CELL_SPACING).mobile;

        this.content = this.scrollBox['content'];

        for (let i: number = 1; this.content['page_' + i]; i++) {
            const p: Container = this.content['page_' + i];
            this.removeChild(p);
            this.pages.push(p);
        }
        this.symbolsContainer = this.pages[0]['item_1'] as Container;

        this.createSymbols();

        this.scrollBox['area'].visible = false;
        this.symbolsContainer['area'].visible = false;

        // this.config.symbolsWithDescription.forEach((desc) => {
        //     this.createSymbolInProperItem(desc.itemId, this.config.symbolsList.find((symbol) => symbol.id === desc.symbolId));
        // });

        this.combineTextSprite();
        // scroll the scrollBox back
        this.on('removed', () => {
            this.scrollBox.updateScroll();
        }, this);
        this.createSymbolsWithDescription();
    }

    private createSymbolsWithDescription() {
        if (!this.config.symbolsWithDescription.length)
            return;
        this.config.symbolsWithDescription.forEach((desc) => {
            this.createSymbolInProperItem(
                desc.itemId,
                this.config.symbolsList.find((symbol) => symbol.id === desc.symbolId),
                desc.symbolDouble ? this.config.symbolsDoubles.find((symbol) => symbol.id === desc.symbolDouble) : null,
            );
        });
    }

    // PUBLIC API
    public updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);
        this.background.pivot.x = this.background.width / 2;
        // reposition paytable cells
        const scrollBoxOffset = this.scrollBox.x * 2;
        this.updateItemsGrid(this.symbolCells, desc.currentWidth - scrollBoxOffset - (desc.currentWidth - desc.baseWidth), this.cellsSpacing.x, this.cellsSpacing.y, 1,);
        //this.symbolsContainer.pivot.x = this.symbolsContainer.width/2


        const spacing: number = this.textFieldVerticalSpacing;
        this.pages.forEach((page) => {
            for (let i = 0; i < page.children.length; i++) {
                if (i == 0)
                    page.children[i].position.y = this.btnClose.height / 2;
                else {
                    if ((page.children[i] as Text).text !== '') // do not add spacing if the Text is empty
                        page.children[i].position.y = page.children[i - 1].position.y + (page.children[i - 1] as Container).height + spacing;
                    else {
                        page.children[i].position.y = page.children[i - 1].position.y + (page.children[i - 1] as Container).height;
                    }
                }
            }
        });

        this.updateItemsVertically(this.pages, 100);


        this.content['spacerBottom'].y = this.pages[this.pages.length - 1].y + this.pages[this.pages.length - 1].height + 100;

    }

    // PRIVATE API
    public customClassElementCreate(le) {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'PaytableContent':
                instance = new PaytableContent(le);
                break;
            case 'Button':
                instance = new Button(le);
                break;
            case 'MetricsView':
                instance = new MetricsView(le);
                break;
            case 'SwitchView':
                instance = new SwitchView(le);
                break;
        }

        return instance;
    }

    private combineTextSprite(): void {
        const maxTfInPayTable: number = 8;

        this.pages.forEach((p) => {
            for (let i: number = 0; i < maxTfInPayTable; i++) {
                const containerToFit: Container[] = [];
                const spacingX: number = 10;

                let sumWidth: number = 0;
                let startXPos: number;
                if (p[`tf${i}`]) {
                    this.textAlign(p[`tf${i}`] as Text, 'center');
                }

                if (p[`textCombined${i}`]) {

                    p[`textCombined${i}`]['area'].alpha = 0;
                    p[`textCombined${i}`]['content'].children.forEach((child): void => {
                        sumWidth += child.width;
                        containerToFit.push(child);

                    });
                    // calculate the sum of all texts/icons and get the start pos
                    sumWidth = sumWidth + (p[`textCombined${i}`]['content'].children.length * spacingX);
                    startXPos = (p[`textCombined${i}`]['area'].width - sumWidth) / 2;

                    for (let j: number = 0; j < containerToFit.length; j++) {
                        if (j == 0) {
                            containerToFit[j].x = startXPos;
                        } else {
                            containerToFit[j].x = containerToFit[j - 1].x + containerToFit[j - 1].width + spacingX;
                        }
                    }
                    if (p[`textCombined${i}`]['tfUnder']) {
                        this.textAlign(p[`textCombined${i}`]['tfUnder'] as Text, 'center');
                        p[`textCombined${i}`]['tfUnder'].y = p[`textCombined${i}`]['content'].y +
                            p[`textCombined${i}`]['content'].height;

                    }
                    if (p[`textCombined${i}`]['tfAbove']) {
                        this.textAlign(p[`textCombined${i}`]['tfAbove'] as Text, 'center');
                        p[`textCombined${i}`]['tfAbove'].y = p[`textCombined${i}`]['content'].y -
                            p[`textCombined${i}`]['tfAbove'].height;
                        p[`textCombined${i}`].pivot.y = p[`textCombined${i}`]['tfAbove'].y;
                    }
                }
            }
        });

    }

    private createSymbols(): void {
        const sm: SlotMachine = container.resolve(SlotMachine);

        const symbolsCopy: SymbolData[] = [...this.config.symbolsList];
        const excludedSymbols: number[] = this.config.excludedSymbols;
        const symbolsToCreate = symbolsCopy.filter(symbol => !excludedSymbols.includes(symbol.id));

        const symbolsSorted: SymbolData[] = symbolsToCreate.sort((a, b) => (
            (sm?.findRule(a.id, 5)?.reward?.line?.multiplier > sm?.findRule(b.id, 5)?.reward?.line?.multiplier) && a.id) ? -1 : 1
        );

        const symbolsDouble: SymbolData[] = this.config.symbolsDoubles ? [...this.config.symbolsDoubles] : [];
        let symbolsDoubleSorted: SymbolData[];
        if (symbolsDouble.length) {
            const indexMap: Map<number, number> = new Map<number, number>();
            sm.description.rules.forEach(rule => {
                symbolsSorted.forEach((value, index) => {
                    if (rule.pattern.symbolId == value.id)
                        indexMap.set(rule.symbolDoubled, index);
                });
            });
            symbolsDoubleSorted = sm.findDoubledSymbol(symbolsDouble, indexMap);
        }

        this.standardTextureSymbolSize = this.findStandardTexture(symbolsSorted);
        const symbolCellLayout = AssetsManager.layouts.get('PaytableSymbolCellMobile');
        for (let i = 0; i < symbolsSorted.length; i++) {
            const symbolCell: PaytableSymbolCell = new PaytableSymbolCell(symbolCellLayout, symbolsSorted[i], {
                    setMultipliers: true,
                    maxFontSize: 20,
                    maxHeight: 60,
                    maxWidth: 120
                },
                symbolsDoubleSorted ? symbolsDoubleSorted[i] : null,
                this.standardTextureSymbolSize,
                10
            );

            this.symbolCells.push(symbolCell);
            this.symbolsContainer.addChild(symbolCell);
        }
    }


    private createSymbolInProperItem(itemId: number, symbolData: SymbolData, symbolDataDouble: SymbolData = null) {
        if (!symbolData)
            return;
        const parent: Container = this.pages[0][`item_${itemId}`];
        const symbolIcon: PaytableSymbolCell = new PaytableSymbolCell(AssetsManager.layouts.get('PaytableSymbolCellMobile'), symbolData, {
                setMultipliers: false,
                maxFontSize: 20,
                maxHeight: 60,
                maxWidth: 120
            },
            symbolDataDouble ? symbolDataDouble : null,
            this.standardTextureSymbolSize);

        if (parent['area']) {
            parent['area'].visible = false;
        }
        parent['iconSlot'].addChild(symbolIcon);
    }
}

export type PaytablePanelConfig = {
    symbolsList: SymbolData[],
    symbolsPerPage: {
        rows: number[]
    }[],
    excludedSymbols: number[],
    symbolsWithDescription: SymbolDescription[],
    symbolsDoubles?: SymbolData[]
}

export type SymbolDescription = {
    itemId: number, //In which content id it has to appear
    symbolId: number,
    symbolDouble?: number
}
