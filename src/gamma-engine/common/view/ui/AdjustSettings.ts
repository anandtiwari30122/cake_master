import { Container } from 'pixi.js'
import { container } from 'tsyringe'
import SoundManager from '../../../core/sound/SoundManager'
import LayoutBuilder from '../../../core/utils/LayoutBuilder'
import LayoutElement from '../../../core/view/model/LayoutElement'
import SlotMachine from '../../../slots/model/SlotMachine'
import { GameServiceEvent } from '../../services/GameServiceEvent'
import SwitchModule from './SwitchModule'
import { SwitchEvent, SwitchState } from './SwitchState'
import ICommonGameService from '../../services/ICommonGameService'
import EventEmitter from 'eventemitter3'

export default class AdjustSettings extends Container{
    public switch_module_1:SwitchModule
    public switch_module_2:SwitchModule
    public switch_module_3:SwitchModule
    public switch_module_4:SwitchModule
    public switch_module_5:SwitchModule

    private gs: ICommonGameService;
    constructor(le) {
        super();
        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.gs = container.resolve('GameService');
        (this.gs as unknown as EventEmitter).on(GameServiceEvent.SETTINGS_CHANGED, ()=>{
            this.updateView();
        }, this);

        this.switch_module_1['Selection'].on(SwitchEvent.STATE_CHANGED, this.changeQuickSpin, this);
        this.switch_module_2['Selection'].on(SwitchEvent.STATE_CHANGED, this.changeBattery, this);
        this.switch_module_3['Selection'].on(SwitchEvent.STATE_CHANGED, this.changeAmbient, this);
        this.switch_module_4['Selection'].on(SwitchEvent.STATE_CHANGED, this.changeSounds, this);
        this.switch_module_5['Selection'].on(SwitchEvent.STATE_CHANGED, this.changeIntroScreen, this);
        this.updateView();
    }
    private  customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown =null;

        switch (le.customClass) {
            case 'SwitchModule':
                instance = new SwitchModule(le);
                break
        }

        return instance;
    }

    public updateView(): void{
        this.switch_module_1['Selection'].setInitialState(this.gs.settings.quickSpin? SwitchState.ON:SwitchState.OFF);
        this.switch_module_2['Selection'].setInitialState(this.gs.settings.batterySaver? SwitchState.ON:SwitchState.OFF);
        this.switch_module_3['Selection'].setInitialState(this.gs.settings.ambientMusic? SwitchState.ON:SwitchState.OFF);
        this.switch_module_4['Selection'].setInitialState(this.gs.settings.soundFx? SwitchState.ON:SwitchState.OFF);
        this.switch_module_5['Selection'].setInitialState(this.gs.settings.introScreen? SwitchState.ON:SwitchState.OFF);
    }

    private changeQuickSpin(): void{
        this.gs.settings.quickSpin = !this.gs.settings.quickSpin;
        this.gs.saveSettings();
        const sm: SlotMachine = container.resolve(SlotMachine);
        sm.currentGameSpeedLevel = !this.gs.settings.quickSpin ? 0 : 1;

    }

    private changeBattery(): void{
        this.gs.settings.batterySaver = !this.gs.settings.batterySaver;
        this.gs.saveSettings();
    }

    private changeAmbient(): void{
        this.gs.settings.ambientMusic = !this.gs.settings.ambientMusic;
        this.gs.saveSettings();
        SoundManager.getChannel('ambient').mute = !this.gs.settings.ambientMusic;
    }

    private changeSounds(): void{
        this.gs.settings.soundFx = !this.gs.settings.soundFx;
        this.gs.saveSettings();
        SoundManager.getChannel('default').mute = !this.gs.settings.soundFx;
    }

    private changeIntroScreen(): void{
        this.gs.settings.introScreen = !this.gs.settings.introScreen;
        this.gs.saveSettings();
    }
}