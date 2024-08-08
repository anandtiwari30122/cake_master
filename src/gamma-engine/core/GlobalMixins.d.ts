// This is a workaround to make custom events from DisplayObject instances working
// See here: https://github.com/pixijs/pixijs/issues/8957
declare namespace GlobalMixins {
    interface DisplayObjectEvents extends FederatedEventEmitterTypes {
        [x: ({} & string) | ({} & symbol)]: any;
    }
}
