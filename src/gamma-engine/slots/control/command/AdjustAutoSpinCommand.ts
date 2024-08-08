import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { SlotMachineState } from '../../model/SlotMachineState';
import { SlotGameEvent } from '../event/SlotGameEvent';
import { container } from 'tsyringe';
import SlotMachine from '../../model/SlotMachine';
import Wallet from '../../model/Wallet';
import { AutoplaySettings } from '../../model/Autoplay';

export default class AdjustAutoSpinCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const wallet: Wallet = container.resolve(Wallet);
        const sm: SlotMachine = container.resolve(SlotMachine);

        const settings: AutoplaySettings = event.data as AutoplaySettings;

        if(!settings) {
            sm.autoplay.enabled = false;
            sm.autoplay.spinsLeft = 0;
        } else {
            sm.autoplay.settings = settings;

            if (sm.currentState == SlotMachineState.IDLE && sm.autoplay.spinsLeft != 0) {
                sm.autoplay.startBalance = wallet.credits;
                sm.autoplay.enabled = true;

                if (sm.autoplay.spinsLeft > 0)
                    sm.autoplay.spinsLeft -= 1;

                new ControlEvent(SlotGameEvent.SPIN_START).dispatch();
            }
        }
    }
}
