import { container } from 'tsyringe';
import { Circle, Container, DisplayObject } from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import SoundManager from '../../../core/sound/SoundManager';
import Button from '../../../core/view/ui/Button';
import IGameService from '../../../slots/service/IGameService';
import SoundList from '../../sound/SoundList';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { UIPanelEvent } from '../../control/event/UIPanelEvent';
import UIState, { UIPanelType } from '../../model/UIState';
import { UIStateEvent } from '../../model/event/UIStateEvent';
import ButtonVolume from '../ButtonVolume';
import { ButtonVolumeEvent } from '../../model/event/ButtonVolumeEvent';
import { GameServiceEvent } from '../../services/GameServiceEvent';
import { Tweener } from '../../../core/tweener/engineTween';
import ICommonGameService from '../../services/ICommonGameService';
import EventEmitter from 'eventemitter3'

export default class UISettingsDesktop extends Container {

    private _open: boolean = false;
    private openButtons: Button[];

    // VISUALS
    public btnHome: Button;
    public btnClose: Button;
    public btnVolume: ButtonVolume;
    public btnInfo: Button;
    public btnSettings: Button
    public btnMenu: Button;
    private gs: ICommonGameService

    constructor(le: LayoutElement) {
        super();

        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.btnClose.on('pointerup', this.onBtnClose, this);
        this.btnHome.on('pointerup', this.onbtnHome, this);
        this.btnInfo.on('pointerup', this.onBtnPaytable, this);
        this.btnSettings.on('pointerup', this.onBtnSettings, this)
        this.btnMenu.on('pointerup', this.onBtnMenu, this)
        this.openButtons = [this.btnVolume, this.btnHome, this.btnSettings, this.btnInfo, this.btnHome];
        this.openButtons.forEach((item: DisplayObject) => {
            item.visible = false;
            item.alpha = 0;
        });
        this.gs = this.gs = container.resolve<ICommonGameService>('GameService');
        (this.gs as unknown as EventEmitter).on(GameServiceEvent.SETTINGS_CHANGED, () => {
            this.updateVolume();
        }, this);
        this.btnVolume.on(ButtonVolumeEvent.STATE_CHANGED, this.onBtnVolume, this)
        this.updateVolume()
        const uiState = container.resolve(UIState);
        uiState.on(UIStateEvent.SETTINGS_OPEN_CHANGED, this.onUiSettingsOpenChange, this);
        this.onUiSettingsOpenChange();
    }

    // PUBLIC API
    public lock(): void {
        [
            this.btnVolume,
            this.btnSettings,
            this.btnInfo,
            this.btnClose,
            this.btnHome,
            this.btnMenu
        ].forEach((btn: Button) => {
            btn.enabled = false;
        });
    }

    public unlock(): void {
        [
            this.btnVolume,
            this.btnSettings,
            this.btnInfo,
            this.btnClose,
            this.btnHome,
            this.btnMenu
        ].forEach((btn: Button) => {
            btn.enabled = true;
        });
    }

    public get open(): boolean {
        return this._open;
    }

    public set open(value: boolean) {
        this._open = value;

        this.btnMenu.visible = !this._open;
        this.btnClose.visible = this._open;

        // hardcoded size values



        this.openButtons.forEach((item: Button, index: number) => {
            Tweener.removeTweens(item);
            const itemVisible: boolean = this._open;
            if (itemVisible && !item.visible) {
                item.visible = true;
            }
            item.enabled = itemVisible;
            Tweener.addTween(item, {
                alpha: itemVisible ? 1 : 0,
                time: 0.1,
                transition: 'easeOutQuad',
                onComplete: () => {
                    item.visible = itemVisible;
                    if (!item.visible) {
                        item.alpha = 0;
                    }
                },
                delay: itemVisible ? index * 0.02 : 0
            })
        })
    }

    // PRIVATE API
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'RoundButton':
            case 'Button':
                instance = new Button(le);
                break;
            case 'ButtonVolume':
                instance = new ButtonVolume(le);
                break
        }

        if (le.customClass == 'RoundButton') {
            const btn: Button = instance as Button;
            const radius: number = btn.width / 2;
            btn.hitArea = new Circle(radius, radius, radius);
        }

        return instance;
    }
    private updateVolume(): void {
        this.btnVolume.setInitialState(this.gs.settings.ambientMusic, this.gs.settings.soundFx)
    }


    private onUiSettingsOpenChange(): void {
        const uiState = container.resolve(UIState);
        this.open = uiState.settingsOpen;
    }

    // USER INTERACTION
    private onBtnMenu(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.OPEN_SETTINGS).dispatch();
    }

    private onBtnClose(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.CLOSE_SETTINGS).dispatch();
    }

    private onBtnSettings() {
        SoundManager.play(SoundList.UI_BUTTON_CLICK)
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.SYSTEM_SETTINGS).dispatch()
    }
    private onBtnPaytable(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.PAYTABLE).dispatch();
    }
    private onbtnHome(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        const gs: IGameService = container.resolve<IGameService>('GameService');
        gs.lobby();
    }
    private onBtnVolume(): void {
        if (!this.gs.settings.ambientMusic && !this.gs.settings.soundFx) {
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

}
