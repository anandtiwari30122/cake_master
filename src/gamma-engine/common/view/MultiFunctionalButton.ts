import Button from '../../core/view/ui/Button';
import LayoutElement from '../../core/view/model/LayoutElement';
import {Circle, Ellipse, Graphics, Polygon, Rectangle, RoundedRectangle, Text} from 'pixi.js';
import {MultiFunctionalButtonState} from '../model/MultiFunctionalButtonState';
import ControlEvent from '../../core/control/event/ControlEvent';
import {UIPanelEvent} from '../control/event/UIPanelEvent';
import {PopupData, PopupType} from '../model/PopupState';
import SoundManager from '../../core/sound/SoundManager';
import {MultiFunctionalButtonEvent} from '../model/MultiFunctionalButtonEvent';
import SoundList from '../sound/SoundList';
import {Tweener} from '../../core/tweener/engineTween';

export default class MultiFunctionalButton extends Button {
    // VISUALS
    private background: Graphics;
    private tfText: Text;

    private _currentState: MultiFunctionalButtonState;
    private _isVisible:boolean;


    constructor(le: LayoutElement, customClassResolver: (le: LayoutElement) => any = null, hitArea: Rectangle | Circle | Ellipse | Polygon | RoundedRectangle = null) {
        super(le, customClassResolver, hitArea);

        this.background = this['normal']['background'];
        this.tfText = this['normal']['tfText'];

        this._isVisible = this.visible;

        this.state = MultiFunctionalButtonState.INVISIBLE;

        // this.setText('FREESPINS LEFT: 0',true);
        // this.state = MultiFunctionalButtonState.FREESPINS_LEFT;
        //
        // //TODO: test purposes timeout
        // setTimeout(()=>{
        //     this.state = MultiFunctionalButtonState.UNVISIBLE;
        // }, 1500);
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

    public set state(state:MultiFunctionalButtonState){
        if (state === this._currentState)
            return;

        this._currentState = state;
        switch(this._currentState){
            case MultiFunctionalButtonState.FEATURE_BUY:
                this.changeVisibility(true);
                this.changeButton(381, ()=>{
                    this.onBtnFeatureBuy();
                });
                this.setText('FEATURE BUY',true);
                break;
            case MultiFunctionalButtonState.FREESPINS_LEFT:
                this.changeVisibility(true);
                this.changeButton(424);
                break;
            case MultiFunctionalButtonState.INVISIBLE:
                this.changeVisibility(false);
                break;
        }

        this.emit(MultiFunctionalButtonEvent.STATE_CHANGED);
    }

    public setText(text:string, swapWithAnimation: boolean = false){
        if(!swapWithAnimation) {
            this.tfText.text = text;
            return;
        }

        const transitionTime:number = 0.35;
        Tweener.addTween(this.tfText,{
            alpha: 0,
            time:transitionTime/2,
            transition: 'easeOutSine',
            onComplete: ()=>{
                this.tfText.text = text;
                Tweener.addTween(this.tfText, {
                    alpha: 1,
                    time: transitionTime / 2,
                    transition: 'easeOutSine'
                });
            }
        });
    }

    public isVisible():boolean{
        return this._isVisible;
    }

    private changeVisibility(visible: boolean):void{
        //Main value that changes instantly  -> this.visible is only visual aspect of visibility
        this._isVisible = visible;

        if(visible)
            this.visible = visible;

        Tweener.addTween(this,{
            alpha: visible?1:0,
            time: 0.35,
            transition:'easeOutSine',
            onComplete:()=>{
                this.visible = visible;
            }
        })
    }

    private changeButton(width: number, onClick:()=>void = null):void{
        if(!this.visible)
            this.visible = true;

        this.enabled = onClick != null;
        if(onClick)
            this.onclick = onClick;

        const transitionTime:number = 0.7;
        Tweener.addTween(this.background,{
            width: width,
            time: transitionTime,
            transition: 'easeOutQuint'
        });
        Tweener.addTween(this.background.pivot,{
            x: width/2,
            time: transitionTime,
            transition: 'easeOutQuint'
        });
    }

    private onBtnFeatureBuy():void{
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        const data: PopupData = {
            type: PopupType.FEATURE_BUY,
            hideOnClick: false,
            duration: -1,
            callbacks: null
        }
        new ControlEvent(UIPanelEvent.SHOW_POPUP, data).dispatch();
    }
}
