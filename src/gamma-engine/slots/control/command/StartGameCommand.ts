import ControlCommand from '../../../core/control/command/ControlCommand';
import { SlotMachineState } from '../../model/SlotMachineState';
import SlotMachine from '../../model/SlotMachine';
import { container } from 'tsyringe';

export default class StartGameCommand extends ControlCommand {

    public execute(): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        sm.currentState = SlotMachineState.IDLE;
    }
}
