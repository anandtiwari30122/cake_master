import {Container, Text} from 'pixi.js';
import {AutoplaySettings} from '../../../slots/model/Autoplay';
import {CheckBoxOption} from './CheckBoxOption';
import {ButtonOption} from './ButtonOption';
import Button from '../../../core/view/ui/Button';
import ControlEvent from '../../../core/control/event/ControlEvent';
import {UIEvent} from '../../../slots/control/event/UIEvent';
import {AutospinOption} from '../../model/AutospinOption';
import Panel from './Panel';
import {UpdateLayoutDescription} from '../../../core/view/UpdateLayoutDescription';
import {ScreenOrientation} from '../../../core/view/ScreenOrientation';
import MetricsView from './MetricsView';
import LayoutElement from '../../../core/view/model/LayoutElement';
import {container} from 'tsyringe';
import {CommonTokenConstants} from '../../tsyringe/tokens/CommonTokenConstants';
import {DekstopMobileConfiguration, PlainPoint} from '../../tsyringe/tokens/Types';
import Translation from '../../../core/translations/Translation';

export default class AutospinPanel extends Panel {
    private buttons: ButtonOption[] = [];
    private checkboxes: Map<AutospinOption, CheckBoxOption> = new Map<AutospinOption, CheckBoxOption>();
    private backgroundWidthDefault: number;
    // VISUALS
    public content: Container;

    public tfNumberOfSpins: Text;
    public buttonsContainer: Container;
    public tfStopAutospin: Text;
    public settingsContainer: Container;

    private offsetXToMaskBorders: number;
    private buttonsSpacing: PlainPoint;
    private checkboxSpacing: DekstopMobileConfiguration<PlainPoint>;
    private maxButtonsInRow: number;
    private numberOfSpins: number[];
    private mobileContainerWidth: number;

    public btnConfirm: Button;

    constructor(le: LayoutElement, checkBoxLayout: LayoutElement, avaliableOptions: AutospinOption[]) {
        super(le);

        this.offsetXToMaskBorders = container.resolve(CommonTokenConstants.MOBILE_BORDER_PADDING);
        this.buttonsSpacing = container.resolve(CommonTokenConstants.AUTOSPIN_PANEL_BUTTON_SPACING);
        this.checkboxSpacing = container.resolve(CommonTokenConstants.AUTOSPIN_PANEL_CHECKBOX_SPACING);
        this.maxButtonsInRow = container.resolve(CommonTokenConstants.AUTOSPIN_PANEL_MOBILE_MAX_BUTTONS_IN_ROW);
        this.numberOfSpins = container.resolve(CommonTokenConstants.AUTOSPIN_PANEL_NUMBER_OF_SPINS);
        this.mobileContainerWidth = container.resolve(CommonTokenConstants.AUTOSPIN_PANEL_MOBILE_CONTAINER_WIDTH);

        this.tfNumberOfSpins = this.content['tfNumberOfSpins'];
        this.buttonsContainer = this.content['buttonsContainer'];
        this.tfStopAutospin = this.content['tfStopAutospin'];
        this.settingsContainer = this.content['settingsContainer'];
        this.backgroundWidthDefault = this.background.width;
        this.btnConfirm.on('pointerup', this.onBtnConfirm, this);
        this.buttonsContainer['area'].visible = false;
        this.settingsContainer['area'].visible = false;

        this.createButtons();
        this.createCheckboxes(checkBoxLayout, avaliableOptions);

        this.buttons[0].selected = true;
    }

