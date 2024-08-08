export type LineWin = {
    ruleId: number,
    lineIndex?: number,
    pattern: number[][],
    winMultiplier: number,
    winValue: number
}

export type ScatterWin = {
    winValue: number,
    symbolId: number,
    pattern: number[][],
}

export type FreespinWin = {
    symbolId: number,
    pattern: number[][],
    freespins: {
        id: number,
        count: number,
    },
}
export type CombinationWin = {
    symbol: number,
    wayPayout:number,
    way:number[],
    multiplier:number;
    pattern: number[][],

}
export type MultiplierMap ={
    x:number,
    y:number,
    multiplier:number,
}
export type SpinResult = {
    result: number[][],
    winValue: number,
    currentTotalWinValue: number,
    totalWinMultiplier?: number,
    win?: {
        lines?: LineWin[],
        scatters?: ScatterWin,
        freespins?: FreespinWin,
        combinations?: CombinationWin[],
        multiWinShown: boolean,
        scatterWinShown?: boolean,
        freespinWinShown?: boolean,
    }
    freespins?:{
        freespinId: number,
        totalCount: number,
        remainingCount: number,
        roundStarted: boolean,
        roundComplete: boolean,
    }
    bonus?:{
        bonusGameShown: boolean
        bonusGameComplete: boolean
    };
}

export type RoundResult = {
    id: number,
    lineBetValue: number,
    betLines: number,
    totalBet: number,
    totalWinValue: number,
    spinIndex: number,
    nextType?: number,
    spins: SpinResult[],
    complete: boolean
    multiplierMap?: MultiplierMap[],
}

