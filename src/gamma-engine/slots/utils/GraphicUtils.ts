import { FrameByFrameIconAnimation, IconData, SymbolData } from '../view/SymbolData';
import {
    Assets,
    BlurFilter,
    Bounds,
    Container,
    Filter,
    IRenderer,
    Rectangle,
    RenderTexture,
    Sprite,
    Texture
} from 'pixi.js';
import AssetsManager from '../../core/assets/AssetsManager';
import {Spine} from '@esotericsoftware/spine-pixi';

export default class GraphicUtils {
    public static renderer: IRenderer;

    public static init(renderer: IRenderer) {
        this.renderer = renderer;
    }

    public static processSymbolsData(symbolsData: SymbolData[]): void {
        if (!this.renderer) {
            throw new Error('Please call init function first!');
        }

        symbolsData.forEach((sd: SymbolData) => {
            GraphicUtils.generateIconTexture(sd.staticIcon);
            GraphicUtils.generateIconTexture(sd.spinIcon);

            if (sd.spineAnimations) {
                sd.spineAnimations.skeletonData = AssetsManager.spine.get(sd.spineAnimations.spineAssetName).skeletonUrl;
                sd.spineAnimations.atlasUrl = AssetsManager.spine.get(sd.spineAnimations.spineAssetName).atlasUrl;

            }

            if (sd.spriteAnimations) {
                [sd.spriteAnimations.winAnimation,
                    sd.spriteAnimations.stopAnimation,
                    sd.spriteAnimations.idleAnimation].forEach((animation: FrameByFrameIconAnimation) => {
                    if (animation)
                        animation.animationTextures = AssetsManager.getAnimationTextures(animation.animationPrefix);
                })
            }
        });
    }

    public static generateTextureFromSpine(spineAnimation: Spine, filters: Filter[] = []): Texture {
        // caculate texture size
        const localBounds: Rectangle = spineAnimation.getLocalBounds();
        let symbolWidth: number = 0;
        let symbolHeight: number = 0;
        if (localBounds.x < 0) {
            symbolWidth = Math.round(Math.max(-localBounds.x, localBounds.width / 2)) * 2 + 10;
        } else {
            symbolWidth = Math.round(localBounds.x + localBounds.width) + 10;
        }
        if (localBounds.y < 0) {
            symbolHeight = Math.round(Math.max(-localBounds.y, localBounds.height / 2)) * 2 + 10;
        } else {
            symbolHeight = Math.round(localBounds.y + localBounds.height) + 10;
        }

        // place spine in the container center
        const oldX: number = spineAnimation.position.x;
        const oldY: number = spineAnimation.position.y;
        const oldVisibility: boolean = spineAnimation.visible;
        spineAnimation.visible = true;

        spineAnimation.position.set(symbolWidth / 2, symbolHeight / 2);
        const symbolContainer: Container = new Container();
        symbolContainer.addChild(spineAnimation);

        // apply filters if any
        symbolContainer.filters = filters;

        // create render texture and render
        const renderTexture: RenderTexture = RenderTexture.create({
            width: symbolWidth,
            height: symbolHeight,
        });
        GraphicUtils.renderer.render(symbolContainer, {
            renderTexture: renderTexture
        });

        // cleanup
        spineAnimation.position.set(oldX, oldY);
        spineAnimation.visible = oldVisibility;
        symbolContainer.removeChild(spineAnimation);
        symbolContainer.destroy({
            children: true
        });

        return renderTexture;
    }

    public static generateIconTexture(iconData: IconData): void {
        if (!iconData) {
            return;
        }

        switch (iconData.sourceType) {
            case 'texture':
                iconData.texture = AssetsManager.textures.get(iconData.assetName);

                // apply blur filter
                if (iconData.blurY) {
                    const originalTexture: Texture = iconData.texture;
                    const blurTexture: RenderTexture = RenderTexture.create({
                        width: originalTexture.width,
                        height: originalTexture.height,
                    });

                    const icon: Sprite = new Sprite(originalTexture);
                    const blurFilter: BlurFilter = new BlurFilter();
                    blurFilter.blurY = iconData.blurY;
                    // blurFilter.quality = 10;
                    icon.filters = [blurFilter];

                    GraphicUtils.renderer.render(icon, {
                        renderTexture: blurTexture
                    });

                    iconData.texture = blurTexture;

                    // cleanup
                    icon.destroy({
                        children: true
                    });
                }

                break;

            case 'spine':
                // create actual symbol
                const { atlasUrl: atlas, skeletonUrl: skeleton } = AssetsManager.spine.get(iconData.assetName);
                const spineSymbol: Spine = Spine.from( skeleton, atlas );

                if (iconData.animationName) {
                    spineSymbol.state.setAnimation(0, iconData.animationName, false);
                }

                // set skin for symbol
                if (iconData.skinName) {
                    spineSymbol.skeleton.setSkinByName(iconData.skinName);
                }
                spineSymbol.autoUpdate = false;
                spineSymbol.update(0)

                // apply blur filter
                const filters: Filter[] = []
                if (iconData.blurY) {
                    const blurFilter: BlurFilter = new BlurFilter();
                    blurFilter.blurY = iconData.blurY;
                    blurFilter.quality = 10;
                    filters.push(blurFilter);
                }

                iconData.texture = GraphicUtils.generateTextureFromSpine(spineSymbol, filters);
                break;
        }
    }
}
