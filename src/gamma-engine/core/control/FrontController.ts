import ControlEventDispatcher from './event/ControlEventDispatcher';
import ControlCommand from './command/ControlCommand';
import ControlEvent from './event/ControlEvent';
import Logger from '../utils/Logger';
import { removeArrayElement } from '../utils/Utils';

export default class FrontController {

    private controlEventDispatcher: ControlEventDispatcher = ControlEventDispatcher.getInstance();
    private commands: Map<string, Function[]>;

    constructor() {
        this.commands = new Map<string, Function[]>();
    }

    // PUBLIC API
    public addCommand<T extends ControlCommand>(eventType: string, commandType: { new(): T; }, ...rest): void {
        if (!this.commands.has(eventType)) {
            this.commands.set(eventType, []);
        }
        const associated: Function[] = this.commands.get(eventType);
        associated.push(commandType);

        if(!this.controlEventDispatcher.hasEventListener(eventType)) {
            this.controlEventDispatcher.addEventListener(eventType, (e: ControlEvent) => {
                this.onEvent(e, ...rest)
            });
        }
    }

    public removeCommand<T extends ControlCommand>(eventType: string, commandType: { new(): T; }): void {
        if (!this.commands.has(eventType)) {
            this.commands.set(eventType, []);
        }
        const associated: Function[] = this.commands.get(eventType);
        removeArrayElement(associated, commandType);
    }

    // PRIVATE API
    private onEvent(e: ControlEvent, ...rest): void {
        const associated: Function[] = this.commands.get(e.type);
        for (const cType of associated) {
            Logger.debug(cType.name);
            const c: ControlCommand = new (cType as { new(): ControlCommand; })();
            c.execute(e.clone() as ControlEvent, ...rest);
        }
    }
}
