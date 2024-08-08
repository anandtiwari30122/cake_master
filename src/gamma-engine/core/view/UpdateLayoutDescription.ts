import { ScreenOrientation } from './ScreenOrientation';

export type UpdateLayoutDescription = {
    orientation: ScreenOrientation,
    baseWidth: number,
    baseHeight: number,
    currentWidth: number,
    currentHeight: number
}
