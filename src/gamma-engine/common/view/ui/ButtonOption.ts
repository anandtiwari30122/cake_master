import { Container, Sprite, Text } from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import AssetsManager from '../../../core/assets/AssetsManager';

export class ButtonOption extends Container {

    readonly value:number;
    private _selected: boolean = false;

    // VISUALS
    private backgroundNormal: Sprite;
    private backgroundSelected: Sprite;
    private tfText: Text;

    constructor(value: number, text: string) {
        super();

        LayoutBuilder.create(AssetsManager.layouts.get('ButtonOption'), this);

        this.value = value;
        this.tfText.text = text;

        this.cursor = 'pointer';
        this.eventMode = 'dynamic';

        this.selected = false;
    }

    // PUBLIC API
    public get selected(): boolean {
        return this._selected;
    }

    public set selected(value: boolean) {
        this._selected = value;
        this.backgroundNormal.visible = !this._selected;
        this.backgroundSelected.visible = this._selected;
    }
}
