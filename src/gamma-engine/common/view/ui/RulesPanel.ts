import AssetsManager from '../../../core/assets/AssetsManager';
import Panel from './Panel';
import { Container } from 'pixi.js';
import { UpdateLayoutDescription } from '../../../core/view/UpdateLayoutDescription';
import { ScreenOrientation } from '../../../core/view/ScreenOrientation';
import ScrolledContent from './ScrolledContent';

export default class RulesPanel extends Panel {

    // VISUALS
    public scrollBox: ScrolledContent;
    public content: Container;

    constructor() {
        super(AssetsManager.layouts.get('RulesPanel'));
        this.content = this.scrollBox['content'];

        this.updateContentView();
    }

    public override updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);

        //this.header.y = this.background.y = 1920 - desc.currentHeight;
        if (desc.currentHeight > 1920) {
            this.background.height = desc.currentHeight;
        } else {
            this.background.height = 1920;
        }

        this.content.children.forEach(item => {
            item.x = (desc.currentWidth - 100) / 2;
        });

       /// this.scrollBox.y = this.header.y + this.header.height;
        let xToSet: number;
        if (desc.orientation == ScreenOrientation.VERTICAL) {
            xToSet = -(desc.currentWidth - desc.baseWidth) / 2;
        } else {
            xToSet = -(desc.currentWidth - desc.baseHeight) / 2;
        }
        this.scrollBox.x = xToSet + 50;

        //this.scrollBox.resize(this.background.width - 100, desc.currentHeight - this.header.height - 50);
    }

    private updateContentView():void{
        for (let i = 1; i < this.content.children.length; i++) {
            const prevItem: Container = this.content.children[i - 1] as Container;
            const prevItemHeight: number = prevItem['area'] ? (prevItem['area'] as Container).height : prevItem.height;
            const spacingY: number = 60;

            this.content.children[i].y = prevItem.y + prevItemHeight + spacingY;
        }
    }
}
