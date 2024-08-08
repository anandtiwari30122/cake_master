import { Graphics, Sprite } from 'pixi.js';
import LayoutBuilder from '../../core/utils/LayoutBuilder';
import AssetsManager from '../../core/assets/AssetsManager';
import AdjustableLayoutContainer from '../../core/view/AdjustableLayoutContainer';
import { UpdateLayoutDescription } from '../../core/view/UpdateLayoutDescription';
import LayoutElement from '../../core/view/model/LayoutElement';
import {Spine, TrackEntry} from '@esotericsoftware/spine-pixi';

export class LoadingScreen extends AdjustableLayoutContainer {
    // VIEWS
    private loader: Spine;

    constructor (le: LayoutElement, onCompleteCallback: () => void) {
        super(le);
        LayoutBuilder.create(this.layout, this);
        const asset = AssetsManager.spine.get('loader');
        this.loader = Spine.from(asset.skeletonUrl, asset.atlasUrl);
        this.loader.state.setEmptyAnimations(0);

        this.loader.state.addListener({
            complete: (entry: TrackEntry) => {
                switch(entry.animation.name) {
                    case LoadingState.START:
                        this.state = LoadingState.PROGRESS
                        break;

                    case LoadingState.END:
                        if(onCompleteCallback)  onCompleteCallback();
                        break;
                }
            }
        });
    }

    // PRIVATE API
    private set state(animationName: LoadingState) {
        switch(animationName) {
            case LoadingState.START:
                this.loader.state.setAnimation(0, animationName, false)
                break;

            case LoadingState.PROGRESS:
                this.loader.state.setAnimation(0, animationName, true)
                break;

            case LoadingState.END:
                this.loader.state.setAnimation(0, animationName, false)
                break;
        }
    }

    // PUBLIC API
    public start() {
        this.state = LoadingState.START
    }

    public stop() {
        this.state = LoadingState.END
    }

    public updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);
    }
}

enum LoadingState {
    START = 'appear',
    PROGRESS = 'loop',
    END = 'disappear'
}
