import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { SlotGameEvent } from '../event/SlotGameEvent';
import SlotMachine from '../../model/SlotMachine';
import { container } from 'tsyringe';

export default class ConfirmBigWinCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        sm.bigWinShown = true;

        new ControlEvent(SlotGameEvent.SPIN_RESULT_READY).dispatch();
    }
}
