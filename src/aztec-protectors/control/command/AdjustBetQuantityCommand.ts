import {container} from 'tsyringe';
import ControlCommand from '../../../gamma-engine/core/control/command/ControlCommand';
import ControlEvent from '../../../gamma-engine/core/control/event/ControlEvent';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import {UIEventExtension} from '../event/UIEventExtension';


export default class AdjustBetQuantityCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const sm: SlotMachine = container.resolve(SlotMachine);

        switch (event.type) {
            case UIEventExtension.BET_QUANTITY_UP:
                sm.betQuantity++;
                break;
            case UIEventExtension.BET_QUANTITY_DOWN:
                sm.betQuantity--;
                break;
            case UIEventExtension.BET_QUANTITY_MAX:
                sm.betQuantity = sm.description.betMaxQuantity;
                break;
        }
    }
}
