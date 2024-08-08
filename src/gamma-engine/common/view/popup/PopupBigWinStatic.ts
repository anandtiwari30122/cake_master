import { Container, Sprite, Text } from 'pixi.js';
import { container } from 'tsyringe';
import AssetsManager from '../../../core/assets/AssetsManager';
import Sound from '../../../core/sound/Sound';
import SoundManager from '../../../core/sound/SoundManager';
import { Tweener } from '../../../core/tweener/engineTween';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import Wallet from '../../../slots/model/Wallet';
import SoundList from '../../sound/SoundList';

export default class PopupBigWinStatic extends Container {
    private _value: number;

    // VISUALS
    private elements: Container = new Container();
    private textContainer: Sprite;
    private counterText: Text;
    private celebrationBackground: Sprite;

    private loopedSound: Sound;

    constructor(private level: number, private winValue: number) {
        super();

        LayoutBuilder.create(AssetsManager.layouts.get('PopupBigWinStatic'), this);

        // Get counter text
        this.counterText = this['animatableContent']['counter']['tfValue'];

        // Get text texture containers
        this.textContainer = this['animatableContent']['text'].removeChildAt(level) as Sprite;
        this['animatableContent']['text'].destroy({ children: true });

        // Get all animatables
        const elements = ['big', 'super', 'mega', 'grand'].map(name => this['animatableContent']['elements'][name]) as Container[];
        const shared = this['animatableContent']['elements']['shared'] as Container;

        //this.elements.addChild(...shared.removeChildren(), ...elements[level].removeChildren());
        this['animatableContent']['elements'].destroy({ children: true });

        this.addChild(this.elements);
        this.addChild(this.textContainer);
        this.addChild(this['animatableContent'].removeChildAt(0));

        // Set value
        this.counterText.text = `${0}`;
        this.counterText.anchor.set(0.5, 0.5);

        this.on('added', this.onAdded, this);
        this.on('removed', this.onRemoved, this);

        this.counterText.alpha = 0;
        this.counterText.scale.set(0.3, 0.3);

        this.elements.children.forEach(child => {
            child.alpha = 0,
            child.scale.set(0);
        });
    }

    // PUBLIC API
    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;

        const wallet: Wallet = container.resolve(Wallet);
        this.counterText.text = wallet.getCurrencyValue(value, false);
    }

    // PRIVATE API
    private onAdded(): void {
        Tweener.addTween(this.counterText.scale, {
            x: 1,
            y: 1,
            time: 0.4,
        })

        Tweener.addTween(this.counterText, {
            alpha: 1,
            time: 0.4
        })

        Tweener.addTween(this, {
            value: this.winValue, 
            onStart: () => {
                this.loopedSound = SoundManager.loop({
                    id: SoundList.COUNTER_LOOP,
                    volume: 0.25
                })
                this.value = 0
            },
            onComplete: () => {
                this.loopedSound?.stop();
                SoundManager.play({
                    id: SoundList.COUNTER_END,
                    volume: 0.4
                });

                const time = 0.4;
                for(let i = 0; i < 2; i++) {
                    Tweener.addTween(this.counterText.scale, {
                        x: 1.5,
                        y: 1.5,
                        time: time,
                        delay: i * time * 2,
                        transition: 'easeInCube'
                    })

                    Tweener.addTween(this.counterText.scale, {
                        x: 1,
                        y: 1,
                        time: time,
                        delay: (i + 0.5) * time * 2,
                        transition: 'easeOutCube'
                    })
                }
            },
            time: 4
        })

        this.elements.children.forEach((child, index) => {
            Tweener.addTween(child, {
                time: 1,
                alpha: 1
            })

            Tweener.addTween(child.scale, {
                time: 0.3 * (index + 1),
                delay: 0.1 * (index + 1),
                transition: 'easeOutBounce',
                x: 1,
                y: 1
            })});
    }

    private onRemoved(): void {
        if (this.loopedSound)
            this.loopedSound.stop();

        Tweener.removeTweens(this);
        Tweener.removeTweens(this.counterText);
        Tweener.removeTweens(this.counterText.scale);
    }
}
