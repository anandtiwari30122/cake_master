import { Container, DisplayObject, Rectangle, Circle, Ellipse, Polygon, RoundedRectangle, FederatedEvent, Graphics } from 'pixi.js';
import LayoutElement from '../model/LayoutElement';
import LayoutBuilder from '../../utils/LayoutBuilder';
import { removeArrayElement } from '../../utils/Utils';

export default class Button extends Container {

    protected currentState: ButtonState = ButtonState.DISABLED;

    protected pointerOver: boolean = false;
    protected pointerDown: boolean = false;
    protected _enabled: boolean = true;

    // VISUALS
    public normal: DisplayObject;
    public hover: DisplayObject;
    public down: DisplayObject;
    public disabled: DisplayObject;

    public hitObject: Graphics;

    constructor (le: LayoutElement, customClassResolver: (le: LayoutElement) => unknown = null, hitArea: Rectangle | Circle | Ellipse | Polygon | RoundedRectangle = null) {
        super();

        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            let instance: unknown = null;
            if (customClassResolver) {
                instance = customClassResolver(le);
            }
            if (!instance) {
                instance = this.customClassElementCreate(le);
            }
            return instance;
        });

        this.enabled = true;

        if (hitArea) {
            this.hitArea = hitArea;
        } else if (this.hitObject) {
            this.hitArea = new Rectangle(this.hitObject.x, this.hitObject.y, this.hitObject.width, this.hitObject.height);
            this.removeChild(this.hitObject);
            this.hitObject.destroy();
        }

        this.setState(ButtonState.NORMAL);

        this
            .on('added', this.onAdded, this)
            .on('removed', this.onRemoved, this);
    }

    // PUBLIC API
    public setState(state: ButtonState): void {

        if (this.currentState == state) {
            return;
        }

        this.currentState = state;

        this.updateView();
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    public set enabled(value: boolean) {
        this._enabled = value;
        if (value) {
            this.cursor = 'pointer';
            this.eventMode = 'dynamic';
            this.setState(ButtonState.NORMAL);
        } else {
            this.eventMode = 'auto';
            this.cursor = 'auto';
            this.pointerDown = false;
            this.pointerOver = false;
            this.setState(ButtonState.DISABLED);
        }
    }

    // PRIVATE API
    protected onAdded(): void {
        this.on('pointerdown', this.onButtonDown, this)
            .on('pointerup', this.onButtonUp, this)
            .on('pointerupoutside', this.onButtonUpOutside, this)
            .on('pointerover', this.onButtonOver, this)
            .on('pointerout', this.onButtonOut, this);
    }

    protected onRemoved(): void {
        this.off('pointerdown', this.onButtonDown, this)
            .off('pointerup', this.onButtonUp, this)
            .off('pointerupoutside', this.onButtonUpOutside, this)
            .off('pointerover', this.onButtonOver, this)
            .off('pointerout', this.onButtonOut, this);
    }

    protected onButtonDown(e: FederatedEvent): void {
        if (this._enabled) {
            this.pointerDown = true;
            this.setState(ButtonState.DOWN);
        }
    }

    protected onButtonUp(e: FederatedEvent): void {
        if (this._enabled) {
            this.pointerDown = false;
            if (this.pointerOver) {
                this.setState(ButtonState.HOVER);
            } else {
                this.setState(ButtonState.NORMAL);
            }
        }
    }

    protected onButtonUpOutside(e: FederatedEvent): void {
        if (this._enabled) {
            this.pointerDown = false;
            if (this.pointerOver) {
                this.setState(ButtonState.HOVER);
            } else {
                this.setState(ButtonState.NORMAL);
            }
        }
    }

    protected onButtonOver(e: FederatedEvent): void {
        if (this._enabled) {
            this.pointerOver = true;
            this.setState(ButtonState.HOVER);
        }
    }

    protected onButtonOut(e: FederatedEvent): void {
        if (this._enabled) {
            this.pointerOver = false;
            this.setState(ButtonState.NORMAL);
        }
    }

    protected updateView(): void {
        const itemsToRemove: Array<DisplayObject> = [this.normal, this.hover, this.down, this.disabled];
        let itemToAdd: DisplayObject = null;

        switch (this.currentState) {
            case ButtonState.NORMAL:
                removeArrayElement(itemsToRemove, this.normal);
                itemToAdd = this.normal;
                break;
            case ButtonState.HOVER:
                removeArrayElement(itemsToRemove, this.hover);
                itemToAdd = this.hover;
                break;
            case ButtonState.DOWN:
                removeArrayElement(itemsToRemove, this.down);
                itemToAdd = this.down;
                break;
            case ButtonState.DISABLED:
                removeArrayElement(itemsToRemove, this.disabled);
                itemToAdd = this.disabled;
                break;
        }

        for (const item of itemsToRemove) {
            if (item && item.parent == this) {
                this.removeChild(item);
            }
        }

        if (!itemToAdd) {
            itemToAdd = this.normal;
        }

        if (itemToAdd) {
            this.addChild(itemToAdd);
        }
    }

    protected customClassElementCreate(le: LayoutElement): unknown {
        return null;
    }
}

export enum ButtonState {
    NORMAL = 0,
    HOVER = 1,
    DOWN = 2,
    DISABLED = 3
}
