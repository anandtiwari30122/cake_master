import { Container, Graphics, Text } from 'pixi.js';
import { CheckBox, Input } from '@pixi/ui';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import AssetsManager from '../../../core/assets/AssetsManager';
import LayoutElement from '../../../core/view/model/LayoutElement';
import { container } from 'tsyringe';
import { CommonTokenConstants } from '../../tsyringe/tokens/CommonTokenConstants';
import { DekstopMobileConfiguration } from '../../tsyringe/tokens/Types';

export class CheckBoxOption extends Container {
    // VISUALS
    public background: Graphics;
    public input: Input;
    public inputBackground: Graphics;
    public checkbox: CheckBox;
    public tfText: Text;

    private allowedChars: string[];
    private fontFamily: string;
    private textColor: string;
    private fontSize: DekstopMobileConfiguration<number>;

    constructor(label: string, activeInput: boolean = true, private layout:LayoutElement) {
        super();
        this.allowedChars = container.resolve(CommonTokenConstants.CHECKBOX_OPTION_ALLOWED_CHARS);
        this.fontFamily = container.resolve(CommonTokenConstants.CHECKBOX_OPTION_FONT);
        this.textColor = container.resolve(CommonTokenConstants.CHECKBOX_OPTION_TEXT_COLOR);
        this.fontSize = container.resolve(CommonTokenConstants.CHECKBOX_OPTION_FONT_SIZE);
        
        LayoutBuilder.create(layout, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.tfText.text = label;

        if (!activeInput) {
            this.removeChild(this.input);
            this.input.destroy();
            this.input = null;

            this.removeChild(this.inputBackground);
            this.inputBackground.destroy();
            this.inputBackground = null;
        }

        if (this.input) {
            this.input.onChange.connect((e) => {
                if (
                    !this.allowedChars.includes(e[e.length - 1]) || //if the latest char is allowed
                    (e.slice(0, e.length - 1).includes('.') && e[e.length - 1] === '.') || //if the latest char isn't duplicated dot
                    (e[e.length - 1] === '.' && e.length <= 1)
                ) {
                    //if the first char isn't a dot
                    this.input.value = e.slice(0, e.length - 1);
                    this.input['stopEditing']();
                    this.input['_startEditing']();
                }
            });

            this.input.onEnter.connect(() => (this.input['placeholder'].visible = true));

            this.input.width -= 20;
        }
    }

    public hasValue(): boolean {
        if (!this.input) {
            return this.checkbox.checked;
        }

        return this.input.value !== '' && this.checkbox.checked;
    }

    public getValue(): number {
        if (this.hasValue()) return parseFloat(this.input.value);
        else return undefined;
    }

    // PRIVATE API
    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;
        switch (le.customClass) {
            case 'CheckBox':
                instance = new CheckBox({
                    style: {
                        checked: 'checkbox-checked',
                        unchecked: 'checkbox-unchecked',
                    },
                });
                break;
            case 'Input':
                if (this.layout.customClass.includes('Desktop')) {
                    instance = new Input({
                        bg: this.inputBackground,
                        placeholder: '                                                                               ', //That looks weird, but the input invokes when user click on placeholder so value has to be "spaces" to detect click.                        padding: [1, 1, 1, 1],
                        padding: [0, 1, 1, 1],
                        textStyle: {
                            fill: this.textColor,
                            fontFamily: AssetsManager.webFonts.get(this.fontFamily).family,
                            align: 'center',
                            fontSize: this.fontSize.desktop
                        },
                    });
                } else {
                    instance = new Input({
                        bg: this.inputBackground,
                        placeholder: '                               ', //That looks weird, but the input invokes when user click on placeholder so value has to be "spaces" to detect click.
                        padding: [10, 1, 6, 1],
                        textStyle: {
                            fill: this.textColor,
                            fontFamily: AssetsManager.webFonts.get(this.fontFamily).family,
                            align: 'center',
                            fontSize: this.fontSize.mobile
                        }
                    });
                }

                break;
        }
        return instance;
    }
}
