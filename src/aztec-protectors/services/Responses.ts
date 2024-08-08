export type LoginResponse = {
    Player: {
        Balance: number,
        Rate: number,
        Currency: string,
        CoinRate: number,
    },
    Current: {
        Type: number,
        TotalWin: number,
        AccWin: number,
        MaxWin:number,
        Multiplier: number,
        MultiplierMap:{[key:string]:number},
        Result: {
            SC:number,
            R: string,
            WR:WRItem[],
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
        MultiplierMap:{[key:string]:number},
        MaxWin: number,
        Result: {
            SC:number,
            R: string,
            WR: WRItem[],
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

export type WRItem = {
    symbol :string,
    way : string[],
    wayPayout:number;
}
export enum LineDirection {
    LTR = 1,
    RTL = 2
}
