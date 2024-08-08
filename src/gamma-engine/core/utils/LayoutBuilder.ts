import LayoutElementImage from '../view/model/LayoutElementImage';
import AssetsManager from '../assets/AssetsManager';
import LayoutElementTextField from '../view/model/LayoutElementTextField';
import Logger from './Logger';
import LayoutElement from '../view/model/LayoutElement';
import LayoutElementQuad from '../view/model/LayoutElementQuad';
import LayoutElementAnimation from '../view/model/LayoutElementAnimation';
import { AnimatedSprite, BitmapText, Container, DisplayObject, Graphics, NineSlicePlane, Polygon, Rectangle, Sprite, Text, TextStyle, Texture, TilingSprite } from 'pixi.js';
import IEffect from '../view/effect/IEffect';

export default class LayoutBuilder {

    public static create(layout: LayoutElement, container: Container, customClassResolver: (le: LayoutElement) => unknown = null): void {
        // check if layout element supports layouts and if it does build ALL elements
        // based on the uniqueness of their names
        let children: Map<string, LayoutElement>;
        if(layout.layouts.size) {
            children = new Map<string, LayoutElement>;
            layout.layouts.forEach((le: LayoutElement) => {
                le.children.forEach((le: LayoutElement, leName: string) => {
                    if(!children.has(leName)) {
                        children.set(leName, le);
                    }
                });
            });
        } else {
            children = layout.children;
        }

        children.forEach((le: LayoutElement, key: string) => {
            const instance: any = LayoutBuilder.buildLayoutElement(le, customClassResolver);

            if (instance !== undefined && instance !== null) {
                LayoutBuilder.matchPositionAndRotation(le, instance);

                container[le.name] = instance;
                instance.name = le.name;
                container.addChild(instance);

                if (le.mask != null) {
                    container[le.mask.name] = LayoutBuilder.buildLayoutElement(le.mask);
                    LayoutBuilder.matchPositionAndRotation(le.mask, container[le.mask.name]);
                    container.addChild(container[le.mask.name]);
                    instance.mask = container[le.mask.name];
                }

                if(le.hitArea) {
                    instance.hitArea = new Polygon(le.hitArea);
                }

                le.effects.forEach((effect:IEffect) => {
                    effect.apply(instance);
                });
            }
        });

        if (layout.pivotX) {
            container.pivot.x = layout.pivotX;
        }
        if (layout.pivotY) {
            container.pivot.y = layout.pivotY;
        }
    }

