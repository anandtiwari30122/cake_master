import {Container, Graphics} from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import {SwitchEvent, SwitchState} from './SwitchState';

export default class SwitchView extends Container {

    private _enable: boolean;
    private _state: SwitchState = SwitchState.ON

    private onView: Graphics
    private offView: Graphics

    private clickArea: Graphics


    constructor(l: LayoutElement) {
        super();

        LayoutBuilder.create(l, this)
        this.state = SwitchState.OFF
        this.clickArea.alpha=0;
        this.clickArea.interactive = true
        this.clickArea.on('pointerup', this.onClick, this)
    }

    public setInitialState(state: SwitchState){
        this._state = state;
        this.updateView();
    }

    public set state(state: SwitchState){
        if(this._state == state)
            return;

        this._state = state
        this.updateView();
        this.emit(SwitchEvent.STATE_CHANGED, this._state);
    }
    private updateView():void{
        [this.onView, this.offView].forEach((view: Graphics): void=>{
            view.visible = false;
        });

        switch (this._state){
            case SwitchState.ON:
                this.onView.visible = true;
                break;
            case SwitchState.OFF:
                this.offView.visible = true;
                break;

        }
    }

    private onClick():void{
        this.state = this._state == SwitchState.ON ? SwitchState.OFF:SwitchState.ON
    }
}

