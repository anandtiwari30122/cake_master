import AssetsManager from '../../gamma-engine/core/assets/AssetsManager';
import { Tweener } from '../../gamma-engine/core/tweener/engineTween';
import {Spine, TrackEntry} from '@esotericsoftware/spine-pixi';
import {Container} from 'pixi.js';

export default class Logo extends Container{
    private spine: Spine;
    constructor() {
        super();
        const asset = AssetsManager.spine.get('logo');
        this.spine = Spine.from(asset.skeletonUrl, asset.atlasUrl);
        this.addChild(this.spine);
        this.spine.state.data.setMix('idle','win', 0.15);
        this.spine.state.data.setMix('win','idle',0.15);
        this.spine.state.addListener({
            complete: (entry: TrackEntry) => {
                Tweener.addCaller(this, {
                    count: 1,
                    time: 0,
                    onComplete: () => {
                        this.playIdleAnimation(true);
                    }
                });
            }
        })

        this.playIdleAnimation(true)
    }
    private playIdleAnimation(isLoop:boolean){
        this.spine.state.setEmptyAnimations(0);
        this.spine.state.setAnimation(0, 'idle', isLoop);
    }
    public playWinAnimation(animationName:string):void{
        this.spine.state.setAnimation(0,animationName,false);
    }
}