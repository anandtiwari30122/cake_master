import { Container, Text } from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import ScrolledSettings from './ScrolledSettings';
import Button, { ButtonState } from '../../../core/view/ui/Button';
import SoundManager from '../../../core/sound/SoundManager';
import SoundList from '../../sound/SoundList';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { UIPanelEvent } from '../../control/event/UIPanelEvent';
import { UIPanelType } from '../../model/UIState';

export default class LinkModule extends Container {
    public tfHome: Text;
    public tfGameHistory: Text;

    private btnHistory: Button;
    private btnHomeLink: Button;
    constructor(le) {
        super();
        LayoutBuilder.create(le, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.btnHistory['hitbox'].alpha = 0;
        this.btnHistory.on('pointerup', this.onBtnHistory, this);
        this.tfGameHistory.alpha = 0.5;
    }
    private customClassElementCreate(le) {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'Button':
                instance = new Button(le);
                break;
        }
        return instance;
    }

    private onBtnHistory(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.CLOSE_PANEL).dispatch();
        new ControlEvent(UIPanelEvent.OPEN_PANEL, UIPanelType.HISTORY).dispatch();
    }
}
