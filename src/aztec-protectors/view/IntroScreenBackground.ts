import { Sprite } from 'pixi.js';
import AssetsManager from '../../gamma-engine/core/assets/AssetsManager';
import IAdjustableLayout from '../../gamma-engine/core/view/IAdjustableLayout';
import { ScreenOrientation } from '../../gamma-engine/core/view/ScreenOrientation';
import { UpdateLayoutDescription } from '../../gamma-engine/core/view/UpdateLayoutDescription';

export default class IntroScreenBackground extends Sprite implements IAdjustableLayout {

    constructor() {
        super(AssetsManager.textures.get('main-screen-background'));

        // this.on('added', () => {
        //     this.state.setAnimation(0, 'idle', true);
        // });
        this.anchor.set(0.5,0.5)
    }

    // PUBLIC API
    public updateLayout(desc: UpdateLayoutDescription) {
        // hardcoded value!
        switch (desc.orientation) {
            case ScreenOrientation.HORIZONTAL:
                const xScale: number = desc.currentWidth / desc.baseWidth;
                const yScale: number = desc.currentHeight / desc.baseHeight;

                this.scale.set(xScale > yScale ? xScale : yScale);
                break;
            case ScreenOrientation.VERTICAL:
                const offsetX = (desc.currentWidth - desc.baseWidth) / 2
                const backgroundWidth = 1920
                this.scale.set((desc.currentHeight / desc.baseHeight) * 2);
                this.pivot.x = -(backgroundWidth / 2)
                this.x = 0 - offsetX
                break;
        }

        if(desc.orientation== ScreenOrientation.VERTICAL) {
            const offsetX:number =( desc.currentWidth - desc.baseWidth)/2
            const backgroundWidth:number = 1920
            this.pivot.x = -(backgroundWidth/2)
            this.x = 0 - offsetX
        }

    }

    // public reset() {
    //     this.state.setEmptyAnimations(0);
    // }
}
