import EventEmitter from 'eventemitter3';
import { container, singleton } from 'tsyringe';
import Logger from '../../gamma-engine/core/utils/Logger';
import { randomArrayElement } from '../../gamma-engine/core/utils/Utils';
import { RoundResult } from '../../gamma-engine/slots/model/RoundResult';
import { SettingsType } from '../../gamma-engine/slots/model/SettingsType';
import SlotMachine from '../../gamma-engine/slots/model/SlotMachine';
import { PatternType, SlotMachineDescription, SlotMachineType, WildcardType } from '../../gamma-engine/slots/model/SlotMachineDescription';
import Wallet from '../../gamma-engine/slots/model/Wallet';
import IGameService from '../../gamma-engine/slots/service/IGameService';
import GameScenario from './test-scenarios/GameScenario';
import GameScenarioFreespinScatter from './test-scenarios/GameScenarioFreespinScatter';
import GameScenarioMultiline from './test-scenarios/GameScenarioMultiline';
import GameScenarioNoWin from './test-scenarios/GameScenarioNoWin';
import GameScenarioRandom from './test-scenarios/GameScenarioRandom';
import GameScenarioSingleLineSymbol from './test-scenarios/GameScenarioSingleLineSymbol';
import GameScenarioSuspenseBonusLoss from './test-scenarios/GameScenarioSuspenseBonusLoss';
import GameScenarioSuspenseScatterLoss from './test-scenarios/GameScenarioSuspenseScatterLoss';


@singleton()
export default class DummyGameService extends EventEmitter implements IGameService {

    private currentGameScenarioName: string = 'random';
    private currentGameScenario: GameScenario;

    private lobbyUrl: string;
    private startingBalance: number;

    private balance: number = 0;

    constructor(lobbyUrl: string, startingBalance: number) {
        super();
        this.lobbyUrl = lobbyUrl;
        this.startingBalance = startingBalance;
    }
    saveSettings(): void {
        return null
    }
    get settings(): SettingsType {
        return null
    }

    // PUBLIC API
    public setGameScenario(scenarioName: string): void {
        this.currentGameScenarioName = scenarioName;
        Logger.info(`Scenario set: ${scenarioName}`);
    }

