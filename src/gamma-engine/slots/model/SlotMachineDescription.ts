import {FrameByFrameIconAnimation} from '../view/SymbolData';
import {Point} from 'pixi.js';

export enum SlotMachineType {
    LINES = 'lines',
    WAYS = 'ways',
    COMBINATIONS = 'combinations'
}

export enum WildcardType {
    REGULAR = 'regular',
    EXPANDING = 'expanding',
    EXPANDED = 'expaneded'
}

export enum PatternType {
    LEFTMOST = 'leftmost',
    BOTH_WAYS = 'bothWays',
    SCATTER = 'scatter',
}

export type ReelConfiguration = {
    symbolSize: Point,
    winFrameAnimation: FrameByFrameIconAnimation,
    anticipationTime: number,
    fallingCascade: boolean
}

export type ReelDescription = {
    numRows: number,
    availableSymbols?: number[]
}

export type ReelSetDescription = {
    cascading: boolean,
    reels: ReelDescription[]
}

export type FreeSpinsReelSetDescription = ReelSetDescription & {
    id: number
}

export type WildcardDescription = {
    symbolId: number,
    type: WildcardType,
    multiplier: number,
    symbolsReplaced: number[]
}

export type PatternDescription = {
    symbolId: number,
    symbolCount: number[],
    type: PatternType
}

export type LineRewardDescription = {
    multiplier: number
}

export type TotalRewardDescription = LineRewardDescription;

export type FreeSpinsRewardDescription = {
    id: number,
    amount: number
};

export type RewardDescription = {
    line?: LineRewardDescription,
    total?: TotalRewardDescription,
    freeSpins?: FreeSpinsRewardDescription,

    // TODO: to add when bonus games come
    // bonusGame?: BonusGameRewardDescription,
}

export type RuleDescription = {
    id: number,
    pattern: PatternDescription,
    reward: RewardDescription,
    symbolDoubled?:number;
}

export type SlotMachineDescription = {
    rtp: string,
    type: SlotMachineType,
    betLimits: number[],
    betMaxQuantity?:number;
    lines?: number[][],
    totalWinMultipliers?: number[],
    bigWinMultiplierLevels: number[],
    symbols: number[],
    wildcards?: WildcardDescription[],
    reels: {
        regular: ReelSetDescription,
        freeSpins?: FreeSpinsReelSetDescription[]
    },
    rules: RuleDescription[],
    combinations?:number
    // TODO: to add when bonus games come
    // bonusGames: BonusGameConfig
}
