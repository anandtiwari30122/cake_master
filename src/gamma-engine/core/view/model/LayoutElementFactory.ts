import LayoutElement from './LayoutElement';
import LayoutElementImage from './LayoutElementImage';
import LayoutElementTextField from './LayoutElementTextField';
import Logger from '../../utils/Logger';
import AssetsManager from '../../assets/AssetsManager';
import LayoutElementQuad from './LayoutElementQuad';
import LayoutElementAnimation from './LayoutElementAnimation';
import { Rectangle } from 'pixi.js';
import EffectFactory, { IEffectDescription } from '../effect/EffectFactory';
import IEffect from '../effect/IEffect';
import { LayoutDescription, LayoutElementType } from './LayoutDescription';
import { ScreenOrientation } from '../ScreenOrientation';
import Translation from '../../translations/Translation';

export default class LayoutElementFactory {

    static create(descriptionObject: LayoutDescription): LayoutElement {

        let le: LayoutElement;

        switch (descriptionObject.cls) {
            case LayoutElementType.IMAGE:
                le = new LayoutElementImage(descriptionObject.params.name, descriptionObject.constructorParams[0].textureName);
                if (descriptionObject.hasOwnProperty('customParams')) {
                    if (descriptionObject.customParams.hasOwnProperty('customComponentClass')) {
                        le.customClass = descriptionObject.customParams.customComponentClass;
                    }
                }

                if (descriptionObject.params.hasOwnProperty('scale9Grid')) {
                    const scale9GridParams: any = descriptionObject.params.scale9Grid.params;
                    if (!scale9GridParams.hasOwnProperty('x')) {
                        scale9GridParams.x = 0;
                    }
                    if (!scale9GridParams.hasOwnProperty('y')) {
                        scale9GridParams.y = 0;
                    }
                    (le as LayoutElementImage).scale9Grid = new Rectangle(parseInt(scale9GridParams.x), parseInt(scale9GridParams.y), parseInt(scale9GridParams.width), parseInt(scale9GridParams.height));
                }

                if (descriptionObject.params.hasOwnProperty('tileGrid')) {
                    const tileGridParams: any = descriptionObject.params.tileGrid.params;
                    if (!tileGridParams.hasOwnProperty('x')) {
                        tileGridParams.x = 0;
                    }
                    if (!tileGridParams.hasOwnProperty('y')) {
                        tileGridParams.y = 0;
                    }
                    (le as LayoutElementImage).tileGrid = new Rectangle(parseInt(tileGridParams.x), parseInt(tileGridParams.y), parseInt(tileGridParams.width), parseInt(tileGridParams.height));
                }

                break;

            case LayoutElementType.TEXT_FIELD:
                let text: string = descriptionObject.params.text;
                if(descriptionObject.hasOwnProperty('tweenData') && descriptionObject.tweenData.hasOwnProperty('translation-key')){
                    text = Translation.t(descriptionObject.tweenData['translation-key'] as string);
                }
                le = new LayoutElementTextField(descriptionObject.params.name, text, descriptionObject.params.format.params);

                if (descriptionObject.hasOwnProperty('customParams')) {
                    if (descriptionObject.customParams.hasOwnProperty('customComponentClass')) {
                        le.customClass = descriptionObject.customParams.customComponentClass;
                    }
                }
                (le as LayoutElementTextField).textFormat.color = (le as LayoutElementTextField).textFormat.color || 0;
                break;

            case LayoutElementType.SPRITE:
                le = new LayoutElement(descriptionObject.params.name);
                le.children = LayoutElementFactory.parseLayoutElementChildren(descriptionObject.children);
                if (descriptionObject.hasOwnProperty('customParams')) {
                    if (descriptionObject.customParams.hasOwnProperty('customComponentClass')) {
                        le.customClass = descriptionObject.customParams.customComponentClass;

                        // tag 'instance' means that the layout should not be redeclared/resaved but initialized as an instance instead
                        if(!descriptionObject.customParams.hasOwnProperty('tag') || (descriptionObject.customParams.hasOwnProperty('tag') && descriptionObject.customParams.tag != 'instance')) {
                            const existingLayout: LayoutElement = AssetsManager.layouts.get(le.customClass);
                            if (existingLayout) {
                                AssetsManager.layouts.delete(le.customClass);
                                AssetsManager.layouts.set(le.customClass + '-' + existingLayout.name, existingLayout);
                                AssetsManager.layouts.set(le.customClass + '-' + le.name, le);
                            } else {
                                AssetsManager.layouts.set(le.customClass, le);
                            }
                        }
                    }
                }
                break;

            case LayoutElementType.QUAD:
                let fillColor: number = 0xFFFFFF;
                if (descriptionObject.params.hasOwnProperty('color')) {
                    fillColor = descriptionObject.params.color;
                }
                le = new LayoutElementQuad(descriptionObject.params.name, fillColor);
                if (descriptionObject.hasOwnProperty('constructorParams')) {
                    for (const param of descriptionObject.constructorParams) {
                        switch (param.name) {
                            case 'width':
                                const scaleX: number = descriptionObject.params.scaleX ? descriptionObject.params.scaleX : 1;
                                const pivotX: number = descriptionObject.params.pivotX ? descriptionObject.params.pivotX : 0;
                                descriptionObject.params.width = Math.round(param.value) * scaleX;
                                descriptionObject.params.pivotX = pivotX * scaleX;
                                descriptionObject.params.scaleX = 1;
                                break;
                            case 'height':
                                const scaleY: number = descriptionObject.params.scaleY ? descriptionObject.params.scaleY : 1;
                                const pivotY: number = descriptionObject.params.pivotY ? descriptionObject.params.pivotY : 0;
                                descriptionObject.params.height = Math.round(param.value) * scaleY;
                                descriptionObject.params.pivotY = pivotY * scaleY;
                                descriptionObject.params.scaleY = 1;
                                break;
                        }
                    }
                }
                if (descriptionObject.hasOwnProperty('customParams')) {
                    if (descriptionObject.customParams.hasOwnProperty('customComponentClass')) {
                        le.customClass = descriptionObject.customParams.customComponentClass;
                    }
                }
                break;

            case LayoutElementType.MOVIE_CLIP:
                const fps: number = descriptionObject.params.fps ? descriptionObject.params.fps : 30;
                let loop: boolean = true;
                if (descriptionObject.params.hasOwnProperty('loop')) {
                    loop = descriptionObject.params.loop;
                }
                le = new LayoutElementAnimation(descriptionObject.params.name, LayoutElementFactory.getConstructorParamValue(descriptionObject, 'textures'), fps, loop);
                if (descriptionObject.hasOwnProperty('customParams')) {
                    if (descriptionObject.customParams.hasOwnProperty('customComponentClass')) {
                        le.customClass = descriptionObject.customParams.customComponentClass;
                    }
                }
                break;

            default:
                throw new Error('Unknown LayoutElement type: ' + descriptionObject.cls);
        }

        le.x = descriptionObject.params.x ? descriptionObject.params.x : 0;
        le.y = descriptionObject.params.y ? descriptionObject.params.y : 0;
        le.width = descriptionObject.params.width ? descriptionObject.params.width : 0;
        le.height = descriptionObject.params.height ? descriptionObject.params.height : 0;
        le.scaleX = descriptionObject.params.scaleX ? descriptionObject.params.scaleX : 1;
        le.scaleY = descriptionObject.params.scaleY ? descriptionObject.params.scaleY : 1;
        le.pivotX = descriptionObject.params.pivotX ? descriptionObject.params.pivotX : 0;
        le.pivotY = descriptionObject.params.pivotY ? descriptionObject.params.pivotY : 0;
        le.rotation = descriptionObject.params.rotation ? descriptionObject.params.rotation : 0;
        le.alpha = descriptionObject.params.alpha ?? 1;

        if (descriptionObject.hasOwnProperty('customParams')) {
            if (descriptionObject.customParams.hasOwnProperty('forEditor')) {
                if (descriptionObject.customParams.forEditor == true) {
                    le.render = false;
                }
            }
        }

        if (descriptionObject.hasOwnProperty('tweenData')) {
            if ('hitArea' in descriptionObject.tweenData && descriptionObject.tweenData.hitArea instanceof Array) {
                le.hitArea = descriptionObject.tweenData.hitArea;
            }
            if (descriptionObject.tweenData.hasOwnProperty('effects') && descriptionObject.tweenData.effects instanceof Array) {
                descriptionObject.tweenData.effects.map((effectData: unknown) => {
                    const effect: IEffect = EffectFactory.create(effectData as IEffectDescription);
                    if(effect) {
                        le.effects.push(effect);
                    }
                });
            }
        }

        if (descriptionObject.params.hasOwnProperty('mask')) {
            le.mask = LayoutElementFactory.create(descriptionObject.params.mask);
            // in Starling mask position is relative to masked object
            le.mask.x += le.x;
            le.mask.y += le.y;
        }

        const layouts: ScreenOrientation[] = descriptionObject?.tweenData?.layouts;
        if(layouts) {
            for (const orientation of layouts) {
                if(!le.children.has(orientation)) {
                    Logger.warning(`Cannot find layout element for defined screen orientation "${orientation}" on element "${le.name}"!`)
                } else {
                    le.layouts.set(orientation, le.children.get(orientation));
                }
            }
        }

        return le;
    }

    static parseLayoutDescription(descriptionFile: any): LayoutElement {
        return LayoutElementFactory.create(descriptionFile.layout);
    }

    static getConstructorParamValue(descriptionObject: any, parameterName: string): any {
        if (descriptionObject.hasOwnProperty('constructorParams')) {
            for (const param of descriptionObject.constructorParams) {
                if (param.name == parameterName) {
                    return param.value;
                }
            }
        }
    }

    private static parseLayoutElementChildren(childrenDescription: LayoutDescription[]): Map<string, LayoutElement> {
        const children: Map<string, LayoutElement> = new Map<string, LayoutElement>();

        for (const layoutElementDescription of childrenDescription) {
            try {
                const le: LayoutElement = LayoutElementFactory.create(layoutElementDescription);
                if (le) {
                    if (children.has(le.name)) {
                        Logger.warning('LayoutElement ' + le.name + ' already exists! Please use unique identifiers within a single parent!');
                    } else {
                        children.set(le.name, le);
                    }
                }
            } catch (e) {
                Logger.error('LayoutElementFactory: ' + e.toString());
            }
        }

        return children;
    }
}
