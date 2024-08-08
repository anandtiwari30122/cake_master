export type LoginResponse = {
    Player: {
        Balance: number,
        Rate: number,
        Currency: string,
    },
    Current: {
        Type: number,
        TotalWin: number,
        AccWin: number,
        MaxWin:number,
        Multiplier: number,
        Result: {
            R: string,
            LR: number,
            WR?:{
                T: number,
                AWP: number[][],
                R: string
            }[],
        },
        Round: {
            RoundType: number,
            Bet: number,
            ActualBet: number,
            BetValue: number,
            Line: number,
            LineBet: number,
            Payout: number,
            Items: string[]
        },
        FreeSpin:{
            Current: number,
            Total: number
        }
    },
    Next?: {
        Type: number,
        FreeSpin:{
            Next: number,
            Total: number
        }
        M: number
    },
    GameInfo: {
        Line: number,
        BetValue: number[],
        LineBet: number[],
        BuyFeature:{
            RoundType: number,
            Rate: number,
            Total: number
        }
    }
};

export type TransactResponse = {
    Player: {
        Balance: number
    },
    Current: {
        Type: number,
        TotalWin: number,
        AccWin: number,
        Multiplier:number,
        MaxWin: number,
        Result: {
            R: string,
            LR: number,
            WR?:{
                T: number,
                AWP: number[][],
                R: string
            }[],
        },
        Round: {
            RoundType: number,
            Bet: number,
            ActualBet: number,
            BetValue: number,
            Line: number,
            LineBet: number,
            Payout: number,
            Items: string[]
        },
        FreeSpin:{
            Current: number,
            Total: number
        }
    },
    Next:{
        Type: number,
        FreeSpin:{
            Next: number,
            Total: number
        }
    }
};

export enum LineDirection {
    LTR = 1,
    RTL = 2
}
