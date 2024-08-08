import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { container } from 'tsyringe';
import UIState from '../../model/UIState';

export default class ClosePanelCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const uiState: UIState = container.resolve(UIState);
        uiState.activePanel = null;
    }
}
