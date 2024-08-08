import EventEmitter from 'eventemitter3';
import {UIStateEvent} from './event/UIStateEvent';
import IPopupCallbacks from '../../slots/view/popup/IPopupCallbacks';

export enum PopupType {
    NOT_ENOUGH_BALANCE = 'notEnoughBalance',
    CONNECTION_LOST = 'connectionLost',
    FEATURE_BUY = 'featureBuy',
}

export class PopupData{
    public type: PopupType;
    public hideOnClick: boolean = false;
    public duration: number = -1;
    public callbacks: IPopupCallbacks = null;
}

export default class PopupState extends EventEmitter {
    private _activePopup: PopupData | null = null;

    public get activePopup(): PopupData  {
        return this._activePopup;
    }

    public set activePopup(popup: PopupData | null) {
        this._activePopup = popup;
        this.emit(UIStateEvent.ACTIVE_POPUP_CHANGED, popup);
    }

    public get activeType(): PopupType{
        return this._activePopup.type;
    }
}
