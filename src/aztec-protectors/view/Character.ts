import AssetsManager from '../../gamma-engine/core/assets/AssetsManager';
import {randomInt} from '../../gamma-engine/core/utils/Utils';
import {Spine, TrackEntry} from '@esotericsoftware/spine-pixi';
import {Container} from 'pixi.js';

export default class Character extends Container {
    private spine: Spine;
    private animationChances: {
        animation: string,
        chance: number
    }[] = [
        {
            animation: 'idle',
            chance: 100,
        }
    ];
    private totalChances: number = 0;

    constructor() {
        super();
        const asset = AssetsManager.spine.get('character');
        this.spine = Spine.from(asset.skeletonUrl, asset.atlasUrl);
        this.addChild(this.spine);
        this.spine.state.addListener({
            complete: (entry: TrackEntry) => {
                const result: number = randomInt(1, this.totalChances);
                let counter: number = 0;
                let animationName: string;
                for (const ac of this.animationChances) {
                    counter += ac.chance;
                    if (result <= counter) {
                        animationName = ac.animation;
                        break;
                    }
                }
                this.spine.state.setAnimation(0, animationName, false);
            }
        });
        this.on('added', this.onAdded, this);
    }

    private onAdded(): void {
        this.spine.state.setEmptyAnimations(0);
        this.spine.state.setAnimation(0, 'idle', false);
    }

    public playWinAnimation() {
        this.spine.state.setAnimation(0, 'win', false);
    }
}