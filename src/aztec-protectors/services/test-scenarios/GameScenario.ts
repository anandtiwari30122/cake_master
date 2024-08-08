import { LineWin, RoundResult } from '../../../gamma-engine/slots/model/RoundResult';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import { RuleDescription } from '../../../gamma-engine/slots/model/SlotMachineDescription';

export default class GameScenario {
    public results: RoundResult[] = [];
    public currentResultIndex: number = 0;

    constructor(public sm:SlotMachine){}

    public nextResult(): RoundResult {
        const currentResult: RoundResult = this.results[this.currentResultIndex];
        this.currentResultIndex = (this.currentResultIndex + 1) % this.results.length;
        return currentResult;
    }

    public reset(): void {
        this.currentResultIndex = 0;
    }

    public isRoundComplete():boolean {
        if(this.currentResultIndex == 0) {
            return true;
        }
    }

    protected generateLineWin(lineIndex: number, rule: RuleDescription): LineWin {
        const lineDefinition: number[] = this.sm.description.lines[lineIndex];
        return {
            ruleId: 0,
            lineIndex: 0,
            winMultiplier: rule.reward.line.multiplier,
            winValue: rule.reward.line.multiplier * this.sm.currentBetValue,
            pattern: lineDefinition.map(((symbolPosition, index) => {
                const reelPattern: number[] = [0,0,0];

                if(rule.pattern.symbolCount.includes(index)) {
                    reelPattern[symbolPosition] = 1;
                }
                return reelPattern;
            }))
        }
    }
}
