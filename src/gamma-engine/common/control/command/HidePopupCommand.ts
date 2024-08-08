import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { container } from 'tsyringe';
import PopupState from '../../model/PopupState';

export default class HidePopupCommand extends ControlCommand {
    public execute(event: ControlEvent): void {
        const popupState: PopupState = container.resolve(PopupState)
        popupState.activePopup = null;
    }
}
