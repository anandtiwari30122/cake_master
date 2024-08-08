import {container} from 'tsyringe';
import ControlCommand from '../../../core/control/command/ControlCommand';
import SlotMachine from '../../model/SlotMachine';
import ControlEvent from '../../../core/control/event/ControlEvent';
import {SlotGameEvent} from '../event/SlotGameEvent';
import {SlotMachineState} from '../../model/SlotMachineState';

export default class InstantSpinStopCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const sm: SlotMachine = container.resolve(SlotMachine);

        sm.stopRequested = true;
        sm.spinTimeLapsed = true;

        if(sm.currentState !== SlotMachineState.SPINNING)
            return;

        new ControlEvent(SlotGameEvent.SPIN_STOP).dispatch();
    }
}
