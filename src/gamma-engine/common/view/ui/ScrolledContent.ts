import { Container, DisplayObject, Graphics } from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import { ScrollBox } from '@pixi/ui';

export default class ScrolledContent extends Container {

    private scrollBox: ScrollBox;

    // VISUALS
    public area: Graphics;
    public content: Container;

    constructor(le: LayoutElement, classResolver: (le: LayoutElement)=> unknown = null) {
        super();

        LayoutBuilder.create(le, this, (le:LayoutElement) => {
            if(classResolver) {
                return classResolver(le);
            }
        });

        this.scrollBox = new ScrollBox({
            type: 'vertical',
            width: this.area.width,
            height: this.area.height,
            items: [this.content],
            disableDynamicRendering: true,
            disableEasing: true
        });
        this.addChild(this.scrollBox);

        this.area.destroy();

        this.updateScroll();
    }

    public addItem(item: Container): void {
        this.scrollBox.addItem(item);
    }

    public resize(w: number, h: number): void {
        const oldScrollBox:ScrollBox = this.scrollBox;

        this.scrollBox = new ScrollBox({
            type: 'vertical',
            width: w,
            height: h,
            items: [this.content],
            disableDynamicRendering: true,
            disableEasing: true
        });
        this.addChild(this.scrollBox);

        this.updateScroll();
        this.removeChild(oldScrollBox);
        oldScrollBox.destroy();
    }

    public updateScroll() {
        this.scrollBox.resize();
        this.scrollBox.scrollTop();
    }
}
