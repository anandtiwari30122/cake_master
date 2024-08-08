import {Container, DisplayObject, Point, Text, TextStyle} from 'pixi.js';
import {container} from 'tsyringe';
import AssetsManager from '../../gamma-engine/core/assets/AssetsManager';
import {MultiplierMap} from '../../gamma-engine/slots/model/RoundResult';
import SlotMachine from '../../gamma-engine/slots/model/SlotMachine';
import ReelsView from '../../gamma-engine/slots/view/ReelsView';
import SymbolView from '../../gamma-engine/slots/view/SymbolView';
import {MultiplierEvent} from '../model/MultiplierEvent';
import {IAnimationStrategy} from '../strategies/animation/IAnimationStrategy';
import {
    BounceMultiplierAnimationStartegy,
    InitializeMultiplierAnimationStartegy,
    ScalingMultiplierAnimationStrategy
} from '../strategies/animation/MultiplierAnimationStrategy';

export default class Multiplier extends Container {
    public symbolArr: SymbolView[];

    private style: TextStyle;
    private reels: ReelsView;

    private currentMultipliers: Text[] = [];

    // Default strategies
    private _animationMoveStartegy: IAnimationStrategy<Text> = new ScalingMultiplierAnimationStrategy();
    private _animationInitializeStrategy: IAnimationStrategy<DisplayObject> = new InitializeMultiplierAnimationStartegy();
    private _animationBounceStrategy: IAnimationStrategy<DisplayObject> = new BounceMultiplierAnimationStartegy();

    constructor(reels: ReelsView) {
        super();
        this.reels = reels;
        this.style = new TextStyle({
            fontFamily: AssetsManager.webFonts.get('Grobold').family,
            fill: [
                '#fffa94',
                '#ffd90d',
                '#ffd90d',
                '#ffdb0a',
                '#ffda0a',
                '#ffe212',
                '#ffc502',
                '#ffc401',
                '#ffa900',
                '#ffc200',
                '#ffc200',
            ],
            fontSize: 60,
            lineJoin: 'round',
            dropShadow: true,
            dropShadowColor: '#b29795',
            dropShadowAlpha: 0.5,
            dropShadowDistance: 0,
            dropShadowBlur: 6,

        });
    }

    // Acts on multiple multipliers

    public initializeMultipliersOnSymbols(output: MultiplierMap[], clearMultipliersOnStart: boolean = false) {
        if (!output) {
            this.emit(MultiplierEvent.ON_INITIALIZED_MULTIPLIER_SYMBOLS);
            return;
        }
        if (clearMultipliersOnStart)
            this.currentMultipliers.splice(0, this.currentMultipliers.length);

        const sm: SlotMachine = container.resolve(SlotMachine);
        this.createInitialMultipliers(output);

        //If there are multipliers then show them with animation
        const promises: Promise<void>[] = this.currentMultipliers
            .map(multiplier => this.animateInitializeMultiplier(multiplier, 0.6));
        Promise.all(promises).then(() => this.emit(MultiplierEvent.ON_INITIALIZED_MULTIPLIER_SYMBOLS));
    }

    private createInitialMultipliers(output: MultiplierMap[]) {
        for (let i: number = 0; i < output.length; i++) {
            const reel = this.reels.getReelViews()[output[i].x];
            const multiplierSymbolView: SymbolView = reel.getVisibleSymbols()[output[i].y];

            const multiplier: Text = this.createMultiplierText(output[i].multiplier);
            multiplierSymbolView.addChild(multiplier);
            this.currentMultipliers.push(multiplier);

        }
    }


    private async animateInitializeMultiplier(multiplier: DisplayObject, time: number, delay: number = 0) {
        await this._animationInitializeStrategy.animate(multiplier, time, delay, {scale: new Point(1, 1)});

    }

    public async bounceAnimationMultiplier() {
        const promises = this.currentMultipliers.map((multiplier: DisplayObject) =>
            this._animationBounceStrategy.animate(multiplier, 0.4, 0.6, {scale: new Point(1.4, 1.4)}, 2)
        );
        await Promise.all(promises);
    }

    private createMultiplierText(value: number): Text {
        const multiplier: Text = new Text(`X${value}`, this.style);
        multiplier.name = 'multiplier';
        //autoscaleText(multiplier, 70, 150, 65);
        multiplier.anchor.set(0.5, 0.5);
        multiplier.scale.set(0);
        multiplier.x += 55;
        multiplier.y -= 55;

        return multiplier;
    }
}