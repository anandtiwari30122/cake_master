import LayoutElement from './LayoutElement';

export default class LayoutElementTextField extends LayoutElement {

    public text: string;
    public textFormat: any;

    constructor(name: string, text: string, textFormat?: any) {
        super(name);

        this.text = text;

        if (textFormat) {
            this.textFormat = textFormat;
        }
    }
}
