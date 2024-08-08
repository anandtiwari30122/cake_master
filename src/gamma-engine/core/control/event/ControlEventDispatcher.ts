import EventDispatcher from '../../events/EventDispatcher';

export default class ControlEventDispatcher extends EventDispatcher {

    private static instance: ControlEventDispatcher;

    constructor() {
        super();
        if (ControlEventDispatcher.instance) {
            throw new Error('You cannot instatiate ControlEventDispatcher directly!');
        }
    }

    /*
     * PUBLIC API
     */
    public static getInstance(): ControlEventDispatcher {
        if (!ControlEventDispatcher.instance) {
            ControlEventDispatcher.instance = new ControlEventDispatcher();
        }
        return ControlEventDispatcher.instance;
    }
    // ----
}
