import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { SlotMachineState } from '../../model/SlotMachineState';
import SlotMachine from '../../model/SlotMachine';
import { container } from 'tsyringe';

export default class SpinStopCommand extends ControlCommand {

    public execute(): void {
        const sm: SlotMachine = container.resolve(SlotMachine);

        if (!sm.spinTimeLapsed || !sm.reelsStarted || !sm.roundResult || sm.currentState == SlotMachineState.COMMUNICATION_ERROR) {
            return;
        }

        sm.currentState = SlotMachineState.SPIN_END;
    }
}
