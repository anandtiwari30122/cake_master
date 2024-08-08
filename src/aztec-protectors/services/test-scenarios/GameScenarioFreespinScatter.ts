import GameScenario from './GameScenario';
import { v4 as uuidv4 } from 'uuid';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import { container } from 'tsyringe';
import { ReelSetDescription, RuleDescription } from '../../../gamma-engine/slots/model/SlotMachineDescription';
import { randomArrayElement, removeArrayElement } from '../../../gamma-engine/core/utils/Utils';
import { RoundResult, SpinResult } from '../../../gamma-engine/slots/model/RoundResult';
import GameScenarioSingleLineSymbol from './GameScenarioSingleLineSymbol';
import GameScenarioNoWin from './GameScenarioNoWin';

export default class GameScenarioFreespinScatter extends GameScenario {
    constructor(sm: SlotMachine, scatterCount: number) {
        super(sm);

        const scatterSymbolId: number = 302;
        const rule: RuleDescription = sm.findRule(scatterSymbolId, scatterCount);
        const initialResult = this.getInitialResult(scatterCount);
        const freeSpinsCount: number = rule.reward.freeSpins.amount;

        // TODO: generate freespins

        const totalWin: number = 0;

        const round: RoundResult = {
            id: uuidv4(),
            totalBet: sm.totalBet,
            lineBetValue: sm.currentBetValue,
            betLines: sm.numLines,
            totalWinValue: totalWin,
            spinIndex: 0,
            spins: [
                {
                    winValue: 0,
                    currentTotalWinValue: 0,
                    totalWinMultiplier: 0,
                    result: initialResult,
                    freespins: {
                        freespinId: 0,
                        remainingCount: freeSpinsCount,
                        totalCount: freeSpinsCount,
                        roundStarted: false,
                        roundComplete: false,
                    },
                    win: {
                        multiWinShown: false,
                        scatterWinShown: false,
                        lines: [],
                        freespins: {
                            symbolId: scatterSymbolId,
                            freespins: {
                                id: 0,
                                count: freeSpinsCount
                            },
                            pattern: initialResult.map(reel => {
                                return reel.map(symbol => {
                                    if (symbol == scatterSymbolId) {
                                        return 1;
                                    } else {
                                        return 0;
                                    }
                                })
                            })
                        }
                    }
                }
            ],
            complete: false
        };

        let totalWinValue: number = 0;
        for (let i = 0; i < freeSpinsCount; i++) {
            const spinResult: SpinResult = this.generateFreespinResult(i, freeSpinsCount);
            totalWinValue += spinResult.winValue;
            spinResult.currentTotalWinValue = totalWinValue;
            round.spins.push(spinResult);
        }
        round.totalWinValue = totalWinValue;

        for (let i = 0; i < round.spins.length; i++) {
            const roundCopy: RoundResult = {...round};
            roundCopy.spinIndex = i;
            this.results.push(roundCopy);
        }
    }

    private getInitialResult(count: number): number[][] {
        return [
            [302, 105, 201],
            [103, 302, 101],
            [103, 302, 101],
            [301, 202, count > 3 ? 302 : 203],
            [102, count > 4 ? 302 : 203, 101],
        ];
    }

    private generateFreespinResult(freeSpinIndex: number, freeSpinsCount: number): SpinResult {
        let gameScenario: GameScenario;
        if (Math.random() < 0.5) {
            gameScenario = new GameScenarioSingleLineSymbol(
                this.sm,
                randomArrayElement([105, 104, 103, 102, 101, 204, 203, 202, 201]),
                randomArrayElement([3, 4, 5]),
                randomArrayElement([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19])
            );
        } else {
            gameScenario = new GameScenarioNoWin(this.sm);
        }

        const freespinGameResult: RoundResult = gameScenario.nextResult();
        const spinResult: SpinResult = freespinGameResult.spins[0];
        spinResult.freespins = {
            freespinId: 0,
            totalCount: freeSpinsCount,
            remainingCount: freeSpinsCount - freeSpinIndex - 1,
            roundStarted: true,
            roundComplete: false,
        }
        return spinResult;
    }
}
