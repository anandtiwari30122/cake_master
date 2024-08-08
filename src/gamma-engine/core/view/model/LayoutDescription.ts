import { ScreenOrientation } from '../ScreenOrientation';

export type LayoutDescription = {
    cls: LayoutElementType,
    params: {
        name: string,
        x: number,
        y: number,
        width: number,
        height: number,
        scaleX: number,
        scaleY: number,
        pivotX: number,
        pivotY: number,
        rotation: number,
        alpha: number,
        mask: LayoutDescription,
        fps?: number,
        loop?: boolean,
        scale9Grid?: {
            params: {
                x?: number,
                y?: number
            }
        },
        tileGrid?: {
            params: {
                x?: number,
                y?: number
            }
        },
        text?: string,
        format?: {
            params: unknown
        }
        color?: number
    },
    constructorParams: {
        name?: string,
        textureName?: string,
        value?: number,
    }[],
    customParams: {
        customComponentClass?: string,
        tag?: string,
        forEditor: boolean
    }
    tweenData?: {
        effects?: unknown[]
        layouts?: ScreenOrientation[]
    },
    children: LayoutDescription[]
}

export enum LayoutElementType {
    SPRITE = 'starling.display.Sprite',
    IMAGE = 'starling.display.Image',
    TEXT_FIELD = 'starling.text.TextField',
    QUAD = 'starling.display.Quad',
    MOVIE_CLIP = 'starling.display.MovieClip'
}
