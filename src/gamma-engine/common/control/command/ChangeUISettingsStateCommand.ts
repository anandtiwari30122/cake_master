import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { container } from 'tsyringe';
import UIState from '../../model/UIState';
import { UIPanelEvent } from '../event/UIPanelEvent';

export default class ChangeUISettingsStateCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const uiState: UIState = container.resolve(UIState);
        uiState.settingsOpen =  event.type == UIPanelEvent.OPEN_SETTINGS;
    }
}
