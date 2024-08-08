import {Container} from 'pixi.js';
import Button from '../../../core/view/ui/Button';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import SoundManager from '../../../core/sound/SoundManager';
import ControlEvent from '../../../core/control/event/ControlEvent';
import {UIPanelEvent} from '../../control/event/UIPanelEvent';
import { UIPanelType } from '../../model/UIState';
import SoundList from '../../sound/SoundList';
import {container} from 'tsyringe';
import IGameService from '../../../slots/service/IGameService';
import ButtonVolume from '../ButtonVolume';
import {ButtonVolumeEvent} from '../../model/event/ButtonVolumeEvent';
import { GameServiceEvent } from '../../services/GameServiceEvent';
import ICommonGameService from '../../services/ICommonGameService';
import EventEmitter from 'eventemitter3'

export default class UISettingsMobileVertical extends Container {
    // VISUALS
    public btnHome: Button;
    public btnClose: Button;
    public btnVolume: ButtonVolume;
    public btnInfo: Button;
    public btnSettings:Button

    private gs:ICommonGameService
    //public btnHistory: Button;

    constructor(le: LayoutElement) {
        super();

        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });
        this.btnClose.on('pointerup', this.onBtnClose, this);
        this.btnHome.on('pointerup', this.onbtnHome, this);
        this.btnInfo.on('pointerup', this.onBtnPaytable, this);
        this.btnSettings.on('pointerup', this.onBtnSettings,this)
        //this.btnHistory.on('pointerup', this.onBtnHistory, this);
        this.gs = container.resolve<ICommonGameService>('GameService');
        (this.gs as unknown as EventEmitter).on(GameServiceEvent.SETTINGS_CHANGED, ()=>{
            this.updateVolume();
        }, this);
        this.btnVolume.on(ButtonVolumeEvent.STATE_CHANGED, this.onBtnVolume, this)
        this.updateVolume()


    }

    // PRIVATE API
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'Button':
                instance = new Button(le);
                break;
            case 'ButtonVolume':
                instance = new ButtonVolume(le);
                break;
        }
        return instance;
    }


    private onBtnVolume():void{
        if(!this.gs.settings.ambientMusic && !this.gs.settings.soundFx ){
            this.gs.settings.ambientMusic = true;
            this.gs.settings.soundFx = true;
        }
        else {
            this.gs.settings.ambientMusic = false;
            this.gs.settings.soundFx = false;
        }
        this.gs.saveSettings();
        SoundManager.getChannel('ambient').mute = !this.gs.settings.ambientMusic;
        SoundManager.getChannel('default').mute = !this.gs.settings.soundFx;
    }
    private updateVolume():void{
        this.btnVolume.setInitialState(this.gs.settings.ambientMusic, this.gs.settings.soundFx)
    }
    private onBtnSettings(){
        SoundManager.play(SoundList.UI_BUTTON_CLICK)
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.SYSTEM_SETTINGS).dispatch()
    }

    // USER INTERACTION
    private onbtnHome(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        const gs: IGameService = container.resolve<IGameService>('GameService');
        gs.lobby();
    }

    private onBtnClose(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.CLOSE_SETTINGS).dispatch();
    }



    private onBtnPaytable(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.PAYTABLE).dispatch();
    }

    // private onBtnHistory(): void {
    //     SoundManager.play(SoundList.UI_BUTTON_CLICK);
    //     new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.HISTORY).dispatch();
    // }
}
