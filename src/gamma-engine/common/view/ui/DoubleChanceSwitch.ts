import {Container, Graphics} from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import {container} from 'tsyringe';
import { GameServiceEvent } from '../../services/GameServiceEvent';
import { Tweener } from '../../../core/tweener/engineTween';
import ICommonGameService from '../../services/ICommonGameService';
import EventEmitter from 'eventemitter3'

export class DoubleChanceSwitch extends Container{
    private background: Graphics;
    private switchConfirm: Graphics;
    private switchArrow: Graphics;

    private _active: boolean = false;
    private offset: number = 6;

    constructor(le: LayoutElement) {
        super();

        LayoutBuilder.create(le, this);

        const gs: ICommonGameService = container.resolve('GameService');
        (gs as unknown as EventEmitter).on(GameServiceEvent.DOUBLE_CHANCE_CHANGED, ()=>{
            this.active = gs.doubleUpChance;
        }, this);

        this.active = gs.doubleUpChance;
    }

    public set active(isActive: boolean){
        this._active = isActive;
        this.updateView();
    }

    private updateView(): void{
        Tweener.removeTweens(this.switchArrow);
        Tweener.removeTweens(this.switchConfirm);

        this.switchConfirm.alpha = this._active?1:0;
        this.switchArrow.alpha = this._active?0:1;

        [this.switchConfirm, this.switchArrow].forEach((btn)=>{
            Tweener.addTween(btn,{
                x: this._active?this.background.width - btn.width:0,
                time: 0.25,
                transition: 'easeOutSine'
            });
        });
    }
}
