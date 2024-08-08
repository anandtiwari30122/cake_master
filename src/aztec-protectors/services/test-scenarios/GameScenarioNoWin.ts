import GameScenario from './GameScenario';
import { v4 as uuidv4 } from 'uuid';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import { arrayShuffle, randomArrayElement } from '../../../gamma-engine/core/utils/Utils';

export default class GameScenarioNoWin extends GameScenario {
    constructor(sm: SlotMachine) {
        super(sm);

        this.results.push({
            id: uuidv4(),
            totalBet: sm.totalBet,
            lineBetValue: sm.currentBetValue,
            betLines: sm.numLines,
            totalWinValue: 0,
            spinIndex: 0,
            spins: [
                {
                    winValue: 0,
                    currentTotalWinValue: 0,
                    totalWinMultiplier: 0,
                    result: this.getResult()
                }
            ],
            complete: false
        })
    }

    private getResult(): number[][] {
        const results: number[][][] = [
            [
                arrayShuffle([201, 103, 302]),
                arrayShuffle([202, 203, 105]),
                arrayShuffle([201, 103, 301]),
                arrayShuffle([102, 303, 104]),
                arrayShuffle([303, 103, 102]),
            ],
            [
                arrayShuffle([201, 103, 301]),
                arrayShuffle([202, 203, 105]),
                arrayShuffle([102, 303, 104]),
                arrayShuffle([201, 103, 302]),
                arrayShuffle([303, 103, 102]),
            ],
            [
                arrayShuffle([102, 303, 104]),
                arrayShuffle([202, 203, 105]),
                arrayShuffle([201, 103, 303]),
                arrayShuffle([201, 103, 301]),
                arrayShuffle([302, 103, 102]),
            ],
        ]

        // lines 1, 4, 9
        return randomArrayElement(results);
    }
}
