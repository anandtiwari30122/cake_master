import LayoutElement from '../model/LayoutElement';
import LayoutBuilder from '../../utils/LayoutBuilder';
import SoundManager from '../../sound/SoundManager';
import Sound from '../../sound/Sound';
import { Container, Text } from 'pixi.js';
import { Tweener } from '../../tweener/engineTween';

export default class ValueText extends Container {
    protected _value: number = 0;

    public renderValueFunction: (textField: Text, value: number) => void;

    private countUpSound: Sound = null;

    // VISUALS
    public tfValue: Text;

    constructor(le: LayoutElement, renderValueFunction: (textField: Text, value: number) => void = null) {
        super();

        this.renderValueFunction = renderValueFunction;

        LayoutBuilder.create(le, this);
    }

    // PUBLIC API
    public get value(): number {
        return this._value;
    }

    public set value(v: number) {
        this._value = v;

        if (this.renderValueFunction) {
            this.renderValueFunction(this.tfValue, this._value);
        } else {
            this.defaultRender();
        }
    }

    public reset(): void {
        Tweener.removeTweens(this);
        this.value = 0;
    }

    public setValue(value: number, animParams: {
        countUpLoopSoundId?: string,
        countUpEndSoundId?: string,
        countUpDuration?: number,
        onComplete?: () => void
    } = null): void {
        Tweener.removeTweens(this);
        if (animParams) {
            if (!this.countUpSound && animParams.countUpLoopSoundId) {
                this.countUpSound = SoundManager.loop(animParams.countUpLoopSoundId);
            }
            Tweener.addTween(this, {
                value: value,
                time: animParams.countUpDuration,
                transition: 'easeOutSine',
                onComplete: () => {
                    if (this.countUpSound) {
                        this.countUpSound.stop();
                        this.countUpSound = null;
                    }

                    if (animParams.countUpEndSoundId) {
                        SoundManager.play(animParams.countUpEndSoundId);
                    }

                    if (animParams.onComplete) {
                        animParams.onComplete();
                    }
                },
            });
        } else {
            Tweener.removeTweens(this);
            if (this.countUpSound) {
                this.countUpSound.stop();
                this.countUpSound = null;
            }
            this.value = value;
        }
    }

    // PRIVATE API
    private defaultRender(): void {
        this.tfValue.text = this.value.toString();
    }
}
