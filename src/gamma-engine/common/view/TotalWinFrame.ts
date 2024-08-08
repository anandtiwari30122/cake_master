import {Container, Sprite, Text} from 'pixi.js';
import LayoutElement from '../../core/view/model/LayoutElement';
import LayoutBuilder from '../../core/utils/LayoutBuilder';
import AssetsManager from '../../core/assets/AssetsManager';
import ValueText from '../../core/view/text/ValueText';
import Wallet from '../../slots/model/Wallet';
import {container} from 'tsyringe';
import SlotMachine from '../../slots/model/SlotMachine';
import SoundManager from '../../core/sound/SoundManager';
import SoundList from '../sound/SoundList';
import {Tweener} from '../../core/tweener/engineTween';
import {autoscaleText} from '../../core/utils/TextUtils';
import {Spine} from '@esotericsoftware/spine-pixi';


export default class TotalWinFrame extends Container {

    private _defaultPos: number;

    // VISUALS
    public tfTotalWin: Text;
    public totalWinValue: ValueText;
    private background?: Spine;

    constructor(le: LayoutElement) {
        super();

        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        const wallet: Wallet = container.resolve(Wallet);
        this.totalWinValue.renderValueFunction = (tf, value) => {
            tf.text = `${wallet.getCurrencyValue(value, false)}`;
        };
        if (this.background instanceof Spine) {
            this.background?.state.data.setMix('static', 'win', 0.15);
            this.background?.state.data.setMix('win', 'static', 0.15);
            this.background?.state.setAnimation(0, 'static', true);
        }
        this.setValue(0);
        autoscaleText(this.tfTotalWin, 25, 300, 70);
        this.on('added', this.onAdded, this);
    }

    private onAdded(): void {
        this._defaultPos = this.position.y;
    }

    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'TotalWinGlow':
                const assetGlow = AssetsManager.spine.get('total-win-glow');
                instance = Spine.from(assetGlow.skeletonUrl, assetGlow.atlasUrl);
                break;
            case 'ValueText':
                instance = new ValueText(le);
                break;
            case 'Background':
                const assetBackground = AssetsManager.spine.get('totalwin');
                if (assetBackground) {
                    instance = Spine.from(assetBackground.skeletonUrl, assetBackground.atlasUrl);
                }
                break;
        }

        return instance;
    }

    public setValue(value: number, animated: boolean = false) {
        const sm: SlotMachine = container.resolve(SlotMachine);

        if (animated) {
            if (value < this.totalWinValue.value) {
                this.totalWinValue.value = 0;
            }
            autoscaleText(this.totalWinValue.tfValue, 25, 300, 70);
            //To fix the issue when previous tween is not finished yet
            if (Tweener.isTweening(this.totalWinValue)) {
                Tweener.removeTweens(this.totalWinValue);
                this.totalWinValue.value = value;
                return;
            }

            const isTurbo: boolean = sm.currentGameSpeedLevel === 1;
            this.totalWinValue.setValue(value, {
                countUpDuration: isTurbo ? 0 : 0.6
            });

            SoundManager.play({
                id: SoundList.TOTAL_WIN_APPEARANCE,
                volume: 0.4
            });

            this.winAnimation(isTurbo);
        } else {
            this.totalWinValue.value = value;
        }
    }


    // private isVisible(value: boolean): void {
    //     Tweener.addTween(this.totalWinValue, {
    //         alpha: value ? 1 : 0,
    //         time: 0.25,
    //         transition: 'easeInOutQuint',
    //         onStart: () => {
    //             if (value)
    //                 this.totalWinValue.alpha = 0;
    //         }
    //     })
    // }

    private winAnimation(isTurbo: boolean = false): void {
        if (isTurbo) {
            return;
        }

        const totalWinIn: number = 0.6;
        const totalWinOut: number = 0.5;

        //Animate the total win
        Tweener.addTween(this.totalWinValue.scale, {
            x: 1.5,
            y: 1.5,
            time: totalWinIn,
            transition: 'easeOutQuint',
            onComplete: () => {
                Tweener.addTween(this.totalWinValue.scale, {
                    x: 1,
                    y: 1,
                    time: totalWinOut,
                    transition: 'easeInQuint',
                });
            }
        });
        if (this.background instanceof Spine)
            this.background?.state.setAnimation(0, 'win', false);
    }
}
