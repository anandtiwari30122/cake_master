import { Texture } from 'pixi.js';
import { SoundData } from '../../core/sound/SoundData';
import SymbolView from './SymbolView';
import {SkeletonData} from '@esotericsoftware/spine-pixi';

export type SymbolData = {
    id: number;

    specialViewClass?: typeof SymbolView,

    staticIcon: IconData;
    spinIcon?: IconData;

    spineAnimations?: SpineSymbolAnimations;
    spriteAnimations?: SpriteSymbolAnimations;

    winSound?: SoundData;
    landSound?: SoundData;

    skipWinFrameAnimation?: boolean;
}

export type IconData = {
    sourceType: 'texture' | 'spine',
    assetName: string,
    animationName?: string,
    skinName?: string,
    blurY?: number,
    texture?: Texture
}

export type FrameByFrameIconAnimation = {
    animationPrefix: string,
    animationTextures?: Texture[],
    fps?: number
}

export type SpineIconAnimation = {
    spineAssetName: string,
    animationName: string
    skeletonData?: SkeletonData,
}

export type SpineSymbolAnimations = {
    spineAssetName: string,
    skeletonData?: string,
    atlasUrl?:string;
    skinName?: string,
    winAnimationName: string[] | string;
    stopAnimationName?: string;
    idleAnimationName?: string;
    mixTime?: number;
}

export type SpriteSymbolAnimations = {
    winAnimation: FrameByFrameIconAnimation;
    stopAnimation?: FrameByFrameIconAnimation;
    idleAnimation?: FrameByFrameIconAnimation;
}
