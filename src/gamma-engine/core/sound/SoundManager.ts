import SoundChannel from './SoundChannel';
import Sound from './Sound';
import Logger from '../utils/Logger';
import {
    Howl,
    Howler
} from 'howler';
import { SoundData } from './SoundData';

export default class SoundManager {

    private static channels: Map<string, SoundChannel> = new Map<string, SoundChannel>();

    private static _mute: boolean = false;

    public static getChannel(channelName: string): SoundChannel {
        if (!SoundManager.channels.get(channelName)) {
            SoundManager.channels.set(channelName, new SoundChannel(channelName));
        }
        return SoundManager.channels.get(channelName);
    }

    public static addSoundToChannel(soundId: string, sound: Howl, channelName: string = 'default'): void {
        const sc: SoundChannel = SoundManager.getChannel(channelName);
        sc.addSound(soundId, sound);
    }

    public static play(sound: SoundData | string): Sound {
        let soundData: SoundData;
        if(typeof sound == 'string') {
            soundData = {
                id: sound
            }
        } else {
            soundData = sound;
        }
        Logger.debug('Play sound: ' + soundData.id);

        const sc: SoundChannel = SoundManager.getChannel(soundData.channel ?? 'default');
        return sc.play(soundData);
    }

    public static playQueue(soundsIds: Array<string>, volume: number = 1, gap: number = 0, channelName: string = 'default'): void {
        const s: Sound = SoundManager.play({
            id: soundsIds.shift(),
            volume: volume,
            channel: channelName
        });
        const onEnd = function() {
            if (gap > 0) {
                setTimeout(() => {
                    SoundManager.playQueue(soundsIds, volume, gap, channelName);
                }, gap);
            } else {
                SoundManager.playQueue(soundsIds, volume, gap, channelName);
            }
            s.off('end', onEnd);
        }
        if (soundsIds.length) {
            s.on('end', onEnd)
        }
    }

    public static loop(sound: SoundData | string): Sound {
        let soundData: SoundData;
        if(typeof sound == 'string') {
            soundData = {
                id: sound
            }
        } else {
            soundData = sound;
        }
        Logger.debug('Loop sound: ' + soundData.id);

        const sc: SoundChannel = SoundManager.getChannel(soundData.channel ?? 'default');
        return sc.loop(soundData);
    }

    static get mute(): boolean {
        return this._mute;
    }

    static set mute(value: boolean) {
        this._mute = value;
        Logger.debug(`Soun mute > ${this._mute}`);
        Howler.mute(value);
    }
}
