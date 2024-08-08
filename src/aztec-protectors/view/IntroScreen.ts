import { Circle, Sprite, Text } from 'pixi.js';
import SoundList from '../../gamma-engine/common/sound/SoundList';
import ButtonSpin from '../../gamma-engine/common/view/ButtonSpin';
import ButtonSpinAnimation from '../../gamma-engine/common/view/ButtonSpinAnimation';
import { IntroScreenEvent } from '../../gamma-engine/common/view/event/IntroScreenEvent';
import AssetsManager from '../../gamma-engine/core/assets/AssetsManager';
import SoundManager from '../../gamma-engine/core/sound/SoundManager';
import { Tweener } from '../../gamma-engine/core/tweener/engineTween';
import LayoutBuilder from '../../gamma-engine/core/utils/LayoutBuilder';
import AdjustableLayoutContainer from '../../gamma-engine/core/view/AdjustableLayoutContainer';
import LayoutElement from '../../gamma-engine/core/view/model/LayoutElement';
import { ScreenOrientation } from '../../gamma-engine/core/view/ScreenOrientation';
import Button from '../../gamma-engine/core/view/ui/Button';
import { UpdateLayoutDescription } from '../../gamma-engine/core/view/UpdateLayoutDescription';
import IntroScreenBackground from './IntroScreenBackground';

export default class IntroScreen extends AdjustableLayoutContainer {

    // VISUALS
    private logo: Sprite;
    private btnGetStarted: ButtonSpin;
    private background: IntroScreenBackground;
    private tfIntroText:Text;
    private tfIntroTextMobile:Text;

    constructor() {
        super(AssetsManager.layouts.get('intro-screen'));
        LayoutBuilder.create(this.layout, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.tfIntroText.style.align = 'center';
        this.tfIntroTextMobile.style.align = 'center';

        this.btnGetStarted.on('pointerup', this.onGetStartedClicked, this);

        this.on('added', this.onAdded,this)
        this.on('removed', this.onRemoved, this);
    }
    public updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);

        const introTextMobilePos:number = 540
        const introTextDesktopPos:number = 719
        this.tfIntroText.pivot.set(this.tfIntroText.width/2,this.tfIntroText.height/2)
        this.tfIntroTextMobile.pivot.set(this.tfIntroTextMobile.width/2,this.tfIntroTextMobile.height/2)
        if(desc.orientation == ScreenOrientation.VERTICAL){
            this.tfIntroTextMobile.x = introTextMobilePos
        }
        else{
            this.tfIntroText.x  = introTextDesktopPos
        }

    }

    // PRIVATE API
    private onRemoved(): void {
        Tweener.removeTweens(this);
        this.btnGetStarted.removeTweens()
    }

    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'ButtonGetStarted':
                instance = new ButtonSpin(le);
                const btn = instance as Button;
                btn.hitArea = new Circle(0, 0, 110);
                break;
            case 'IntroScreenBackground':
                instance = new IntroScreenBackground();
                break;
        }

        return instance;
    }
    private onAdded():void{
        this.btnGetStarted.waitAnimation(ButtonSpinAnimation.WAIT)
    }
    // USER INTERACTION
    private onGetStartedClicked(): void {
        this.btnGetStarted.enabled = false;
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        this.emit(IntroScreenEvent.ON_GET_STARTED_CLICKED);
    }
}
