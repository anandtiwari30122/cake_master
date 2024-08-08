import { Point } from 'pixi.js';

export type PlainPoint = Pick<Point, 'x' | 'y'>;
export type DekstopMobileConfiguration<T> = Record<'mobile' | 'desktop', T>;