    // PUBLIC API
    public override updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);
        const checkboxes: CheckBoxOption[] = Array.from(this.checkboxes.values());

        const {
            mobile: {x: checkboxesXSpacingMobile, y: checkboxesYSpacingMobile},
            desktop: {x: checkboxesXSpacingDesktop, y: checkboxesYSpacingDesktop}
        } = this.checkboxSpacing;

        const {x: buttonsXSpacing, y: buttonsYSpacing} = this.buttonsSpacing;

        // hardcoded values to accommodate iOS devices safe area

        if (desc.orientation == ScreenOrientation.VERTICAL) {
            this['background'].pivot.x = this['background'].width / 2;
            this.buttonsContainer['area'].width = this.mobileContainerWidth;
            this.buttons.forEach((btn: ButtonOption): void => {
                btn.scale.set(1, 1);
            });
            this.updateItemsGrid(this.buttons, this.buttonsContainer['area'].width, buttonsXSpacing, buttonsYSpacing, this.maxButtonsInRow);
            this.updateItemsGrid(checkboxes, desc.baseWidth, checkboxesXSpacingMobile, checkboxesYSpacingMobile);
        } else {
            this.background.pivot.x = this.background.width / 2;
            this.buttonsContainer['area'].width = this.backgroundWidthDefault - 10;
            this.buttons.forEach((btn: ButtonOption): void => {
                btn.scale.set(0.5, 0.5);
            });
            this.updateItemsGrid(this.buttons, this.buttonsContainer['area'].width, buttonsXSpacing, buttonsYSpacing);
            this.updateItemsGrid(checkboxes, desc.baseWidth, checkboxesXSpacingDesktop, checkboxesYSpacingDesktop);
        }

        this.settingsContainer.pivot.x = desc.baseWidth / 2;
        this.buttonsContainer.pivot.x = this.buttonsContainer['area'].width / 2;
        // reposition all
        this.updateItemsVertically([
            this.tfNumberOfSpins,
            this.buttonsContainer,
            this.tfStopAutospin,
            this.settingsContainer
        ], 30);
    }

    // PRIVATE API
    private get settings(): AutoplaySettings {
        const spinsNumber: number = this.getSelectedButtonValue();

        const data: AutoplaySettings = {
            spinsLeft: spinsNumber,
        };
        if (this.checkboxes.has(AutospinOption.ON_ANY_WIN))
            data.onAnyWin = this.checkboxes.get(AutospinOption.ON_ANY_WIN).hasValue();
        if (this.checkboxes.has(AutospinOption.ON_BONUS_GAME_WON))
            data.onBonusGameWon = this.checkboxes.get(AutospinOption.ON_BONUS_GAME_WON).hasValue();
        if (this.checkboxes.has(AutospinOption.ON_SINGLE_WIN_EXCEEDS))
            data.onSingleWinExceed = this.checkboxes.get(AutospinOption.ON_SINGLE_WIN_EXCEEDS).getValue();
        if (this.checkboxes.has(AutospinOption.ON_CASH_BALANCE_INCREASE_BY))
            data.onCashBalanceIncreaseBy = this.checkboxes.get(AutospinOption.ON_CASH_BALANCE_INCREASE_BY).getValue();
        if (this.checkboxes.has(AutospinOption.ON_CASH_BALANCE_DECREASE_BY))
            data.onCashBalanceDecreaseBy = this.checkboxes.get(AutospinOption.ON_CASH_BALANCE_DECREASE_BY).getValue();

        return data;
    }

    // PRIVATE API
    private createButtons(): void {
        for (let i = 0; i < this.numberOfSpins.length; i++) {
            const id: number = i;
            const value: number = this.numberOfSpins[id];
            const button: ButtonOption = new ButtonOption(value, value.toString());

            button.on('pointerup', () => {
                this.deselectButtons();
                this.buttons[i].selected = true;
            });

            this.buttonsContainer.addChild(button);
            this.buttons.push(button);
        }
    }

    private createCheckboxes(le: LayoutElement, avaliableSettings: AutospinOption[]): void {
        // create options
        avaliableSettings.forEach((setting) => {
            let settingView: CheckBoxOption;
            switch (setting) {
                case AutospinOption.ON_ANY_WIN:
                    settingView = new CheckBoxOption(Translation.t('autoSpin.tfCheckbox1'), false, le);
                    break;
                case AutospinOption.ON_BONUS_GAME_WON:
                    settingView = new CheckBoxOption(Translation.t('autoSpin.tfCheckbox2'), false, le);
                    break;
                case AutospinOption.ON_SINGLE_WIN_EXCEEDS:
                    settingView = new CheckBoxOption(Translation.t('autoSpin.tfCheckbox3'), true, le);
                    break;
                case AutospinOption.ON_CASH_BALANCE_INCREASE_BY:
                    settingView = new CheckBoxOption(Translation.t('autoSpin.tfCheckbox4'), true, le);
                    break;
                case AutospinOption.ON_CASH_BALANCE_DECREASE_BY:
                    settingView = new CheckBoxOption(Translation.t('autoSpin.tfCheckbox5'), true, le);
                    break;
            }
            this.checkboxes.set(setting, settingView);
            this.settingsContainer.addChild(settingView);
        });
    }

    private getSelectedButtonValue(): number {
        return this.buttons.find((b) => b.selected).value;
    }

    private deselectButtons(): void {
        this.buttons.forEach((b) => {
            b.selected = false;
        });
    }

    protected updateLayoutElements(width: number, x: number) {
        super.updateLayoutElements(width, x);

        // this.footerBackground.width = width;
        // this.footerBackground.x = x;
    }

    // USER INTERACTION
    public onBtnConfirm(): void {
        super.onBtnClose();
        new ControlEvent(UIEvent.AUTO_SPIN, this.settings).dispatch();
    }
}
