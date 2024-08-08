import ScrolledContent from './ScrolledContent';
import LayoutElement from '../../../core/view/model/LayoutElement';
import SettingsContent from './SettingsContent';
import SystemSettingsPanelMobile from './SystemSettingsPanelMobile';

export default class ScrolledSettings extends ScrolledContent{
    private SystemSettingsPanelMobile
    constructor(le:LayoutElement,SystemSettingsPanel:SystemSettingsPanelMobile) {
        super(le, ScrolledSettings.customClassElementCreate);
        this.SystemSettingsPanelMobile = SystemSettingsPanel
        this.assignContent()
    }
    private assignContent(){
        this.SystemSettingsPanelMobile.content = this.content
        this.SystemSettingsPanelMobile.updateItemsVertically(this.content.children , 100);
    }
    private static customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown =null;

        switch (le.customClass) {
            case 'SettingsContent':
                instance = new SettingsContent(le);
                break
        }

        return instance;
    }

    private updateVertical(){

    }
}