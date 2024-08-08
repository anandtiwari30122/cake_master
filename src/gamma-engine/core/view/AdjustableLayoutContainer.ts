import IAdjustableLayout from './IAdjustableLayout';
import { ScreenOrientation } from './ScreenOrientation';
import { Container, DisplayObject } from 'pixi.js';
import LayoutElement from './model/LayoutElement';
import { UpdateLayoutDescription } from './UpdateLayoutDescription';

/**
 * Helper class to simplify adding internal orientation layout and children layout management
 *
 * If an item wants to support automated orientation layouts, it needs to declare it in tweenData:
 * {
 *   "layouts":[
 *     "horizontal",
 *     "vertical"
 *   ]
 * }
  */
export default class AdjustableLayoutContainer extends Container implements IAdjustableLayout {

    public layout: LayoutElement | null;
    public currentOrientation: ScreenOrientation;

    constructor(layout: LayoutElement) {
        super();
        this.layout = layout;
    }

    public updateLayout(desc: UpdateLayoutDescription): void {
        if(this.layout?.layouts.size && this.currentOrientation != desc.orientation) {
            if(!this.currentOrientation) {
                this.currentOrientation = desc.orientation == ScreenOrientation.HORIZONTAL ? ScreenOrientation.VERTICAL : ScreenOrientation.HORIZONTAL;
            }

            const oldLayout: LayoutElement = this.layout.layouts.get(this.currentOrientation);
            const newLayout: LayoutElement = this.layout.layouts.get(desc.orientation);

            oldLayout.children.forEach((le:LayoutElement, leName: string) => {
                if(!newLayout.children.has(leName)) {
                    if(this[leName]) {
                        const child: DisplayObject = this[leName];
                        this.removeChild(child);
                    }
                }
            })

            newLayout.children.forEach((le: LayoutElement, leName: string) => {
                if(this[leName]) {
                    const child: DisplayObject = this[leName];
                    child.position.set(le.x, le.y);
                    child.scale.set(le.scaleX, le.scaleY);
                    child.pivot.set(le.pivotX, le.pivotY);
                    // console.warn(leName, le.x, le.y);
                    child.visible = true;
                    this.addChild(child);
                }
            });

            this.currentOrientation = desc.orientation;
        }

        this.children.forEach((child: DisplayObject) => {
            if(child['updateLayout']) {
                child['updateLayout'](desc);
            }
        });
    }
}
