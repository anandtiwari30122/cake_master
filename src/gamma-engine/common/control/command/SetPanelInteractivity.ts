import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { container } from 'tsyringe';
import UIState from '../../model/UIState';
import {UIPanelEvent} from '../event/UIPanelEvent';

export default class SetPanelInteractivity extends ControlCommand {

    public execute(event: ControlEvent): void {
        console.debug('SetPanelInteractivity.execute');
        const uiState: UIState = container.resolve(UIState);
        switch (event.type){
            case UIPanelEvent.SET_INTERACTIVITY_FALSE:
                uiState.interactivity = false;
                break
            case UIPanelEvent.SET_INTERACTIVITY_TRUE:
                uiState.interactivity = true;
                break
        }
    }
}
