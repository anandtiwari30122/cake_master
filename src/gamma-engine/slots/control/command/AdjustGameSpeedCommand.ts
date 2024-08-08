import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { UIEvent } from '../event/UIEvent';
import SlotMachine from '../../model/SlotMachine';
import { container } from 'tsyringe';

export default class AdjustGameSpeedCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        if (event.type == UIEvent.GAME_SPEED_LEVEL_UP) {
            sm.currentGameSpeedLevel = Math.min(sm.currentGameSpeedLevel + 1, sm.options.gameSpeedLevels - 1);
        } else if (event.type == UIEvent.GAME_SPEED_LEVEL_DOWN) {
            sm.currentGameSpeedLevel = Math.max(0, sm.currentGameSpeedLevel - 1);
        }
    }
}
