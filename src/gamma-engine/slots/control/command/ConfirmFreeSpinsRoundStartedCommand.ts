import { container } from 'tsyringe';
import SlotMachine from '../../model/SlotMachine';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { SlotGameEvent } from '../event/SlotGameEvent';
import ControlCommand from '../../../core/control/command/ControlCommand';

export default class ConfirmFreeSpinsRoundStartedCommand extends ControlCommand {

    public execute(): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        sm.currentSpinResult.freespins.roundStarted = true;
        new ControlEvent(SlotGameEvent.SPIN_RESULT_READY).dispatch();
    }
}
