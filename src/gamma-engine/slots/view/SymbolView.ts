import { AnimatedSprite, Container, IDestroyOptions, Point, Sprite, Texture } from 'pixi.js';
import { FrameByFrameIconAnimation, SymbolData } from './SymbolData';
import { SymbolViewEvent } from './event/SymbolViewEvent';
import { SoundData } from '../../core/sound/SoundData';
import SlotMachine from '../model/SlotMachine';
import { container } from 'tsyringe';
import { Tweener } from '../../core/tweener/engineTween';
import {Spine, TrackEntry} from '@esotericsoftware/spine-pixi';


export default class SymbolView extends Container {
    readonly data: SymbolData;

    protected winAnimationLoopCount: number = 0;
    protected winAnimationCompleteLimit: number = 0;

    public originalParentInfo: ParentInformation = {
        parent: null,
        childIndex: -1
    };

    //SPINE ANIMATIONS
    protected spineAnimation: Spine;

    //SPRITE ANIMATIONS
    protected winAnimation: AnimatedSprite;
    protected idleAnimation: AnimatedSprite;
    protected stopAnimation: AnimatedSprite;

    // VISUALS
    public staticIcon: Sprite;

    constructor(data: SymbolData) {
        super();

        this.data = data;

        this.staticIcon = new Sprite(this.data.staticIcon.texture);
        this.staticIcon.anchor.set(0.5, 0.5);
        this.addChild(this.staticIcon);


        if (this.data.spineAnimations) {
            this.spineAnimation = Spine.from(this.data.spineAnimations.skeletonData, this.data.spineAnimations.atlasUrl);
            this.spineAnimation.visible = false;

            this.addChild(this.spineAnimation);

            if (this.data.spineAnimations.skinName)
                this.spineAnimation.skeleton.setSkinByName(this.data.spineAnimations.skinName);

            const winAnimationName: string | string[] = this.data.spineAnimations?.winAnimationName;
            const idleAnimationName: string = this.data.spineAnimations?.idleAnimationName;
            const stopAnimationName: string = this.data.spineAnimations?.stopAnimationName;

            const mixTime: number = this.data.spineAnimations?.mixTime;
            if (mixTime > 0) {
                if ((winAnimationName && typeof winAnimationName != 'undefined') && (idleAnimationName && typeof idleAnimationName != 'undefined') && typeof winAnimationName == 'string')
                    this.spineAnimation.state.data.setMix(winAnimationName, idleAnimationName, mixTime ? mixTime : 0.15);

                if ((stopAnimationName && typeof stopAnimationName != 'undefined') && (winAnimationName && typeof winAnimationName != 'undefined') && typeof winAnimationName == 'string')
                    this.spineAnimation.state.data.setMix(stopAnimationName, winAnimationName, mixTime ? mixTime : 0.15);
            }

            this.spineAnimation.state.addListener({
                complete: (entry: TrackEntry) => {
                    // nasty hack for faulty spine events system implementation
                    setTimeout(() => {
                        if (!entry.animation)
                            return;

                        if (entry.animation.name == stopAnimationName || entry.animation.name == idleAnimationName)
                            this.playAnimation(this.spineAnimation, idleAnimationName);

                        if (typeof winAnimationName === 'string') {
                            this.onWinAnimationLoop();
                            return;
                        }

                        if (entry.animation.name == winAnimationName[winAnimationName.length - 1]) {
                            this.onWinAnimationLoop();
                        }
                    }, 0);
                }
            });
        }

        if (data.spriteAnimations) {
            this.winAnimation = this.initializeAnimatedSpriteFromData(this.data.spriteAnimations.winAnimation);
            this.idleAnimation = this.initializeAnimatedSpriteFromData(this.data.spriteAnimations.idleAnimation);
            this.stopAnimation = this.initializeAnimatedSpriteFromData(this.data.spriteAnimations.stopAnimation);
            [this.winAnimation, this.idleAnimation, this.stopAnimation].forEach((animation: AnimatedSprite) => {
                if (animation === null)
                    return;

                this.addChild(animation);
            });
            [this.winAnimation, this.idleAnimation].forEach((animation: AnimatedSprite) => {
                animation.loop = true;
                animation.onLoop = () => {
                    this.onWinAnimationLoop();
                };
            })
        }
    }

    // PUBLIC API
    public get spinIconTexture(): Texture {
        return this.data.spinIcon.texture;
    }

    public animateWin(times: number = 1): SoundData {
        this.staticIcon.visible = false;
        this.winAnimationCompleteLimit = times;
        this.winAnimationLoopCount = 0;

        this.resetAnimation(this.stopAnimation);

        //Play spine animation
        this.playAnimation(this.spineAnimation, this.data.spineAnimations.winAnimationName, times > 1);
        //Play sprite animation
        this.playAnimation(this.winAnimation);

        return this.data.winSound;
    }

    public async animateY(startOffset: number, endOffset: number, time: number = 0.4, delay: number = 0) {
        return new Promise<void>((resolve) => {
            const defaultPos: number = this.y;

            this.y = defaultPos + startOffset;
            Tweener.addTween(this, {
                y: defaultPos + endOffset,
                time: time,
                transition: 'easeOutBack',
                delay: delay,
                onComplete: () => {
                    resolve();
                }
            });
        });
    }

