import { ResizeMethod } from './ResizeMethod';

export default interface ApplicationConfig {
    id: string,
    container: HTMLDivElement,
    backgroundColor: number,
    baseWidth: number,
    baseHeight: number,
    /**
     * Adapts base size depending on the available space orientation (default false)
     */
    autoUpdateSizeToOrientation: boolean,
    fps: number,
    resizeMethod: ResizeMethod,
    debug: boolean
}
