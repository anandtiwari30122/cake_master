import { Container, Graphics, Sprite, Text } from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import { SymbolData } from '../../../slots/view/SymbolData';
import { container } from 'tsyringe';
import SlotMachine from '../../../slots/model/SlotMachine';
import Wallet from '../../../slots/model/Wallet';
import { SlotMachineEvent } from '../../../slots/model/event/SlotMachineEvent';
import { WalletEvent } from '../../../slots/model/event/WalletEvent';
import LayoutElement from '../../../core/view/model/LayoutElement';
import { autoscaleText, measureFontSize } from '../../../core/utils/TextUtils';

type PaytableSymbolCellConfig = {
    setMultipliers: boolean,
    maxFontSize: number,
    maxWidth: number,
    maxHeight: number
}

export default class PaytableSymbolCell extends Container {

    private staticIcon: Container;
    private staticIcon2: Container;
    private symbolId:number;

    public standardSize:number;

    private multiplierDescription: Container;
    private slotMachine:SlotMachine;
    private wallet:Wallet;
    private layoutOrientation: LayoutOrientation;

    private tfPays5:Text;
    private tfPays4:Text;
    private tfPays3:Text;
    private tfPays2:Text;

    private config: PaytableSymbolCellConfig = {
        setMultipliers: true,
        maxFontSize: 20,
        maxHeight: 60,
        maxWidth: 120
    };
    constructor(le: LayoutElement, symbolData: SymbolData, config: PaytableSymbolCellConfig = null, symbolDoubleData:SymbolData = null, standardSize:number = 0, iconsSpacing:number = 0) {
        super();

        LayoutBuilder.create(le, this);

        if(config)
            this.config = config;
        this.symbolId = symbolData.id;
        this.wallet = container.resolve(Wallet)
        this.slotMachine = container.resolve(SlotMachine)

        this.slotMachine.on(SlotMachineEvent.BET_VALUE_CHANGED, () =>{this.setMultipliers(this.symbolId)}, this);
        this.wallet.on(WalletEvent.COIN_VALUE_CHANGED, () =>{this.setMultipliers(this.symbolId)}, this);


        this.tfPays5 = this['multiplierDescription']['tfPays5'];
        this.tfPays4 = this['multiplierDescription']['tfPays4'];
        this.tfPays3 = this['multiplierDescription']['tfPays3'];
        this.tfPays2 = this['multiplierDescription']['tfPays2'];


        this.addIcon(symbolData, symbolDoubleData,standardSize,iconsSpacing);
        if (this.config.setMultipliers)
            this.setMultipliers(symbolData.id)
        else
            this.multiplierDescription.visible = false;
    }

    private addIcon(symbolData: SymbolData, symbolDoubleData?:SymbolData,standardSize?:number ,iconSpacing:number = 0) {
        const staticIcon: Sprite = new Sprite(symbolData.staticIcon.texture);
        let staticDoubleIcon:Sprite;
        // Sprite can take null for parameter so -> new Sprite(symbol?.static.texture) <- will not work
        if(symbolDoubleData)
             staticDoubleIcon= new Sprite(symbolDoubleData.staticIcon.texture);
        staticIcon.pivot.set(staticIcon.width/2,staticIcon.height/2);

        this.staticIcon.addChild(staticIcon);
        if(staticDoubleIcon){
            staticDoubleIcon.pivot.set(staticDoubleIcon.width/2,staticDoubleIcon.height/2);
            this.staticIcon2.addChild(staticDoubleIcon);
        }
        if(!standardSize)
            standardSize = staticIcon.width;

        // change the standardized size if the starling scale is changed
        standardSize = standardSize * this.staticIcon.scale.x;
        // !!! all symbols have different texture sizes
        this.staticIcon2.x += iconSpacing + standardSize;
        this.pivot.x -= standardSize/2 - iconSpacing/2;
        this.pivot.y -= standardSize/2 - iconSpacing/2;
        this.standardSize = symbolDoubleData ? standardSize * 2 + iconSpacing : standardSize + iconSpacing ;
    }

    public get width(){
        return this.standardSize;
    }

    private setMultipliers(symbolId: number): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        if (symbolId > 100 && symbolId < 300) {
            this.tfPays5.text = `${this.wallet.getCurrencyValue(sm.findRule(symbolId, 5).reward.line.multiplier * container.resolve(SlotMachine).totalBet * container.resolve(Wallet).coinValue)}`  ;
            this.tfPays4.text = `${this.wallet.getCurrencyValue(sm.findRule(symbolId, 4).reward.line.multiplier * container.resolve(SlotMachine).totalBet * container.resolve(Wallet).coinValue)}`;
            this.tfPays3.text = `${this.wallet.getCurrencyValue(sm.findRule(symbolId, 3).reward.line.multiplier * container.resolve(SlotMachine).totalBet * container.resolve(Wallet).coinValue)}`;
            this.tfPays2.text = `${this.wallet.getCurrencyValue(sm.findRule(symbolId, 2).reward.line.multiplier * container.resolve(SlotMachine).totalBet * container.resolve(Wallet).coinValue)}`;
        }
    }

}

enum LayoutOrientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical'
}