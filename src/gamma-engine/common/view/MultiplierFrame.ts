import { Container, Graphics } from 'pixi.js';
import ValueText from '../../core/view/text/ValueText';
import LayoutBuilder from '../../core/utils/LayoutBuilder';
import LayoutElement from '../../core/view/model/LayoutElement';
import AssetsManager from '../../core/assets/AssetsManager';
import { Tweener } from '../../core/tweener/engineTween';
import {Spine} from '@esotericsoftware/spine-pixi';

export default class MultiplierFrame extends Container {
    private static MAX_MULTIPLIER: number = 50;

    //VISUALS
    private flame?: Spine;
    private multiplierValue: ValueText;
    private background: Graphics;
    private vial: Graphics;
    private glow: Container;
    private fire: Container;

    constructor(le: LayoutElement, private isMobile: boolean = false) {
        super();
        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });
        this.fire = this.flame?.getSlotObject('flame_scale');
            //slotContainers[this.flame.skeleton.findSlotIndex('flame_scale')];
        this.glow = this.flame?.getSlotObject('glow_scale');
          //  slotContainers[this.flame.skeleton.findSlotIndex('glow_scale')];

        this.multiplierValue.renderValueFunction = (tfText, value) => {
            tfText.text = `${Math.round(value)}x`;
        };

        this.alpha = 0;

        this.flame?.state.setAnimation(0, 'flame_loop', true);
    }

    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        if (!le.render)
            return instance;

        switch (le.customClass) {
            case 'ValueText':
                instance = new ValueText(le);
                break;
            case 'Flame':
                const asset = AssetsManager.spine.get('flame');
                instance = Spine.from(asset.skeletonUrl, asset.atlasUrl)
                break
        }

        return instance;
    }

    public get value(): number {
        return this.multiplierValue.value;
    }

    public set value(value: number) {
        if (isNaN(value))
            return;

        let countUpTime: number = 0;
        if (this.multiplierValue.value >= value) {
            this.multiplierValue.value = value;
            countUpTime = 0;
        }

        this.multiplierValue.setValue(value, {
            countUpDuration: countUpTime,
            onComplete: () => {
                Tweener.addTween(this.multiplierValue.scale, {
                    x: 2,
                    y: 2,
                    time: 0.5,
                    transition: 'easeOut',
                    onComplete: () => {
                        Tweener.addTween(this.multiplierValue.scale, {
                            x: 1,
                            y: 1,
                            time: 0.5,
                            transition: 'easeIn'
                        });
                    }
                });
            }
        });

        if (value > 0) {
            this.adjustFlameScale();
            this.multiplierValue.alpha = 1;
        }
        else {
            this.reset();
            this.flame?.scale.set(0)
        }
    }

    private reset(): void {
        this.multiplierValue.value = 0;
        this.fire?.scale.set(1, 1)
        this.glow?.scale.set(1, 1)
        this.multiplierValue.alpha = 0;
    }

    private adjustFlameScale(): void {
        const additionalMultiplier: number = this.multiplierValue.value / MultiplierFrame.MAX_MULTIPLIER;
        let newScale: number = 1 + (additionalMultiplier > 1 ? 1 : (additionalMultiplier * 0.75));
        newScale *= this.isMobile ? 0.7 : 1;

        if (this.flame) {
            Tweener.addTween(this.flame.scale, {
                x: newScale,
                y: newScale,
                time: 0.3,
                transition: 'easeOutBack'
            });
        }
    }

}
