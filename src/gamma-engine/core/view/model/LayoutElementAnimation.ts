import LayoutElement from './LayoutElement';

export default class LayoutElementAnimation extends LayoutElement {

    public texturePrefix: string;
    public fps: number;
    public loop: boolean;

    constructor(name: string, texturePrefix: string, fps: number, loop: boolean) {
        super(name);
        this.texturePrefix = texturePrefix;
        this.fps = fps;
        this.loop = loop;
    }
}
