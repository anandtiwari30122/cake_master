import {TextureAtlas} from '@esotericsoftware/spine-pixi';

export interface ISpineData {
    skeletonUrl: string,
    atlasUrl: string,
    skeleton?: any,
    atlas?: TextureAtlas
}