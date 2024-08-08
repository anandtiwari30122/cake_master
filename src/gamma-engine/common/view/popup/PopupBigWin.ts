import { BitmapText, Container, Text } from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import AssetsManager from '../../../core/assets/AssetsManager';
import Wallet from '../../../slots/model/Wallet';
import LayoutElement from '../../../core/view/model/LayoutElement';
import { container } from 'tsyringe';
import Sound from '../../../core/sound/Sound';
import SoundList from '../../sound/SoundList';
import SoundManager from '../../../core/sound/SoundManager';
import { Tweener } from '../../../core/tweener/engineTween';
import {Slot, Spine, TrackEntry} from '@esotericsoftware/spine-pixi';

export default class PopupBigWin extends Container {
    private levelAnimationNames: string[] = ['big', 'mega', 'super', 'grand'];
    private animations: Spine[];

    private levelAnimationDurations: number[] = [1, 1, 1, 1];

    readonly level: number | (() => number);

    private winValue: number | (() => number);
    private _value: number;

    // VISUALS
    public animation: Spine;
    public tfAmount: Text | BitmapText;

    private loopedSound: Sound;

    constructor(level: number | (() => number), winValue: number | (() => number), amountText: Text | BitmapText, scale?:number) {
        super();

        // DisplayShortcuts.init();
        this.winValue = winValue;
        this.on('added', this.onAdded, this);
        this.level = level;
        const asset = AssetsManager.spine.get('celebration_wins') ?? this.levelAnimationNames.map(name => 
            AssetsManager.spine.get(name + '_win')
        );
        
        this.animations = asset instanceof Array 
        ? asset.map(data => Spine.from(data.skeletonUrl, data.atlasUrl))
        : [ Spine.from(asset.skeletonUrl, asset.atlasUrl) ]

        this.tfAmount = amountText;
        this.tfAmount.anchor.set(0.5, 0.5);
        this.tfAmount.scale.y = -1;

        // this.animations.forEach((animation) => {
        //     //const counterContainer:Slot = animation.skeleton.findSlot('counter')
        //     //counterContainer.setAttachment(null);
        //
        //
        //
        //     // 1920x1080 animation is to big for vertical
        //     if(scale)
        //         animation.scale.set(scale)
        // });

        if(scale)
            this.animations.forEach(animation => animation.scale.set(scale))

        this.on('removed', this.onRemoved, this);
    }

    // PUBLIC API
    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;

        const wallet: Wallet = container.resolve(Wallet);
        this.tfAmount.text = wallet.getCurrencyValue(value, false);
    }

    private get levelValue() {
        return this.level instanceof Function ? this.level() : this.level;
    }

    // PRIVATE API
    // private customClassElementCreate(le: LayoutElement): unknown {
    //     let instance: unknown = null;
    //     switch (le.customClass) {
    //         case "BigWinAnimation":
    //             switch (this.levelValue) {
    //                 case 0:
    //                     instance = new Spine(AssetsManager.spine.get("good_win"));
    //                     break;
    //                 case 1:
    //                     instance = new Spine(AssetsManager.spine.get("huge_win"));
    //                     break;
    //                 case 2:
    //                     instance = new Spine(AssetsManager.spine.get("great_win"));
    //                     break;
    //                 case 3:
    //                     instance = new Spine(AssetsManager.spine.get("insane_win"));
    //                     break;
    //             }
    //             break;
    //     }

    //     return instance;
    // }

    private onAdded(): void {
        if (this.levelValue == -1) {
            throw new Error('Big win level not set');
        }

        this.removeChild(this.animation);
        this.animation = this.animations[this.levelValue] ?? this.animations[0];
        this.addChild(this.animation);
        const counterContainer:Slot =this.animation.skeleton.findSlot('counter')
        counterContainer.setAttachment(null);
        this.animation.addSlotObject(counterContainer, this.tfAmount);
        const levelAnimationName: string = this.levelAnimationNames[this.levelValue];
        const levelAnimationDuration: number = this.levelAnimationDurations[this.levelValue];

        // spec says 5 secs animating, so we put 4 + 1 in + 1 out
        const numLoopAnimations: number = Math.ceil(5 / levelAnimationDuration);

        this.animation.state.setEmptyAnimations(0);
        const countUpDuration: number = 4;
        this.animation.state.addListener({
            start: (entry: TrackEntry) => {
                if (entry.animation.name.includes('_win_in')) {
                    counterContainer.color.a = 0;
                    Tweener.addTween(counterContainer.color, {
                        a: 1,
                        time: 0.3,
                        transition: 'easeOutQuad',
                        delay: 0.3,
                    });

                    counterContainer.bone.scaleX = 0.3;
                    counterContainer.bone.scaleY = -0.3;
                    Tweener.addTween(counterContainer.bone, {
                        scaleX: 1,
                        scaleY: -1,
                        time: countUpDuration / 8,
                        transition: 'easeOutBack',
                        delay: 0.3,
                    });
                } else if (entry.animation.name.includes('_win_out')) {
                    Tweener.addTween(counterContainer.color, {
                        a: 0,
                        time: 0.5,
                        transition: 'easeInQuad',
                    });
                }
            },
        });

        this.value = 0;
        Tweener.addTween(this, {
            value: this.winValue instanceof Function ? this.winValue() : this.winValue,
            time: countUpDuration,
            transition: 'easeInOutQuad',
            onStart: () => {
                this.loopedSound = SoundManager.loop({
                    id: SoundList.COUNTER_LOOP,
                    volume: 0.25,
                });
            },
            onComplete: () => {
                this.loopedSound.stop();
                SoundManager.play({
                    id: SoundList.COUNTER_END,
                    volume: 0.4,
                });
            },
        });

        this.animation.state.data.setMix(`${levelAnimationName}_win_in`, `${levelAnimationName}_win_loop`, 0.7);
        this.animation.state.setAnimation(0, `${levelAnimationName}_win_in`, false);
        for (let i = 0; i < numLoopAnimations; i++) {
            this.animation.state.addAnimation(0, `${levelAnimationName}_win_loop`, false, 0);
        }
        this.animation.state.addAnimation(0, `${levelAnimationName}_win_out`, false, 0);
    }

    private onRemoved(): void {
        if (this.loopedSound) this.loopedSound.stop();
        Tweener.removeTweens(this);
        const counterContainer:Slot =this.animation.skeleton.findSlot('counter')
        Tweener.removeTweens(counterContainer.bone);
        Tweener.removeTweens(counterContainer.color);
        this.animations.forEach((animation) => {
            animation.state.setEmptyAnimations(0);
            animation.state.clearListeners();
            animation['lastTime'] = null;
        });
    }
}
