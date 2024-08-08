import { ITextStyle, Text, TextMetrics, TextStyle, TextStyleLineJoin } from 'pixi.js';

export const setTextStroke = function (tf: Text, color: string = '#FFFFFF', thickness: number = 2, lineJoin: TextStyleLineJoin): void {
    const ts: TextStyle | Partial<ITextStyle> = tf.style;
    ts.stroke = color;
    ts.strokeThickness = thickness;
    ts.lineJoin = lineJoin;
    tf.style = ts;
}

export const setTextDropShadow = function (tf: Text, color: string = '#000000', alpha: number = 1, angle: number = 0, blur: number = 0, distance: number = 1): void {
    const ts: TextStyle | Partial<ITextStyle> = tf.style;
    ts.dropShadow = true;
    ts.dropShadowAlpha = alpha;
    ts.dropShadowAngle = angle;
    ts.dropShadowBlur = blur;
    ts.dropShadowColor = color;
    ts.dropShadowDistance = distance;
    tf.style = ts;
}

export const setTextLetterSpacing = function (tf: Text, letterSpacing: number = 0): void {
    const ts: TextStyle | Partial<ITextStyle> = tf.style;
    ts.letterSpacing = letterSpacing;
    tf.style = ts;
}

// TODO: add use case explanation
export const autoscaleText = function (tf: Text, maxFontSize: number, maxWidth: number, maxHeight: number): void {
    const ts: TextStyle = tf.style;
    let fontSize = maxFontSize;

    ts.fontSize = fontSize;
    while (tf.width > maxWidth || tf.height > maxHeight) {
        fontSize--;
        ts.fontSize = `${fontSize}px`;
        tf.style = ts;
    }
}

// TODO: add use case explanation
export const measureFontSize = function(tf: Text, width: number, height: number): number {
    const text = tf.text;
    const style = tf.style;
    style.fontSize = 1;

    let metrics = TextMetrics.measureText(text, style);
    while (metrics.width < width && metrics.height < height) {
        style.fontSize++;
        metrics = TextMetrics.measureText(text, style);
    }

    return style.fontSize;
}
