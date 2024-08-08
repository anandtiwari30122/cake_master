import {Container, Text} from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import AdjustSettings from './AdjustSettings';
import LinkModule from './LinkModule';
import AdjustTotalBet from './AdjustTotalBet';

export default class SettingsContent extends Container{
    private title:Text
    private tfSettings:Text
    private tfBetSettings:Text

    private betSettings:AdjustTotalBet
    private adjustSettings:AdjustSettings
    private linkModule:LinkModule;

    constructor(le) {
        super();
        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        })


    }

    private customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

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

        }

        return instance;
    }
}