import LayoutElement from './LayoutElement';

export default class LayoutElementQuad extends LayoutElement {

    public color: number;

    constructor(name: string, color: number) {
        super(name);
        this.color = color;
    }
}
