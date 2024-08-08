import Logger from '../utils/Logger';
import ControlEvent from '../control/event/ControlEvent';

export enum WebSocketState {
    CLOSED = 0,
    CONNECTING = 1,
    OPEN = 2
}
export default class WebSocketService {

    public static EVENT_CONNECTION_ESTABLISHED: string = 'onConnectionEstablished';
    public static EVENT_CONNECTION_LOST: string = 'onConnectionLost';
    public static EVENT_MESSAGE: string = 'onConnectionMessage';

    private static DEFAULT_AUTO_RECONNECT_DELAY: number = 5000; // 5s

    private _currentState: WebSocketState = WebSocketState.CLOSED;

    public serviceUrl: string;
    public ws: WebSocket;

    public heartbeatInterval: ReturnType<typeof setInterval>;

    public autoReconect: boolean = false;
    public autoReconnectDelay: number = WebSocketService.DEFAULT_AUTO_RECONNECT_DELAY;

    constructor(serviceUrl: string, autoReconect: boolean = false) {
        this.serviceUrl = serviceUrl;
        this.autoReconect = autoReconect;
    }

    public connect(): void {
        if (this.ws) {
            this.ws.close();
        }

        Logger.debug('Connecting to: ' + this.serviceUrl);

        this._currentState = WebSocketState.CONNECTING;

        this.ws = new WebSocket(this.serviceUrl);
        this.ws.onopen = (event) => {
            this.onConnectionEstablished();
        };

        this.ws.onerror = () => {
            this.onConnectionError();
        };

        this.ws.onmessage = (event) => {
            this.onMessage(event.data);
        };

        this.ws.onclose = (event) => {
            this.onConnectionClosed(event);
        };
    }

    get currentState(): WebSocketState {
        return this._currentState;
    }

    public send(message: string): void {
        if (this._currentState != WebSocketState.OPEN) {
            throw new Error('Websocket connection is not open!');
        }

        Logger.debug('Sending message: ' + message);

        this.ws.send(message);
    }

    protected onConnectionEstablished(): void {
        Logger.debug('WebSocket connection established');

        this.heartbeatInterval = setInterval(() => {this.ws.send('ping'); }, 3000);
        this._currentState = WebSocketState.OPEN;

        new ControlEvent(WebSocketService.EVENT_CONNECTION_ESTABLISHED).dispatch();
    }

    protected onConnectionError(): void {
        Logger.error('WebSocket connection error');
    }

    protected onConnectionClosed(event): void {
        Logger.error('WebSocket connection lost');

        clearInterval(this.heartbeatInterval);
        this._currentState = WebSocketState.CONNECTING;

        new ControlEvent(WebSocketService.EVENT_CONNECTION_LOST).dispatch();

        if (this.autoReconect) {
            setTimeout(() => {this.connect()}, this.autoReconnectDelay);
        }
    }

    protected onMessage(message): void {
        // Logger.debug("WebSocket message received: " + message);

        new ControlEvent(WebSocketService.EVENT_MESSAGE, message).dispatch();
    }
}
