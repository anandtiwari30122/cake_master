import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { container } from 'tsyringe';
import UIState, { UIPanelType } from '../../model/UIState';

export default class OpenPanelCommand extends ControlCommand {

    public execute(event: ControlEvent): void {

        const uiState: UIState = container.resolve(UIState);
        const panelData: UIPanelType = event.data as UIPanelType;
        uiState.activePanel = panelData;
    }
}
