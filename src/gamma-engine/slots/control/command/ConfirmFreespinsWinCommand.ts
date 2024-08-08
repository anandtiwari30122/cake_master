import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { SlotGameEvent } from '../event/SlotGameEvent';
import SlotMachine from '../../model/SlotMachine';
import { container } from 'tsyringe';

export default class ConfirmFreespinsWinCommand extends ControlCommand {

    public execute(): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        sm.currentSpinResult.win.freespinWinShown = true;

        new ControlEvent(SlotGameEvent.SPIN_RESULT_READY).dispatch();
    }
}
