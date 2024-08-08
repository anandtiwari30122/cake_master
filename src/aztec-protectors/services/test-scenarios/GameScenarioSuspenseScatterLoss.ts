import GameScenario from './GameScenario';
import { v4 as uuidv4 } from 'uuid';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import { container } from 'tsyringe';
import { ReelSetDescription } from '../../../gamma-engine/slots/model/SlotMachineDescription';
import { randomArrayElement, removeArrayElement } from '../../../gamma-engine/core/utils/Utils';

export default class GameScenarioSuspenseScatterLoss extends GameScenario {
    constructor(sm: SlotMachine) {
        super(sm);
        this.results.push({
            id: uuidv4(),
            totalBet: sm.currentBetValue * sm.numLines,
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
            complete: true
        })
    }

    private getResult(): number[][] {
        return [
            [302, 105, 201],
            [103, 202, 101],
            [103, 302, 101],
            [301, 202, 203],
            [102, 203, 101],
        ];
    }
}
