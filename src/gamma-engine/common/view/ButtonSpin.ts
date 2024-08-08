import Button from '../../core/view/ui/Button';
import LayoutElement from '../../core/view/model/LayoutElement';
import {BLEND_MODES, Circle, Ellipse, Polygon, Rectangle, RoundedRectangle, Sprite} from 'pixi.js';
import {degToRad} from '../../core/utils/Utils';
import ButtonSpinAnimation from './ButtonSpinAnimation';
import {Tweener} from '../../core/tweener/engineTween';


export default class ButtonSpin extends Button {
    // VISUALS

    private buttonAnimator: ButtonSpinAnimation;

    private currentAnim: string;

    constructor(le: LayoutElement, customClassResolver: (le: LayoutElement) => any = null, hitArea: Rectangle | Circle | Ellipse | Polygon | RoundedRectangle = null) {
        super(le, customClassResolver, hitArea);

        this.buttonAnimator = (this.normal as ButtonSpinAnimation);
    }

    // PRIVATE API
    protected customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'ButtonSpinAnimation':
                instance = new ButtonSpinAnimation();
                break;
            default:
                instance = super.customClassElementCreate(le);
                break;
        }

        return instance;
    }
    public removeTweens():void{
        this.buttonAnimator.visible = false
        this.buttonAnimator.getSpine().state.setEmptyAnimations(0)
    }
    public waitAnimation(waitAnimation:string){
        this.buttonAnimator.setAnimation(waitAnimation)
    }

    public spinAnimation(inAnim:string, outAnim:string, showPattern:boolean = false, addRotation:boolean = false, isSpinning:boolean = true){
        if(this.currentAnim===outAnim) {
            return;
        }
        this.buttonAnimator.setAnimation(inAnim);

        this.buttonAnimation(outAnim, this.buttonAnimator.getAnimationDuration(inAnim, isSpinning), addRotation);



        this.currentAnim = inAnim;
    }


    private buttonAnimation(startAnim:string, delay: number = 0, addRotation:boolean = false):void{
        Tweener.removeTweens(this.scale);
        Tweener.removeTweens(this.normal);

        this.normal.rotation = 0;

        if(startAnim.length>0) {
            (delay > 0) ? this.buttonAnimator.addAnimation(startAnim, delay) : this.buttonAnimator.setAnimation(startAnim);
        }

        Tweener.addTween(this.scale, {
            x: 0.83,
            y: 0.83,
            time: 0.1,
            transition: 'easeOutSine'
        });

        Tweener.addTween(this.scale, {
            x: 1,
            y: 1,
            time: 0.65,
            delay: 0.1,
            transition: 'easeOutBounce'
        });

        if(addRotation) {
            Tweener.addTween(this.normal, {
                rotation: degToRad(360),
                time: 0.35,
                transition: 'easeOutQuad',
                onComplete: () => {
                    this.normal.rotation = 0;
                }
            });
        }
    }



}
