import {BitmapText, Container, Text} from 'pixi.js';
import {container} from 'tsyringe';
import AssetsManager from '../../../core/assets/AssetsManager';
import Sound from '../../../core/sound/Sound';
import SoundManager from '../../../core/sound/SoundManager';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import LayoutElement from '../../../core/view/model/LayoutElement';
import Wallet from '../../../slots/model/Wallet';
import SoundList from '../../sound/SoundList';
import {Tweener} from '../../../core/tweener/engineTween';
import {Slot, Spine, TrackEntry} from '@esotericsoftware/spine-pixi';

export default class PopupFreespins extends Container {

    private freespinCountSlot: Slot;
    private freespinWinValueSlot: Slot;
    private type: () => PopupFreespinsType;


    private _value: number;
    private winValue: number;
    // VISUALS
    public animation: Spine;
    public tfAmount: Text | BitmapText;
    public tfCounter: Text | BitmapText;

    private loopedSound: Sound;

    constructor(amount: number | (() => number), type: () => PopupFreespinsType, scale?: number) {
        super();
        LayoutBuilder.create(AssetsManager.layouts.get('PopupFreespins'), this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });
        this.type = type;
        this.tfAmount.text = (amount instanceof Function ? amount() : amount).toString();

        this.winValue = (amount instanceof Function ? amount() : amount);
        this.freespinCountSlot = this.animation.skeleton.findSlot('spins_count');

        this.freespinCountSlot?.setAttachment(null);
        this.freespinWinValueSlot?.setAttachment(null);

        if (this.freespinCountSlot) {
            this.animation.addSlotObject(this.freespinCountSlot, this.tfAmount);
        }

        if (scale)
            this.animation.scale.set(scale);

        this.on('added', this.onAdded, this);
        this.on('removed', this.onRemoved, this);
    }

    // PRIVATE API
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'FreespinsAnimation':
                const asset = AssetsManager.spine.get('freespins_popup');
                instance = Spine.from(asset.skeletonUrl, asset.atlasUrl);
                break;
        }

        return instance;
    }

    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;

        const wallet: Wallet = container.resolve(Wallet);
        this.tfCounter.text = wallet.getCurrencyValue(value, false);
    }

    private onAdded(): void {
        const numLoopAnimations: number = 5;

        this.animation.state.setEmptyAnimations(0);
        const countUpDuration: number = 4;
        this.animation.state.addListener({
            start: (entry: TrackEntry) => {
                if (entry.animation.name.includes('_in')) {
                    if (this.freespinCountSlot) {
                        this.freespinCountSlot.color.a = 0;
                        Tweener.addTween(this.freespinCountSlot.color, {
                            a: 1,
                            time: 0.3,
                            transition: 'easeOutQuad',
                            delay: 0.3
                        });

                        this.freespinCountSlot.bone.scaleX = 0.3;
                        this.freespinCountSlot.bone.scaleY = -0.3;
                        Tweener.addTween(this.freespinCountSlot.bone, {
                            scaleX: 1,
                            scaleY: -1,
                            time: countUpDuration / 8,
                            transition: 'easeOutBack',
                            delay: 0.3
                        });
                    }
                } else if (entry.animation.name.includes('_out')) {
                    if (this.freespinCountSlot) {
                        Tweener.addTween(this.freespinCountSlot.color, {
                            a: 0,
                            time: 0.5,
                            transition: 'easeInQuad',
                        });
                    }
                }
            }
        });

        const type = this.type();
        this.animation.state.data.setMix(`${type}_in`, `${type}_loop`, 0.7);
        this.animation.state.setAnimation(0, `${type}_in`, false);
        for (let i = 0; i < numLoopAnimations; i++) {

            this.animation.state.addAnimation(0, `${type}_loop`, false, 0);
        }
        this.animation.state.addAnimation(0, `${type}_out`, false, 0);

        if (this.type() == PopupFreespinsType.START) {
            return;
        }

        this.value = 0;

        Tweener.addTween(this, {
            value: this.winValue,
            time: countUpDuration,
            transition: 'easeInOutQuad',
            onStart: () => {
                this.loopedSound = SoundManager.loop({
                    id: SoundList.COUNTER_LOOP,
                    volume: 0.25
                });
            },
            onComplete: () => {
                this.loopedSound.stop();
                SoundManager.play({
                    id: SoundList.COUNTER_END,
                    volume: 0.4
                });
            }
        });
    }


    private onRemoved(): void {
        if (this.loopedSound)
            this.loopedSound.stop();

        Tweener.removeTweens(this);
        if(this.freespinCountSlot) {
            Tweener.removeTweens(this.freespinCountSlot.color);
            Tweener.removeTweens(this.freespinCountSlot.bone);
        }

        this.animation.state.setEmptyAnimations(0);
        this.animation.state.clearListeners();
        this.animation['lastTime'] = null;
    }
}

export enum PopupFreespinsType {
    START = 'start',
    END = 'end'
}
