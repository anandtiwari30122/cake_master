import {Container, Text} from 'pixi.js';
import SwitchView from './SwitchView';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import ScrolledSettings from './ScrolledSettings';

export default class SwitchModule extends Container {

    public desc:Text
    public tf:Text
    public Selection:SwitchView
    constructor(le: LayoutElement) {
        super();

        LayoutBuilder.create(le, this, (le:LayoutElement)=>{
            return this.customClassElementCreate(le)
        });
    }
    private customClassElementCreate(le){
        let instance: unknown = null;

        switch (le.customClass) {
            case 'SwitchView':
                instance = new SwitchView(le);
                break;
        }


        return instance;
    }
}