import IEventDispatcher from './IEventDispatcher';
import Event from './Event';

export default class EventDispatcher implements IEventDispatcher {

    protected listeners: Map<string, Array<any>>;

    constructor() {
        this.listeners = new Map<string, Array<FunctionContext>>();
    }

    /*
    PUBLIC API
     */
    public addEventListener(type: string, listener: Function, context: any = null): void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Array<FunctionContext>());
        }

        const typeListeners: Array<FunctionContext> = this.listeners.get(type);
        const fc: FunctionContext = new FunctionContext(listener, context);
        if (this.arrayIndexOf(typeListeners, fc) == -1) {
            typeListeners.push(fc);
        }
    }

    public removeEventListener(type: string, listener: Function, context: any = null): void {
        if (this.listeners.has(type)) {
            const typeListeners: Array<FunctionContext> = this.listeners.get(type);
            const fc: FunctionContext = new FunctionContext(listener, context);

            if (this.arrayIndexOf(typeListeners, fc) != -1) {
                typeListeners.splice(this.arrayIndexOf(typeListeners, fc), 1);
            }

            if (!typeListeners.length) {
                this.listeners.delete(type);
            }
        }
    }

    public hasEventListener(type: string): boolean {
        return this.listeners.has(type);
    }

    public dispatchEvent(event: Event): void {
        if (this.listeners.has(event.type)) {
            const eventListeners: Array<FunctionContext> = this.listeners.get(event.type);
            for (const fc of eventListeners) {
                fc.f.apply(fc.c, [event]);
            }
        }
    }

    private arrayIndexOf(arr: Array<FunctionContext>, fc: FunctionContext): number {
        for (let i: number = 0; i < arr.length; i++) {
            const el: FunctionContext = arr[i];
            if (el.c == fc.c && el.f == fc.f) {
                return i;
            }
        }
        return -1;
    }
}

class FunctionContext {
    public f: Function;
    public c: any;

    constructor(f: Function, c: any) {
        this.f = f;
        this.c = c;
    }
}