    public static buildLayoutElement(le: LayoutElement, customClassResolver: (le: LayoutElement) => any = null): any {
        let instance: any = undefined;

        if (!le.render) {
            return instance;
        }

        if (le instanceof LayoutElementQuad) {
            if (!le.customClass) {
                instance = new Graphics();
                instance.lineStyle(0);
                instance.beginFill(le.color, le.alpha);
                instance.drawRect(0, 0, le.width, le.height);
                instance.endFill();
            } else if (customClassResolver) {
                instance = customClassResolver(le);
            }

            if(instance) {
                if (le.pivotX) {
                    instance.pivot.x = le.pivotX;
                }
                if (le.pivotY) {
                    instance.pivot.y = le.pivotY;
                }
            }
        } else if (le instanceof LayoutElementImage) {
            let texture: Texture = null;
            if (!le.customClass) {
                texture = AssetsManager.textures.get((le as LayoutElementImage).texture);
                if (texture) {
                    if (le.scale9Grid) {
                        instance = new NineSlicePlane(texture, le.scale9Grid.x, le.scale9Grid.y, texture.width - (le.scale9Grid.x + le.scale9Grid.width), texture.height - (le.scale9Grid.y + le.scale9Grid.height));
                    } else if (le.tileGrid) {
                        instance = new TilingSprite(texture, le.tileGrid.width, le.tileGrid.height);
                    } else {
                        instance = new Sprite(texture);
                    }
                } else {
                    Logger.warning('No texture with name: ' + (le as LayoutElementImage).texture);
                }
            } else if (customClassResolver) {
                instance = customClassResolver(le);
            }

            if (instance) {
                if (le.width) {
                    instance.width = le.width;
                }
                if (le.height) {
                    instance.height = le.height;
                }
                if (le.scaleX) {
                    if (texture && instance instanceof NineSlicePlane) {
                        instance.width = le.scaleX * texture.width;
                    } else {
                        instance.scale.x = le.scaleX;
                    }
                }
                if (le.scaleY) {
                    if (texture && instance instanceof NineSlicePlane) {
                        instance.height = le.scaleY * texture.height;
                    } else {
                        instance.scale.y = le.scaleY;
                    }
                }
                if (le.pivotX) {
                    if (texture && instance instanceof NineSlicePlane) {
                        instance.pivot.x = instance.width * le.pivotX / texture.width;
                    } else {
                        instance.pivot.x = le.pivotX;
                    }
                }
                if (le.pivotY) {
                    if (texture && instance instanceof NineSlicePlane) {
                        instance.pivot.y = instance.height * le.pivotY / texture.height;
                    } else {
                        instance.pivot.y = le.pivotY;
                    }
                }

                instance.alpha = le.alpha;
            }
        } else if (le instanceof LayoutElementAnimation) {

            if (le.customClass == 'Video') {
                // const video: HTMLVideoElement = AssetsManager.videos.get(le.texturePrefix);
                // if (video) {
                //     instance = new VideoSprite(video, le.fps, le.loop);
                // } else {
                //     Logger.warning('No video with name: ' + le.texturePrefix);
                // }
                Logger.warning('No video support at this time, please consider reinstating the VideoSprite class.');
            } else if (!le.customClass) {
                const textures: Array<Texture> = AssetsManager.getAnimationTextures(le.texturePrefix);

                if (textures) {
                    instance = new AnimatedSprite(textures);
                    instance.animationSpeed = le.fps / 60;
                    instance.loop = le.loop;
                } else {
                    Logger.warning('No textures with prefix: ' + le.texturePrefix);
                }
            } else if (customClassResolver) {
                instance = customClassResolver(le);
            }

            if (instance) {
                if (le.width) {
                    instance.width = le.width;
                }
                if (le.height) {
                    instance.height = le.height;
                }
                if (le.scaleX) {
                    instance.scale.x = le.scaleX;
                }
                if (le.scaleY) {
                    instance.scale.y = le.scaleY;
                }
                if (le.pivotX) {
                    instance.pivot.x = le.pivotX;
                }
                if (le.pivotY) {
                    instance.pivot.y = le.pivotY;
                }
            }
        } else if (le instanceof LayoutElementTextField) {
            const format = (le as LayoutElementTextField).textFormat;

            if (AssetsManager.bitmapFonts.get(format.font)) {
                instance = new BitmapText((le as LayoutElementTextField).text, {
                    fontName: format.font,
                    fontSize: format.size,
                    tint: format.color
                });
            } else {
                let fontFamily: string = format.font;
                if (AssetsManager.webFonts.has(format.font)) {
                    fontFamily = AssetsManager.webFonts.get(format.font).family;
                }

                const textStyle: TextStyle = new TextStyle({
                    fontFamily: fontFamily,
                    fontSize: format.size,
                    fill: format.color,
                    fontWeight: format.bold == undefined ? 'normal' : 'bold'
                });

                instance = new Text((le as LayoutElementTextField).text, textStyle);
            }
            if (le.pivotX) {
                instance.anchor.x = le.pivotX / le.width;
            }
            if (le.pivotY) {
                instance.anchor.y = le.pivotY / le.height;
            }
        } else if (le instanceof LayoutElement) {
            if (!le.customClass) {
                instance = new Container();
                LayoutBuilder.create(le, instance, customClassResolver);
            } else if (customClassResolver) {
                instance = customClassResolver(le);
            }

            if (instance) {
                if (le.width) {
                    instance.width = le.width;
                }
                if (le.height) {
                    instance.height = le.height;
                }
                if (le.scaleX) {
                    instance.scale.x = le.scaleX;
                }
                if (le.scaleY) {
                    instance.scale.y = le.scaleY;
                }
                if (le.pivotX) {
                    instance.pivot.x = le.pivotX;
                }
                if (le.pivotY) {
                    instance.pivot.y = le.pivotY;
                }
            }
        }

        if (!instance && le.customClass) {
            Logger.warning('Unknown layout element custom class: ' + le.customClass);
        }

        return instance;
    }

    public static matchPositionAndRotation(le: LayoutElement, dObj: DisplayObject): void {
        dObj.x = le.x;
        dObj.y = le.y;
        dObj.rotation = le.rotation ? le.rotation : 0;
    }

    public static centerFitInRectangle(sprite: Sprite, rect: Rectangle, padding: number = 0): void {

        const rectX: number = rect.x + padding;
        const rectY: number = rect.y + padding;
        const rectW: number = rect.width - 2 * padding;
        const rectH: number = rect.height - 2 * padding;

        if (sprite.width < rectW) {
            sprite.width = rectW;
            sprite.scale.y = sprite.scale.x;
        }

        if (sprite.height > rectH) {
            sprite.height = rectH;
            sprite.scale.x = sprite.scale.y;
        }

        sprite.x = rectX + (rectW - sprite.width) / 2;
        sprite.y = rectY + (rectH - sprite.height) / 2;
    }
}
