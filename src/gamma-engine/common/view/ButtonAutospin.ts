import Button from '../../core/view/ui/Button';
import LayoutElement from '../../core/view/model/LayoutElement';
import {Circle, Ellipse, NineSlicePlane, Polygon, Rectangle, RoundedRectangle, Text} from 'pixi.js';

export default class ButtonAutospin extends Button {
    private tfSpinNumber:Text;
    private counterBackground: NineSlicePlane;

    constructor(le: LayoutElement, customClassResolver: (le: LayoutElement) => any = null, hitArea: Rectangle | Circle | Ellipse | Polygon | RoundedRectangle = null) {
        super(le, customClassResolver, hitArea);

        this.tfSpinNumber = this.normal['tfSpinNumber'];
        this.counterBackground = this.normal['counterBackground'];
    }

    public autospinChange(value:number):void{
        this.counter = value;
        this.normal['stop'].alpha = this.counterBackground.alpha = (value<=0) ? 0: 1;
        this.normal['play'].alpha = (value<=0) ? 1 : 0
    }

    // PRIVATE API
    protected customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            default:
                instance = super.customClassElementCreate(le);
                break;
        }

        return instance;
    }

    private set counter(value:number){
        this.tfSpinNumber.text = value > 0 ? `${value}` : '';
        this.counterBackground.width = this.tfSpinNumber.width + 30;
        this.counterBackground.pivot.set(this.counterBackground.width/2, this.counterBackground.pivot.y);
    }

    protected updateView() {
        super.updateView();

        this.alpha = this.enabled?1:0.4;
    }
}