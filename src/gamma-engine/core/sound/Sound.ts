import {Howl} from 'howler';

export default class Sound {

    private _volume: number = 1;

    private instanceId: number = null;
    private howl: Howl;

    constructor(howl: Howl) {
        this.howl = howl;
    }

    public play(): void {
        if (this.instanceId !== null) {
            this.instanceId = this.howl.play(this.instanceId);
        } else {
            this.instanceId = this.howl.play();
        }
    }

    public stop(): void {
        this.howl.stop(this.instanceId);
    }

    public pause(): void {
        this.howl.pause(this.instanceId);
    }

    public seek(value: number) {
        this.howl.seek(value, this.instanceId);
    }

    get volume(): number {
        return this._volume;
    }

    set volume(value: number) {
        this._volume = value;
        this.howl.volume(this._volume * this.howl.volume(), this.instanceId);
    }

    set mute(value: boolean) {
        this.howl.mute(value, this.instanceId);
    }

    get duration(): number {
        return this.howl.duration(this.instanceId);
    }

    set loop(value: boolean) {
        this.howl.loop(value, this.instanceId);
    }

    public on(event: string, callback: any): void {
        this.howl.on(event, callback, this.instanceId);
    }

    public off(event: string, callback: any): void {
        this.howl.off(event, callback, this.instanceId);
    }
}
