/**
 * Various Screen and Application resize methods
 * @readonly
 * @enum {string}
 */
export enum ResizeMethod {
    /**
     * Application keeps its base size and will not resize automatically.
     * Screens will be displayed on top of each other in their base size and will not scale automatically.
     * Any overflowing screens will not be displayed.
     *
     * Useful for: Application where the size is preset and cannot change.
     */
    NONE,
    /**
     * Application resolution will match the available area. Ignores the Application base size.
     * Application will stretch and scale-down similar to CSS object-fit:fill
     * Screens resolution also will match the available area and all screens will be displayed on top of each other. Ignores the Screens base size.
     * Pixi renderer is set to new screen resolution but the stage is not scaled.
     *
     * Useful for: Application where the window can change its size, and Pixi scene should expand its boundaries i.e. visual editor, painting app.
     */
    DEFAULT,
    /**
     * Application will scale to fit in the available area while keeping the aspect ratio.
     * Application will be letterboxed similar to CSS object-fit:contain.
     * Screens will keep the aspect ratio and will all be fitted in the Application available area on top of each other.
     * Pixi renderer is set to new screen resolution and the stage is scaled according to base size to new size ratio.
     *
     * Useful for: Games that do not offer responsive UI, do not have safe area graphics and only aspect ratio has to be kept.
     */
    CONTAIN,
    /**
     * Application resolution will match the available area. Ignores the Application base size.
     * Application will stretch and scale-down similar to CSS object-fit:fill
     * Screens resolution also will match the available area and all screens will be displayed on top of each other. Ignores the Screens base size.
     * Pixi renderer is set to new screen resolution and the stage is scaled accordingly.
     *
     * Useful for: Games that offer responsive UI or have safe area graphics.
     */
    SHOW_ALL,
    /**
     * Application resolution will match the available area. Ignores the Application base size.
     * Application will stretch and scale-down similar to CSS object-fit:fill
     * Screens resolution also will match the available area and all screens will be displayed on top of each other. Ignores the Screens base size.
     * Pixi renderer will be stretched to new screen resolution and the stage is scaled accordingly.
     *
     * Useful for: Games that are not responsive and need to fill the entire screen ie. games for cabinets.
     */
    EXACT_FIT
}
