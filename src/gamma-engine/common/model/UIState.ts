import EventEmitter from 'eventemitter3';
import {UIStateEvent} from './event/UIStateEvent';

export enum UIPanelType {
    RULES = 'rules',
    HISTORY = 'history',
    AUTOSPIN_SETTINGS = 'autospinSettings',
    BET_SETTINGS = 'betSettings',
    PAYTABLE = 'paytable',
    SYSTEM_SETTINGS = 'systemSettings'
}

export default class UIState extends EventEmitter {
    private _settingsOpen: boolean = false;
    private _activePanel: UIPanelType | null = null;
    private _interactivity:boolean;

    public get settingsOpen(): boolean {
        return this._settingsOpen;
    }

    public set settingsOpen(value: boolean) {
        if(this._settingsOpen == value) {
            return;
        }

        this._settingsOpen = value;
        this.emit(UIStateEvent.SETTINGS_OPEN_CHANGED, value);
    }

    public get activePanel(): UIPanelType {
        return this._activePanel;
    }

    public set activePanel(type: UIPanelType | null) {
        if(this._activePanel == type) {
            return;
        }

        this._activePanel = type;
        this.emit(UIStateEvent.ACTIVE_PANEL_CHANGED, type);
    }
    public set interactivity(value: boolean) {
        if(this._interactivity == value)
            return
        this._interactivity = value;
        switch (this._interactivity) {
            case true:
                this.emit(UIStateEvent.INTERACTIVE_PANEL_TRUE)
                break
            case false:
                this.emit(UIStateEvent.INTERACTIVE_PANEL_FALSE)
                break
        }

    }
    public get interactivity(){
        return this._interactivity;
    }
}
