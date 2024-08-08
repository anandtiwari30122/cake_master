import { Cursor, EventMode, Graphics, Point } from 'pixi.js';

export default class GraphicUtils {
    public static createRectGraphics(graphicSettings: IRectGraphicSettings): Graphics {
        graphicSettings.alpha = typeof graphicSettings.alpha == 'undefined' ? 1 : graphicSettings.alpha;
        graphicSettings.anchor = typeof graphicSettings.anchor == 'undefined' ? {x: 0, y: 0} : graphicSettings.anchor;
        graphicSettings.color = typeof graphicSettings.color == 'undefined' ? 0x000000 : graphicSettings.color;
        graphicSettings.baseAlpha = typeof graphicSettings.baseAlpha == 'undefined' ? 1 : graphicSettings.baseAlpha;
        graphicSettings.position = typeof graphicSettings.position == 'undefined' ? new Point(0, 0) : graphicSettings.position;
        graphicSettings.size = typeof graphicSettings.size == 'undefined' ? new Point(100, 100) : graphicSettings.size;
        graphicSettings.eventMode = typeof graphicSettings.eventMode == 'undefined' ? 'none' : graphicSettings.eventMode;
        graphicSettings.cursor = typeof graphicSettings.cursor == 'undefined' ? 'auto' : graphicSettings.cursor;

        const graphics: Graphics = new Graphics();
        graphics.beginFill(graphicSettings.color, graphicSettings.baseAlpha);
        graphics.drawRect(graphicSettings.position.x, graphicSettings.position.y, graphicSettings.size.x, graphicSettings.size.y);
        graphics.endFill();
        graphics.alpha = graphicSettings.alpha;
        graphics.pivot.set(graphics.width * graphicSettings.anchor.x, graphics.height * graphicSettings.anchor.y);
        graphics.eventMode = graphicSettings.eventMode;
        graphics.cursor = graphicSettings.cursor;
        return graphics;
    }
}

export type IRectGraphicSettings = {
    alpha?: number;
    color?: number;
    baseAlpha?: number;
    anchor?: { x: number; y: number };
    size?: Point;
    position?: Point;
    eventMode?: EventMode;
    cursor?: Cursor;
}
