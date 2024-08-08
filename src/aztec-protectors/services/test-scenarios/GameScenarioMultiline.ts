import GameScenario from './GameScenario';
import { v4 as uuidv4 } from 'uuid';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import { ReelSetDescription, RuleDescription } from '../../../gamma-engine/slots/model/SlotMachineDescription';
import { randomArrayElement, removeArrayElement } from '../../../gamma-engine/core/utils/Utils';

export default class GameScenarioMultiline extends GameScenario {
    constructor(sm: SlotMachine, bigWin:boolean = false) {
        super(sm);

        const symbol1: number = bigWin ? 101: 105;
        const symbol2: number = bigWin ? 201 : 104;

        const rule1: RuleDescription = sm.findRule(symbol1, 3);
        const rule2: RuleDescription = sm.findRule(symbol2, 5);

        const totalWinMultiplier: number = rule1.reward.line.multiplier * 2 + rule2.reward.line.multiplier;
        const totalWin: number = totalWinMultiplier * sm.currentBetValue;

        this.results.push({
            id: uuidv4(),
            totalBet: sm.totalBet,
            lineBetValue: sm.currentBetValue,
            betLines: sm.numLines,
            totalWinValue: totalWin,
            spinIndex: 0,
            spins: [
                {
                    winValue: totalWin,
                    currentTotalWinValue: totalWin,
                    totalWinMultiplier: totalWinMultiplier,
                    result: this.getResult(symbol1, symbol2),
                    win: {
                        multiWinShown: false,
                        scatterWinShown: false,
                        lines:[
                            this.generateLineWin(1, rule2),
                            this.generateLineWin(4, rule1),
                            this.generateLineWin(9, rule1),
                        ]
                    }
                }
            ],
            complete: false
        })
    }

    private getResult(symbol1: number, symbol2: number): number[][] {
        const reelSetDescription: ReelSetDescription = this.sm.description.reels.regular;

        let availableSymbols: number[] = reelSetDescription.reels[0].availableSymbols;
        availableSymbols = removeArrayElement(availableSymbols, symbol1);
        availableSymbols = removeArrayElement(availableSymbols, symbol2);
        availableSymbols = removeArrayElement(availableSymbols, 301);

        // lines 1, 4, 9
        return [
            [symbol2, symbol1, symbol1],
            [symbol2, symbol1, randomArrayElement(availableSymbols)],
            [301, randomArrayElement(availableSymbols), randomArrayElement(availableSymbols)],
            [symbol2, randomArrayElement(availableSymbols), randomArrayElement(availableSymbols)],
            [symbol2, randomArrayElement(availableSymbols), randomArrayElement(availableSymbols)],
        ];
    }
}
