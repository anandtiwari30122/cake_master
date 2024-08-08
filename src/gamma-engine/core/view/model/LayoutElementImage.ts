import LayoutElement from './LayoutElement';
import { Rectangle } from 'pixi.js';

export default class LayoutElementImage extends LayoutElement {

    public texture: string;
    public scale9Grid: Rectangle = null;
    public tileGrid: Rectangle = null;

    constructor(name: string, texture: string) {
        super(name);
        this.texture = texture;
    }
}
