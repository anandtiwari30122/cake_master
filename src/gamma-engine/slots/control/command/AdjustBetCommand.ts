import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import {UIEvent} from '../event/UIEvent';
import SlotMachine from '../../model/SlotMachine';
import {container} from 'tsyringe';
import {SlotMachineState} from '../../model/SlotMachineState';

export default class AdjustBetCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        const betLimits: number[] = sm.description.betLimits;
        if (event.type == UIEvent.BET_UP) {
            if (betLimits.indexOf(sm.currentBetValue) < betLimits.length - 1) {
                sm.currentBetValue = betLimits[betLimits.indexOf(sm.currentBetValue) + 1];
            }
        } else if (event.type == UIEvent.BET_DOWN) {
            if (betLimits.indexOf(sm.currentBetValue) != 0) {
                sm.currentBetValue = betLimits[betLimits.indexOf(sm.currentBetValue) - 1];
            }
        }
        else if (event.type == UIEvent.BET_SELECT && sm.currentState == SlotMachineState.IDLE) {
            const data: number = event?.data as number;
            const id: number = betLimits.indexOf(data);
            if (betLimits[id] != null) {
                sm.currentBetValue = betLimits[id];
            }
        }
    }
}
