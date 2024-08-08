import Button from '../../core/view/ui/Button';
import LayoutElement from '../../core/view/model/LayoutElement';
import {Circle, Ellipse, Polygon, Rectangle, RoundedRectangle, Text} from 'pixi.js';
import ValueText from '../../core/view/text/ValueText';
import {container} from 'tsyringe';
import Wallet from '../../slots/model/Wallet';
import LayoutBuilder from '../../core/utils/LayoutBuilder';
import AssetsManager from '../../core/assets/AssetsManager';
import SlotMachine from '../../slots/model/SlotMachine';

export default class BalanceInfo extends Button{

    private textCredit:Text;
    private textBet:Text;

    public tfCredit:ValueText;
    public tfBet:Text;
    constructor(le: LayoutElement, customClassResolver: (le: LayoutElement) => any = null, hitArea: Rectangle | Circle | Ellipse | Polygon | RoundedRectangle = null) {
        super(le, customClassResolver, hitArea);
        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return new ValueText(le);
        });

    }


}