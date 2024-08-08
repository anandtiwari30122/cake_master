import GameScenario from './GameScenario';
import { v4 as uuidv4 } from 'uuid';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import { container } from 'tsyringe';
import { ReelSetDescription } from '../../../gamma-engine/slots/model/SlotMachineDescription';
import { randomArrayElement, removeArrayElement } from '../../../gamma-engine/core/utils/Utils';

export default class GameScenarioRandom extends GameScenario {
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
                    result: this.randomResult()
                }
            ],
            complete: false
        })
    }

    private randomResult(): number[][] {
        const reelSetDescription: ReelSetDescription = this.sm.description.reels.regular;
        return [
            [randomArrayElement(reelSetDescription.reels[0].availableSymbols), randomArrayElement(reelSetDescription.reels[0].availableSymbols), randomArrayElement(reelSetDescription.reels[0].availableSymbols),randomArrayElement(reelSetDescription.reels[0].availableSymbols),randomArrayElement(reelSetDescription.reels[0].availableSymbols)],
            [randomArrayElement(reelSetDescription.reels[1].availableSymbols), randomArrayElement(reelSetDescription.reels[1].availableSymbols), randomArrayElement(reelSetDescription.reels[1].availableSymbols),randomArrayElement(reelSetDescription.reels[1].availableSymbols),randomArrayElement(reelSetDescription.reels[1].availableSymbols)],
            [randomArrayElement(reelSetDescription.reels[2].availableSymbols), randomArrayElement(reelSetDescription.reels[2].availableSymbols), randomArrayElement(reelSetDescription.reels[2].availableSymbols), randomArrayElement(reelSetDescription.reels[2].availableSymbols), randomArrayElement(reelSetDescription.reels[2].availableSymbols)],
            [randomArrayElement(reelSetDescription.reels[3].availableSymbols), randomArrayElement(reelSetDescription.reels[3].availableSymbols), randomArrayElement(reelSetDescription.reels[3].availableSymbols),randomArrayElement(reelSetDescription.reels[3].availableSymbols),randomArrayElement(reelSetDescription.reels[3].availableSymbols)],
            [randomArrayElement(reelSetDescription.reels[4].availableSymbols), randomArrayElement(reelSetDescription.reels[4].availableSymbols), randomArrayElement(reelSetDescription.reels[4].availableSymbols),randomArrayElement(reelSetDescription.reels[4].availableSymbols),randomArrayElement(reelSetDescription.reels[4].availableSymbols)],
            [randomArrayElement(reelSetDescription.reels[5].availableSymbols), randomArrayElement(reelSetDescription.reels[5].availableSymbols), randomArrayElement(reelSetDescription.reels[5].availableSymbols),randomArrayElement(reelSetDescription.reels[4].availableSymbols),randomArrayElement(reelSetDescription.reels[5].availableSymbols)],

        ];
    }
}
