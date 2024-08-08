import Sound from './Sound';
import { Howl } from 'howler';
import EventEmitter from 'eventemitter3';
import { SoundChannelEvent } from './SoundChannelEvent';
import { SoundData } from './SoundData';

export default class SoundChannel extends EventEmitter {

    private _name: string;
    private _volume: number = 1;
    private _mute: boolean = false;

    private sounds: Map<string, Howl> = new Map<string, Howl>();

    constructor(name: string) {
        super();

        this._name = name;
    }

    public addSound(soundId: string, howl: Howl): void {
        this.sounds.set(soundId, howl);
    }

    public getSound(soundId: string): Howl {
        return this.sounds.get(soundId);
    }

    get name(): string {
        return this._name;
    }

    get volume(): number {
        return this._volume;
    }

    set volume(value: number) {
        this.sounds.forEach((h: Howl, key: string) => {
            h.volume(value);
        });
        this._volume = value;
    }

    get mute(): boolean {
        return this._mute;
    }

    set mute(value: boolean) {
        this._mute = value;
        this.sounds.forEach((h: Howl, key: string) => {
            h.mute(value);
        });

        if (this._mute) {
            this.emit(SoundChannelEvent.MUTE);
        } else {
            this.emit(SoundChannelEvent.UNMUTE);
        }
    }

    public play(soundData: SoundData): Sound {
        const h: Howl = this.sounds.get(soundData.id);
        if (!this.sounds.get(soundData.id)) {
            throw new Error(`No sound with id: ${soundData.id} found on channel: ${this._name}`);
        }
        const s: Sound = new Sound(h)
        s.play();
        s.volume = soundData.volume ?? 1;
        s.mute = this.mute;
        return s;
    }

    public loop(soundData: SoundData): Sound {
        const s: Sound = this.play(soundData);
        s.loop = true;
        return s;
    }
}
