import Event from '../../events/Event';
import ControlEventDispatcher from './ControlEventDispatcher';

export default class ControlEvent extends Event {

    private controlEventDispatcher: ControlEventDispatcher = ControlEventDispatcher.getInstance();

    constructor (type: string, data?: unknown) {
        super(type, data);
    }

    public dispatch(): void {
        this.controlEventDispatcher.dispatchEvent(this);
    }
}
