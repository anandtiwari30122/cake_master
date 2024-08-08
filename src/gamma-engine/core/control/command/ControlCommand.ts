import ControlEvent from '../event/ControlEvent';

export default abstract class ControlCommand {

    // commands logic should be implemented in subclasses
    public abstract execute(event: ControlEvent, ...rest): void;
}
