import Event from './Event';

export default interface IEventDispatcher {

    addEventListener(type: string, listener: Function): void;

    removeEventListener(type: string, listener: Function): void;

    hasEventListener(type: string): boolean;

    dispatchEvent(event: Event): void;
}
