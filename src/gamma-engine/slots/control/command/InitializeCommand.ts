import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import SlotMachine from '../../model/SlotMachine';
import Wallet from '../../model/Wallet';
import { container } from 'tsyringe';
import IGameService from '../../service/IGameService';
import {SlotGameEvent} from '../event/SlotGameEvent';

export default class InitializeCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const gs: IGameService = container.resolve<IGameService>('GameService');
        gs.initialize().then(([wallet, slotMachine]) => {
            container.registerInstance(Wallet, wallet);
            container.registerInstance(SlotMachine, slotMachine);
        });
    }
}
