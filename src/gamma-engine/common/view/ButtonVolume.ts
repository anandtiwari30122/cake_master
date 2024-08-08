import Button from '../../core/view/ui/Button';
import LayoutElement from '../../core/view/model/LayoutElement';
import {Circle, Ellipse, Graphics, Polygon, Rectangle, RoundedRectangle} from 'pixi.js';
import {ButtonVolumeEvent, ButtonVolumeState} from '../model/event/ButtonVolumeEvent';

export default class ButtonVolume extends Button{
    private _state :ButtonVolumeState
    private btn_on:Graphics
    private btn_off:Graphics

    constructor(le: LayoutElement, customClassResolver: (le: LayoutElement) => any = null, hitArea: Rectangle | Circle | Ellipse | Polygon | RoundedRectangle = null) {
        super(le, customClassResolver, hitArea);
        this.on('pointerup', this.onClick,this)
        this.btn_on=this.normal['btn_on']
        this.btn_off=this.normal['btn_off']
    }
    public set state(state: ButtonVolumeState){
        if(this._state == state)
            return;

        this._state = state
        this.changeState();
        this.emit(ButtonVolumeEvent.STATE_CHANGED, this._state);
    }
    private changeState(){
        [this.btn_off, this.btn_on].forEach((view: Graphics): void=>{
            view.visible = false;
        });
        switch (this._state){
            case ButtonVolumeState.ON:
                this.btn_on.visible = true;
                break;
            case ButtonVolumeState.OFF:
                this.btn_off.visible = true;
                break;

        }
    }
    private onClick(){
        this.state = this._state == ButtonVolumeState.ON? ButtonVolumeState.OFF:ButtonVolumeState.ON

    }
    public setInitialState(music:boolean, fx:boolean):void{
        if(!music && !fx){
            this._state = ButtonVolumeState.OFF
        }
        else {
            this._state = ButtonVolumeState.ON
        }
        this.changeState()
    }
}