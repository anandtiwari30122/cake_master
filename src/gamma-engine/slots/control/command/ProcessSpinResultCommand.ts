import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import SlotMachine from '../../model/SlotMachine';
import { SlotMachineState } from '../../model/SlotMachineState';
import { SlotGameEvent } from '../event/SlotGameEvent';
import { RoundResult, SpinResult } from '../../model/RoundResult';
import { container } from 'tsyringe';

export default class ProcessSpinResultCommand extends ControlCommand {

    public execute(): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        const roundResult: RoundResult = sm.roundResult;

        const spinResult: SpinResult = sm.currentSpinResult;

        // show multi win
        if (spinResult.win && !spinResult.win.multiWinShown) {
            sm.currentState = SlotMachineState.SPIN_RESULT_MULTI_WIN;
            return;
        }

        // show scatter wins
        if (spinResult.win && !spinResult.win.scatterWinShown && spinResult.win.scatters) {
            sm.currentState = SlotMachineState.SPIN_RESULT_SCATTER;
            return;
        }

        // cascade to next spin result
        if (sm.description.reels.regular.cascading) {
            if (sm.nextSpinResult) {
                roundResult.spinIndex++;
                sm.currentState = SlotMachineState.SPIN_RESULT_CASCADE;
                return;
            }
        }

        // is bonus game won
        if (spinResult.bonus && !spinResult.bonus.bonusGameShown) {
            sm.currentState = SlotMachineState.SPIN_RESULT_BONUS_GAME;
            return;
        }

        // is bonus game incompleted
        if (spinResult.bonus && !spinResult.bonus.bonusGameComplete) {
            sm.currentState = SlotMachineState.BONUS_GAME;
            return;
        }

        // show free spins scatter wins
        if(spinResult.freespins && spinResult.win?.freespins && !spinResult.win?.freespinWinShown) {
            sm.currentState = SlotMachineState.SPIN_RESULT_FREE_SPINS;
            return;
        }

        if (spinResult.freespins && !spinResult.freespins.roundComplete) {
            // show free spins start
            if (!spinResult.freespins.roundStarted) {
                sm.currentState = SlotMachineState.FREE_SPINS_ROUND_START;
                return;
            }

            // are any freespins remaining
            if (spinResult.freespins.remainingCount) {
                sm.currentState = SlotMachineState.FREE_SPINS;
                return;
            }

            // show freespin end
            if (!spinResult.freespins.roundComplete) {
                sm.currentState = SlotMachineState.FREE_SPINS_ROUND_END;
                return;
            }
        }

        // show big win
        if (sm.bigWinLevel(roundResult) != -1 && !sm.bigWinShown) {
            sm.currentState = SlotMachineState.BIG_WIN;
            return;
        }

        //if round result is already completed
        if(sm.roundResult.complete == true)
            return;

        new ControlEvent(SlotGameEvent.ROUND_COMPLETE).dispatch();
    }
}
