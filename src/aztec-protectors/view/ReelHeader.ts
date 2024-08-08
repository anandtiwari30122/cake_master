import { Container, Text } from 'pixi.js';
import { Tweener } from '../../gamma-engine/core/tweener/engineTween';
import LayoutBuilder from '../../gamma-engine/core/utils/LayoutBuilder';
import LayoutElement from '../../gamma-engine/core/view/model/LayoutElement';
import ValueText from '../../gamma-engine/core/view/text/ValueText';
import Wallet from '../../gamma-engine/slots/model/Wallet';

export class ReelHeader extends Container{
    private tfText: Text;
    private tfCurrentWinValue: ValueText;

    constructor(le: LayoutElement) {
        super();

        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.tfCurrentWinValue.renderValueFunction = (tfText: Text, value: number)=>{
            tfText.text = `${value.toFixed(2)} ${Wallet.currency.isoCode}`;
        }

        this.tfCurrentWinValue.setValue(0);

        this.tfCurrentWinValue.visible = false;
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

    public setHeader(value: number, shake: boolean = false): void{
        this.tfText.visible = value <=0;
        this.tfCurrentWinValue.visible = !this.tfText.visible;

        if(!value)
            return;

        if(value<=0)
            return;

        //To fix the issue when previous tween is not finished yet
        if (Tweener.isTweening(this.tfCurrentWinValue)) {
            Tweener.removeTweens(this.tfCurrentWinValue);
            this.tfCurrentWinValue.value = value;
            return;
        }

        if(value < this.tfCurrentWinValue.value){
            this.tfCurrentWinValue.value = 0;
        }

        this.tfCurrentWinValue.setValue(value, {
            countUpDuration: 0.8
        });

        if(!shake)
            return;

        Tweener.addTween(this.tfCurrentWinValue.scale,{
            x: 1.15,
            y: 1.15,
            transition: 'easeOutSine',
            time: 0.35,
            onComplete:()=>{
                Tweener.addTween(this.tfCurrentWinValue.scale,{
                    x: 1,
                    y: 1,
                    transition: 'easeOutElastic',
                    time: 0.3
                })
            }
        })
    }

}