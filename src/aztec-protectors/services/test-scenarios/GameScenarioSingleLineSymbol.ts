import GameScenario from './GameScenario';
import { v4 as uuidv4 } from 'uuid';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import { ReelSetDescription, RuleDescription } from '../../../gamma-engine/slots/model/SlotMachineDescription';
import { randomArrayElement, removeArrayElement } from '../../../gamma-engine/core/utils/Utils';

export default class GameScenarioSingleLineSymbol extends GameScenario {
    constructor(sm: SlotMachine, symbolId: number, symbolCount: number, lineIndex: number) {
        super(sm);

        const rule: RuleDescription = sm.findRule(symbolId, symbolCount);

        const totalWin: number = rule.reward.line.multiplier * sm.currentBetValue;

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
                    totalWinMultiplier: rule.reward.line.multiplier,
                    result: this.getResult(symbolId, symbolCount, lineIndex),
                    win: {
                        multiWinShown: false,
                        scatterWinShown: false,
                        lines:[
                            this.generateLineWin(lineIndex, rule)
                        ]
                    }
                }
            ],
            complete: true
        })
    }

    private getResult(symbolId: number, count: number, lineIndex: number): number[][] {
        const reelSetDescription: ReelSetDescription = this.sm.description.reels.regular;

        let availableSymbols: number[] = reelSetDescription.reels[0].availableSymbols;
        availableSymbols = removeArrayElement(availableSymbols, symbolId);
        availableSymbols = removeArrayElement(availableSymbols, 302);
        availableSymbols = removeArrayElement(availableSymbols, 303);
        availableSymbols = removeArrayElement(availableSymbols, 301);

        const lineDefinition: number[] = this.sm.description.lines[lineIndex];

        function buildReel(winningSymbolPosition: number, winningSymbolId: number, itemsToPut: number[]): number[] {
            const reel: number[] = [0,0,0];
            reel[winningSymbolPosition] = winningSymbolId;
            reel.forEach((value, index) => {
                if(value == 0) {
                    reel[index] = itemsToPut.pop();
                }
            });

            return reel;
        }

        return [
            buildReel(lineDefinition[0], symbolId, [302, 303]),
            buildReel(lineDefinition[1], symbolId, [randomArrayElement(availableSymbols), randomArrayElement(availableSymbols)]),
            buildReel(lineDefinition[2], symbolId, [randomArrayElement(availableSymbols), randomArrayElement(availableSymbols)]),
            buildReel(lineDefinition[3], count > 3 ? symbolId : randomArrayElement(availableSymbols), [randomArrayElement(availableSymbols), randomArrayElement(availableSymbols)]),
            buildReel(lineDefinition[4], count > 4 ? symbolId : randomArrayElement(availableSymbols), [randomArrayElement(availableSymbols), randomArrayElement(availableSymbols)])
        ];
    }
}
