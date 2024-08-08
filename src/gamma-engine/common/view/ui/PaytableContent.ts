import ScrolledContent from './ScrolledContent';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import Button from '../../../core/view/ui/Button';

export default class PaytableContent extends ScrolledContent{
    constructor(le:LayoutElement) {
        super(le, (le)=>{
            let instance: unknown = null ;

            switch (le.customClass) {
                case 'Button':
                    instance = new Button(le);
                    break;
            }

            return instance;
        });

        // LayoutBuilder.create(le, this, (le)=>{
        //     return this.customClassElementCreate(le);
        // })
    }
}