import AssetsManager from '../../core/assets/AssetsManager';
import {container} from 'tsyringe';
import SlotMachine from '../../slots/model/SlotMachine';
import {SlotMachineState} from '../../slots/model/SlotMachineState';
import {SkeletonData, Spine} from '@esotericsoftware/spine-pixi';
import {Container} from 'pixi.js';
import AdjustSettings from './ui/AdjustSettings';


export default class ButtonSpinAnimation extends Container {
    private spine:Spine;
    public static SPIN: string = 'spin_start';
    public static LOOP: string = 'spin_loop';
    public static STOP: string = 'spin_stop';
    public static WAIT: string = 'wait';
    public static WAIT_DELAY: string = 'wait_delay';

    constructor() {
        super();
        const asset = AssetsManager.spine.get('button-spin');
        this.spine = Spine.from(asset.skeletonUrl, asset.atlasUrl);
        this.addChild(this.spine)
        // this.state.addListener({
        //     complete:(entry: TrackEntry)=> {
        //         if(entry.animation.name === ButtonSpinAnimation.LOOP)
        //             this.state.setAnimation(0, ButtonSpinAnimation.LOOP, false);
        //     }
        // })
        //
        this.spine.state.data.setMix(ButtonSpinAnimation.SPIN,ButtonSpinAnimation.LOOP, 0.15);
        this.spine.state.data.setMix(ButtonSpinAnimation.LOOP,ButtonSpinAnimation.STOP,0.15);
        this.spine.state.data.setMix(ButtonSpinAnimation.LOOP,ButtonSpinAnimation.SPIN,0.15);
        this.spine.state.data.setMix(ButtonSpinAnimation.WAIT_DELAY,ButtonSpinAnimation.SPIN,0.15);

        this.setAnimation(ButtonSpinAnimation.WAIT_DELAY)
    }
    public getSpine(){
        return this.spine;
    }

    public setAnimation(name: string):void{
        this.spine.state.setAnimation(0, name,
            name===ButtonSpinAnimation.LOOP ||
            name===ButtonSpinAnimation.WAIT ||
            name===ButtonSpinAnimation.WAIT_DELAY);
    }

    public addAnimation(name: string, delay: number):void{
        this.spine.state.addAnimation(0, name, name===ButtonSpinAnimation.LOOP, delay);
    }

    public getAnimationDuration(name: string, isSpinning:boolean):number{
        if(name==ButtonSpinAnimation.LOOP && isSpinning )
            return 0;

        return this.spine.skeleton.data.animations.find((animation)=> animation.name === name).duration;
    }
}