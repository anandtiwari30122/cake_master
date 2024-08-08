import IEventDispatcher from './IEventDispatcher';

export default class Event {
    public static COMPLETE: string = 'onComplete';
    public static PROGRESS: string = 'onProgress';

    public type: string;
    public data: unknown;
    public target: IEventDispatcher | null = null;

    constructor(type: string, data?: unknown) {
        this.type = type;
        this.data = data;
    }

    public clone(): Event {
        const e: Event = new Event(this.type, this.data);
        e.target = this.target;
        return e;
    }
}
