import { Container, Sprite } from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';

export class Switch extends Container {

    // VISUALS
    public iconOn: Sprite;
    public iconOff: Sprite;

    private _enabled: boolean;

    constructor(le: LayoutElement) {
        super();

        LayoutBuilder.create(le, this);

        this.enabled = true;
        this.eventMode = 'none';
    }

    // PUBLIC API
    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        if (this._enabled === value) {
            return;
        }

        this._enabled = value;
        this.iconOn.visible = this._enabled;
        this.iconOff.visible = !this._enabled;
    }
}