    public async initialize(): Promise<[Wallet, SlotMachine]> {
        const allSymbolIds: number[] = [105, 104, 103, 102, 101, 204, 203, 202, 201, 303, 302, 301];
        const denomination: number = 100;

        const wallet: Wallet = new Wallet(denomination, {
            isoCode: 'EUR',
            precision: 2
        });

        const description: SlotMachineDescription = {
            rtp: 'unknown',
            type: SlotMachineType.LINES,
            betLimits: [1, 2, 5, 10, 25, 50, 100, 250, 500],
            lines: [
                [1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0],
                [2, 2, 2, 2, 2],
                [0, 1, 2, 1, 0],
                [2, 1, 0, 1, 2],
                [0, 1, 0, 1, 0],
                [2, 1, 2, 1, 2],
                [1, 0, 1, 0, 1],
                [1, 2, 1, 2, 1],
                [1, 1, 0, 1, 1],
                [1, 1, 2, 1, 1],
                [0, 1, 1, 1, 0],
                [2, 1, 1, 1, 2],
                [2, 2, 1, 0, 0],
                [0, 0, 1, 2, 2],
                [1, 0, 0, 0, 1],
                [1, 2, 2, 2, 1],
                [2, 1, 0, 0, 0],
                [0, 1, 2, 2, 2],
                [2, 2, 2, 1, 0]
            ],
            totalWinMultipliers: [
                1, 2, 3, 4, 5,
                // 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                // 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                // 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                // 41, 42, 43, 44, 45, 46, 47, 48, 49, 50
            ],
            bigWinMultiplierLevels: [10],
            symbols: allSymbolIds,
            wildcards: [{
                symbolId: 301,
                type: WildcardType.REGULAR,
                symbolsReplaced: [105, 104, 103, 102, 101, 204, 203, 202, 201],
                multiplier: 1
            }],
            reels: {
                regular: {
                    cascading: false,
                    reels: [
                        {
                            numRows: 3,
                            availableSymbols: allSymbolIds,
                        },
                        {
                            numRows: 3,
                            availableSymbols: allSymbolIds,
                        },
                        {
                            numRows: 3,
                            availableSymbols: allSymbolIds,
                        },
                        {
                            numRows: 3,
                            availableSymbols: allSymbolIds,
                        },
                        {
                            numRows: 3,
                            availableSymbols: allSymbolIds,
                        }
                    ]
                },
                freeSpins: [
                    {
                        id: 0,
                        cascading: false,
                        reels: [
                            {
                                numRows: 3,
                                availableSymbols: allSymbolIds,
                            },
                            {
                                numRows: 3,
                                availableSymbols: allSymbolIds,
                            },
                            {
                                numRows: 3,
                                availableSymbols: allSymbolIds,
                            },
                            {
                                numRows: 3,
                                availableSymbols: allSymbolIds,
                            },
                            {
                                numRows: 3,
                                availableSymbols: allSymbolIds,
                            }
                        ]
                    },
                ]
            },
            rules: [
                {
                    id: 0,
                    pattern: {
                        symbolId: 105,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 2
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 105,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 8
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 105,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 30
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 104,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 2
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 104,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 8
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 104,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 30
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 103,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 2
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 103,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 8
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 103,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 30
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 102,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 2
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 102,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 8
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 102,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 30
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 101,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 2
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 101,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 8
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 101,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 30
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 204,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 25
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 204,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 75
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 204,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 300
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 203,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 30
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 203,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 80
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 203,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 400
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 202,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 50
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 202,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 150
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 202,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 600
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 201,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 100
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 201,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 250
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 201,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 1000
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 301,
                        symbolCount: [3],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 150
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 301,
                        symbolCount: [4],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 300
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 301,
                        symbolCount: [5],
                        type: PatternType.LEFTMOST
                    },
                    reward: {
                        line: {
                            multiplier: 1200
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 302,
                        symbolCount: [3],
                        type: PatternType.SCATTER
                    },
                    reward: {
                        freeSpins: {
                            id: 0,
                            amount: 10
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 302,
                        symbolCount: [4],
                        type: PatternType.SCATTER
                    },
                    reward: {
                        freeSpins: {
                            id: 0,
                            amount: 15
                        }
                    }
                },
                {
                    id: 0,
                    pattern: {
                        symbolId: 302,
                        symbolCount: [5],
                        type: PatternType.SCATTER
                    },
                    reward: {
                        freeSpins: {
                            id: 0,
                            amount: 20
                        }
                    }
                },
            ]
        };

        wallet.balance = this.startingBalance;
        const slotMachine: SlotMachine = new SlotMachine(description, {
            gameSpeedLevels: 2
        });

        slotMachine.roundResult = slotMachine.getDummyRoundResult(null);
        return [wallet, slotMachine];
    }

    public async spin(betValue: number, numLines: number): Promise<RoundResult> {
        return new Promise<RoundResult>((resolve) => {
            const sm: SlotMachine = container.resolve(SlotMachine);
            if (!this.currentGameScenario) {
                if (this.currentGameScenarioName == 'random') {
                    this.currentGameScenario = new GameScenarioRandom(sm);
                } if (this.currentGameScenarioName == 'loss') {
                    this.currentGameScenario = new GameScenarioNoWin(sm);
                } else if (/^symbol\|\d+\|\d$/.test(this.currentGameScenarioName)) {
                    const symbolId: number = parseInt(this.currentGameScenarioName.split('|')[1]);
                    const symbolCount: number = parseInt(this.currentGameScenarioName.split('|')[2]);
                    this.currentGameScenario = new GameScenarioSingleLineSymbol(sm, symbolId, symbolCount, 0);
                } else if (/^line\|\d+$/.test(this.currentGameScenarioName)) {
                    const lineIndex: number = parseInt(this.currentGameScenarioName.split('|')[1]) - 1;
                    this.currentGameScenario = new GameScenarioSingleLineSymbol(sm, randomArrayElement([105, 104, 103, 102, 101, 204, 203, 202, 201]), 5, lineIndex);
                } else if (/^freespins\|\d$/.test(this.currentGameScenarioName)) {
                    const scatterSymbolCount: number = parseInt(this.currentGameScenarioName.split('|')[1]);
                    this.currentGameScenario = new GameScenarioFreespinScatter(sm, scatterSymbolCount);
                } else if (this.currentGameScenarioName == 'multiline') {
                    this.currentGameScenario = new GameScenarioMultiline(sm);
                } else if (this.currentGameScenarioName == 'multiline-big') {
                    this.currentGameScenario = new GameScenarioMultiline(sm, true);
                } else if (this.currentGameScenarioName == 'suspense-scatter') {
                    this.currentGameScenario = new GameScenarioSuspenseScatterLoss(sm);
                } else if (this.currentGameScenarioName == 'suspense-bonus') {
                    this.currentGameScenario = new GameScenarioSuspenseBonusLoss(sm);
                } else {
                    Logger.warning(`Scenario ${this.currentGameScenarioName} not implemented!`);
                    // this.emit(GameServiceEvent.ERROR);
                    throw new Error('Something went wrong!');
                }
            }

            const result: RoundResult = this.currentGameScenario.nextResult();

            if (this.currentGameScenario.isRoundComplete()) {
                this.currentGameScenario = null;
            }

            resolve(result);
        });
    }

    public lobby(): void {
        Logger.debug('GameService.lobby');
        if (typeof this.lobbyUrl != 'undefined' && this.lobbyUrl)
            window.open(this.lobbyUrl, '_self');
        else
            history.back();
    }


    public async buyFeature(): Promise<RoundResult> {
        // const sm: SlotMachine = container.resolve(SlotMachine);
        // let data: TransactResponse = null;
        //
        // try {
        //     data = await this.transact(sm.currentBetValue / Wallet.denomination, sm.numLines, 2);
        // } catch (e) {
        //     console.log(e);
        throw new Error('Something went wrong!');
        // }
        //
        // return this.parseTransactDataToRoundResult(data);
    }

    //Round type: 1 - base game, 2 - feature buy
    // private async transact(lineBet: number, numLines: number, roundType: number): Promise<TransactResponse> {
    //     Logger.debug('GameService.transact');
    //     console.log('transact ' + roundType);
    //
    //     const data = {
    //         Type: roundType,
    //         Bet: null,
    //         BetValue: 1,
    //         Line: numLines,
    //         LineBet: 1,
    //         RoundType: 1,
    //         Index: null
    //     }
    //
    //     console.log('SENDING DATA')
    //     console.log(data);
    //
    //     const res: AxiosResponse = await this.ax.post('Game/Transact', {
    //         Type: roundType,
    //         Bet: null,
    //         BetValue: 1,
    //         Line: numLines,
    //         LineBet: 1,
    //         RoundType: 1,
    //         Index: null
    //     });
    //
    //     return res.data;
    // }

    // PRIVATE API
    // private parseTransactDataToRoundResult(data: TransactResponse): RoundResult {
    //     const sm: SlotMachine = container.resolve(SlotMachine);
    //     const roundResult: RoundResult = {
    //         id: uuidv4(),
    //         lineBetValue: data.Current.Round.LineBet * Wallet.denomination,
    //         betLines: data.Current.Round.Line,
    //         totalBet: data.Current.Round.Bet,
    //         totalWinValue: data.Current.Round.Payout,
    //         // totalWinValue: data.Current.TotalWin ? data.Current.TotalWin * 100 : 0,
    //         spinIndex: 0,
    //         nextType: data.Next.Type,
    //         spins: [
    //             {
    //                 result: this.parseReelsOutput(data.Current.Result.R),
    //                 winValue: data.Current.TotalWin,
    //                 totalWinMultiplier: data.Current.M,
    //                 currentTotalWinValue: data.Current.Round.Payout,
    //                 win: data.Current.Result.WR ? {
    //                     multiWinShown: false,
    //                     lines: data.Current.Result.WR[0].T === 1 ? this.parseLineWins(data.Current.Result.WR[0].R) : null,
    //                     scatterWinShown: false,
    //                     scatters: data.Current.Result.WR[0].T === 3 ? this.parseScatterWins(data.Current.Result.WR[0].R, data.Current.Result.R) : null
    //                 } : null,
    //                 freespins: (data.Next.FreeSpin || data.Current.FreeSpin) ? {
    //                     freespinId: data.Current.FreeSpin ? data.Current.FreeSpin.Current : 0,
    //                     totalCount: data.Next.FreeSpin ? data.Next.FreeSpin.Total : data.Current.FreeSpin.Total,
    //                     freespinWinShown: (data.Current.FreeSpin && data.Current.FreeSpin.Current > 0),
    //                     freespinEndShown: false,
    //                 } : null
    //             }
    //         ]
    //     };
    //
    //     console.log(`spin win: ${data.Current.AccWin * Wallet.denomination} total win: ${data.Current.TotalWin * Wallet.denomination} PAYOUT: ${data.Current.Round.Payout * Wallet.denomination}`)
    //     return roundResult;
    // }
    //
    // private parseReelsOutput(data: string): number[][] {
    //     return data.split('|')
    //                .map((value: string): number[] => {
    //                    return value.split(',')
    //                                .map((value: string): number => {
    //                                    return parseInt(value);
    //                                })
    //                });
    // }
    //
    // private parseLineWins(data: string): LineWin[] {
    //     const sm: SlotMachine = container.resolve(SlotMachine);
    //
    //     return data.split('|')
    //                .map((lineWinData: string): LineWin => {
    //                    const lwd: string[] = lineWinData.split(',');
    //                    // CoinPayout,Line,TotalSymbolMatched,Multiplier,Symbol,PayDirection(1-LTR,2-RTL)
    //                    const winValue: number = parseFloat(lwd[0]) * Wallet.denomination;
    //                    const lineIndex: number = parseInt(lwd[1]) - 1;
    //
    //                    const symbolId: number = parseInt(lwd[4]);
    //                    const symbolCount: number = parseInt(lwd[2]);
    //
    //                    // TODO: check if win is premultiplied or not!!
    //                    const multiplier: number = parseInt(lwd[3]);
    //                    const payDirection: LineDirection = parseInt(lwd[5]) == 1 ? LineDirection.LTR : LineDirection.RTL;
    //
    //                    const winningRule: RuleDescription = sm.findRule(symbolId, symbolCount);
    //
    //                    return {
    //                        ruleId: winningRule.id,
    //                        lineIndex: lineIndex,
    //                        pattern: this.buildLinePattern(lineIndex, symbolCount, payDirection),
    //                        winMultiplier: winningRule.reward.line.multiplier,
    //                        winValue: winValue
    //                    }
    //                });
    //
    // }
    //
    // private parseScatterWins(winRoundResult: string, roundResult: string): ScatterWin {
    //     const swd: string[] = winRoundResult.split(',');
    //     // CoinPayout,Line,TotalSymbolMatched,Symbol
    //     const winValue: number = parseFloat(swd[0]) * Wallet.denomination;
    //     const symbolId: number = parseInt(swd[2]);
    //
    //     return {
    //         winValue: winValue,
    //         symbolId: symbolId,
    //         pattern: this.buildScatterPattern(roundResult, symbolId)
    //     }
    // }
    //
    // private buildLinePattern(lineIndex: number, symbolCount: number, payDirection: LineDirection): number[][] {
    //     const desc: SlotMachineDescription = container.resolve(SlotMachine).description;
    //     const linePattern: number[] = desc.lines[lineIndex];
    //     const pattern: number[][] = [];
    //     desc.reels.regular.reels.forEach((rd: ReelDescription) => {
    //         pattern.push(new Array<number>(rd.numRows).fill(0));
    //     });
    //
    //     for (let i = 0; i < symbolCount; i++) {
    //         if (payDirection == LineDirection.LTR) {
    //             pattern[i][linePattern[i]] = 1;
    //         } else {
    //             pattern[pattern.length - 1 - i][linePattern[linePattern.length - 1 - i]] = 1;
    //         }
    //     }
    //
    //     console.log(linePattern);
    //     console.log(pattern);
    //
    //     return pattern;
    // }
    //
    // private buildScatterPattern(data: string, symbolId: number): number[][] {
    //     const pattern: number[][] = [];
    //
    //     data.split('|')
    //         .map((reelData: string): void => {
    //             const lwd: string[] = reelData.split(',');
    //             const reel: number[] = [];
    //
    //             lwd.forEach((symbol: string) => {
    //                 const id: number = parseInt(symbol);
    //                 reel.push(id === symbolId ? 1 : 0);
    //             })
    //
    //             console.log(reel);
    //             pattern.push(reel);
    //         });
    //
    //     console.log('scatter pattern: ' + pattern);
    //
    //     return pattern;
    // }
}
