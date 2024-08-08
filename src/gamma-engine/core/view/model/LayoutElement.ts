import IEffect from '../effect/IEffect';
import { ScreenOrientation } from '../ScreenOrientation';

export default class LayoutElement {
    public name: string;

    public x: number = 0;
    public y: number = 0;

    public width: number = 0;
    public height: number = 0;

    public scaleX: number = 0;
    public scaleY: number = 0;

    public pivotX: number = 0;
    public pivotY: number = 0;

    public rotation: number = 0;

    public hitArea: number[] = null;

    public alpha: number = 1;

    public children: Map<string, LayoutElement> = new Map<string, LayoutElement>();

    public customClass: string = '';

    public mask: LayoutElement = null;

    public render: boolean = true;

    public effects: IEffect[] = [];

    public layouts: Map<ScreenOrientation, LayoutElement> = new Map<ScreenOrientation, LayoutElement>();

    constructor(name: string) {
        this.name = name;
    }
}
