import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { SlotMachineState } from '../../model/SlotMachineState';
import SlotMachine from '../../model/SlotMachine';
import { SlotGameEvent } from '../event/SlotGameEvent';
import { container } from 'tsyringe';
import Wallet from '../../model/Wallet';

export default class CompleteRoundCommand extends ControlCommand {

    public execute(): void {
        const wallet: Wallet = container.resolve(Wallet);
        const sm: SlotMachine = container.resolve(SlotMachine);

        sm.roundResult.complete = true;
        wallet.balance += sm.roundResult.totalWinValue;

        if(sm.autoplay.enabled && sm.autoplay.canAutoSpin(sm.roundResult, wallet.credits)) {
            if(sm.autoplay.spinsLeft>0)
                sm.autoplay.spinsLeft-=1;

            new ControlEvent(SlotGameEvent.SPIN_START).dispatch();
        } else {
            sm.autoplay.spinsLeft = 0;
            sm.autoplay.enabled = false;
            sm.currentState = SlotMachineState.IDLE;
        }
    }
}
