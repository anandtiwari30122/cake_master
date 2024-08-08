import { Sprite } from 'pixi.js';
import AssetsManager from '../../gamma-engine/core/assets/AssetsManager';

export default class ReelsBackground extends Sprite {

    constructor() {
        super(AssetsManager.textures.get('reel'));


    }

    // PUBLIC API
    public reset() {

    }
}
