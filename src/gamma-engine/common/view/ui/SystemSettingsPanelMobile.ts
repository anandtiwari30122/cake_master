import Panel from './Panel';
import AssetsManager from '../../../core/assets/AssetsManager';
import {UpdateLayoutDescription} from '../../../core/view/UpdateLayoutDescription';
import ScrolledSettings from './ScrolledSettings';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import LayoutElement from '../../../core/view/model/LayoutElement';
import {Container, Graphics} from 'pixi.js';
import { container } from 'tsyringe';
import { CommonTokenConstants } from '../../tsyringe/tokens/CommonTokenConstants';

export default class SystemSettingsPanelMobile extends Panel{
    private scrolledSettings:ScrolledSettings
    private content;

    constructor() {
        super(AssetsManager.layouts.get('SystemSettingsPanelMobile'));

        this.updateItemsVertically(this.content.children , 100);
    }

    public updateLayout(desc: UpdateLayoutDescription) {
        super.updateLayout(desc);
        this['background'].pivot.x = this['background'].width/2;
    }

    public customClassElementCreate(le){
        let instance: unknown
        switch (le.customClass) {
            case 'ScrolledSettings':
                instance = new ScrolledSettings(le,this);
                break;
                default :
                    instance = super.customClassElementCreate(le)

            }

        return instance;
    }

}