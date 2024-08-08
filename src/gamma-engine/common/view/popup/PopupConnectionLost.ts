import { Container } from 'pixi.js';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import AssetsManager from '../../../core/assets/AssetsManager';

export default class PopupConnectionLost extends Container {
    constructor() {
        super();
        LayoutBuilder.create(AssetsManager.layouts.get('PopupLostConnection'), this);
    }
}
