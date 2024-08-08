import Panel from './Panel';
import AssetsManager from '../../../core/assets/AssetsManager';
import { Text } from 'pixi.js';
import { SwitchState } from './SwitchState';
import LayoutElement from '../../../core/view/model/LayoutElement';
import AdjustSettings from './AdjustSettings';
import LinkModule from './LinkModule';
import AdjustTotalBet from './AdjustTotalBet';

export default class SystemSettingsPanel extends Panel {


    private adjustSettings: AdjustSettings
    private betSettings: AdjustTotalBet
    private linkModule: LinkModule;

    public title: Text
    constructor() {
        super(AssetsManager.layouts.get('SystemSettingsPanel'));

    }

    public customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown

        switch (le.customClass) {
            case 'AdjustSettings':
                instance = new AdjustSettings(le);
                break
            case 'LinkModule':
                instance = new LinkModule(le);
                break
            case 'AdjustTotalBet':
                instance = new AdjustTotalBet(le);
                break
            default:
                instance = super.customClassElementCreate(le)

        }

        return instance;
    }
    private onQuickSpinChanged(state: SwitchState): void {

    }

}