    public animateLanding(): SoundData {
        //Play spine animation
        this.playAnimation(this.spineAnimation, this.data.spineAnimations.stopAnimationName);
        //Play sprite animation
        this.playAnimation(this.stopAnimation);

        return this.data.landSound;
    }

    public reset(): void {
        Tweener.removeTweens(this);

        this.staticIcon.visible = true;

        this.winAnimationLoopCount = 0;
        this.winAnimationCompleteLimit = 1;

        //Reset spine if exists
        this.resetAnimation(this.spineAnimation);

        //Reset sprite animations if exists
        this.resetAnimation(this.stopAnimation);
        this.resetAnimation(this.winAnimation);
        this.resetAnimation(this.idleAnimation);

        if (this.originalParentInfo.parent) {
            this.swapParentKeepingGlobalPosition(this.originalParentInfo.parent, this.originalParentInfo.childIndex);
            this.originalParentInfo.parent = null;
            this.originalParentInfo.childIndex = -1;
        }
    }

    public destroy(_options?: IDestroyOptions | boolean) {
        this.reset();
        [this.spineAnimation, this.winAnimation, this.idleAnimation, this.stopAnimation].forEach((child) => {
            if (child != null) {
                this.removeChild(child);
                child.destroy();
            }
        });

        super.destroy(_options);
    }

    public reattachTo(newParent: Container): void {
        if (!this.originalParentInfo.parent) {
            this.originalParentInfo.parent = this.parent;
            this.originalParentInfo.childIndex = this.parent.children.indexOf(this) - 1;
        }

        this.swapParentKeepingGlobalPosition(newParent);
    }

    public setStaticIconVisibility(visible: boolean): void {
        this.staticIcon.alpha = visible ? 1 : 0;
    }

    public isWinFrameEnabled(): boolean {
        if (typeof this.data.skipWinFrameAnimation === 'undefined') //Take it as default === enabled
            return true;

        return !this.data.skipWinFrameAnimation;
    }

    // PRIVATE API
    protected onWinAnimationLoop(): void {
        this.winAnimationLoopCount++;
        if (this.winAnimationCompleteLimit == this.winAnimationLoopCount) {
            this.reset();
            this.emit(SymbolViewEvent.WIN_ANIMATION_COMPLETE);
        } else {
            this.emit(SymbolViewEvent.WIN_ANIMATION_LOOP, this.winAnimationLoopCount);
        }
    }

    protected swapParentKeepingGlobalPosition(newParent: Container, id: number = -1): void {
        const newPosition: Point = newParent.toLocal(new Point(0, 0), this);
        this.position.set(newPosition.x, newPosition.y);
        this.removeChild(this.parent);
        id === -1 ? newParent.addChild(this) : newParent.addChildAt(this, id);
    }

    protected playAnimation(animation: Spine | AnimatedSprite, animationName: string | string[] = '', loop: boolean = false): void {
        if (animation === null)
            return;

        if (animation instanceof AnimatedSprite) {
            animation.visible = true;
            animation.loop = loop;
            animation.gotoAndPlay(0);
        } else if (animation instanceof Spine) {
            if (container.resolve(SlotMachine).currentGameSpeedLevel == 1 && Array.isArray(animation)) {
                if (animation.find((animation) => {
                    animation.name === 'destroy'
                })) {
                    const name = animation.find((animation) => {
                        animation.name === 'destroy'
                    })
                    animation.visible = true;
                    animation.state.setAnimation(0, name, loop);
                    return;
                }
            }
            if (typeof animationName === 'string') {
                if (!animation.skeleton.data.animations.find((animation): boolean => animation.name === animationName) && animationName.length <= 0)
                    return;

                animation.visible = true;
                animation.state.setAnimation(0, animationName, loop);
            } else {
                for (let i = 0; i < animationName.length; i++) {
                    if (!animation.skeleton.data.animations.find((animation): boolean => animation.name === animationName[i]) && animationName[i].length <= 0)
                        return;
                }

                animation.visible = true;

                const sm: SlotMachine = container.resolve(SlotMachine);
                if (sm.currentGameSpeedLevel != 0) {
                    animation.state.setAnimation(0, animationName[animationName.length - 1], false);
                    return;
                }

                for (let j = 0; j < animationName.length; j++) {
                    if (j == 0)
                        animation.state.setAnimation(0, animationName[0], false);
                    else
                        animation.state.addAnimation(0, animationName[j], false, animation.skeleton.data.animations.find((animation): boolean => animation.name === animationName[j - 1]).duration);
                }
            }
        }
    }

    protected resetAnimation(animation: Spine | AnimatedSprite): void {
        if (animation === null)
            return;

        if (animation instanceof AnimatedSprite) {
            animation.visible = false;
            animation.gotoAndStop(0);
        } else if (animation instanceof Spine) {
            animation.visible = false;
            animation.state.setEmptyAnimations(0);
            animation.skeleton.setToSetupPose();
        }
    }

    protected initializeAnimatedSpriteFromData(animationData: FrameByFrameIconAnimation): AnimatedSprite {
        if (!animationData)
            return;

        const animation: AnimatedSprite = new AnimatedSprite(animationData.animationTextures);
        animation.animationSpeed = animationData.fps / 60;
        animation.gotoAndStop(0);
        animation.visible = false;
        animation.anchor.set(0.5, 0.5);

        return animation;
    }

}


export type ParentInformation = {
    parent: Container,
    childIndex: number
}
