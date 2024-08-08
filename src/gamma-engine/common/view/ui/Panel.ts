import {Container, Sprite, Text} from 'pixi.js';
import Button from '../../../core/view/ui/Button';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import LayoutElement from '../../../core/view/model/LayoutElement';
import {UIPanelEvent} from '../../control/event/UIPanelEvent';
import MetricsView from './MetricsView';
import {PopupAnimationConfig} from '../../../slots/view/popup/PopupAnimationConfig';
import SoundManager from '../../../core/sound/SoundManager';
import ControlEvent from '../../../core/control/event/ControlEvent';
import ScrolledContent from './ScrolledContent';
import IAdjustableLayout from '../../../core/view/IAdjustableLayout';
import SoundList from '../../sound/SoundList';
import {ScreenOrientation} from '../../../core/view/ScreenOrientation';
import {UpdateLayoutDescription} from '../../../core/view/UpdateLayoutDescription';
import SwitchView from './SwitchView';
import {upgradeConfig} from '@pixi/particle-emitter';
import {noConflict} from 'jquery';
import LayoutElementQuad from '../../../core/view/model/LayoutElementQuad';
import {SymbolData} from '../../../slots/view/SymbolData';
import UIState from '../../model/UIState';
import {container} from 'tsyringe';
import {UIStateEvent} from '../../model/event/UIStateEvent';

export default abstract class Panel extends Container implements IAdjustableLayout {

    public static defaultAdjustBetPanelAnimationConfiguration: PopupAnimationConfig = {
        showPopup: {
            pivotY: {
                value: 380,
                time: 0.55,
                transition: 'easeInOutQuart',
            },
            alpha: {
                value: 1,
                time: 0.2,
                transition: 'easeOutQuad',
            },
        },
        hidePopup: {
            pivotY: {
                value: 0,
                time: 0.3,
                transition: 'easeInQuad',
            },
        },
        showOverlay: {
            alpha: {
                value: 0.7,
                time: 0.2,
                transition: 'easeOutQuad',
            },
        },
        hideOverlay: {
            alpha: {
                value: 0,
                time: 0.15,
                transition: 'easeInQuad',
            },
        }
    }

    public static defaultPaytablePanelAnimationConfiguration: PopupAnimationConfig = {
        showPopup: {
            pivotY: {
                value: 0,
                time: 0.55,
                transition: 'easeInOutQuart',
            },
            alpha: {
                value: 1,
                time: 0.2,
                transition: 'easeOutQuad',
            },
        },
        hidePopup: {
            pivotY: {
                value: 0,
                time: 0.3,
                transition: 'easeInQuad',
            },
        },
        showOverlay: {
            alpha: {
                value: 0.7,
                time: 0.2,
                transition: 'easeOutQuad',
            },
        },
        hideOverlay: {
            alpha: {
                value: 0,
                time: 0.15,
                transition: 'easeInQuad',
            },
        }
    }

    // VISUALS

    protected btnClose:Button;
    public background: Sprite;


    public layoutDesc: UpdateLayoutDescription;

    protected defaultYpivot: number;

    public layout: LayoutElement;

    protected constructor(layout: LayoutElement) {
        super();

        LayoutBuilder.create(layout, this, (le: LayoutElement) => {
            return this.customClassElementCreate(le);
        });

        this.layout = layout;
        this.btnClose.on('pointerup', this.onBtnClose, this);

        this.defaultYpivot = this.pivot.y;
        //this.pivot.y = 0;
        const uiState: UIState = container.resolve(UIState);
       // uiState.once(UIStateEvent.INTERACTIVE_PANEL_TRUE, ()=>{this.btnClose.enabled = true},this)
       // uiState.once(UIStateEvent.INTERACTIVE_PANEL_FALSE, ()=>{this.btnClose.enabled = false},this)

    }

    // PUBLIC API
    updateLayout(desc: UpdateLayoutDescription): void {
         this.layoutDesc = desc;
         const offsetBorder = 100;
         const defaultDesktopBackgroundWidth:number = 1307
        if(desc.orientation == ScreenOrientation.VERTICAL) {
            this.background.width = desc.currentWidth + offsetBorder;
            this.y = desc.baseHeight / 2 + (desc.currentHeight - desc.baseHeight) / 2;
        }
        else {
            this.background.width = defaultDesktopBackgroundWidth;
            this.y = 0;
        }

        // if(desc.orientation == ScreenOrientation.VERTICAL)
        //     this.y = desc.baseHeight/2 + (desc.currentHeight - desc.baseHeight) / 2//desc.baseHeight / 2 + (desc.currentHeight - desc.baseHeight) / 2 ;
        //
        // const widthToSet: number = desc.currentWidth;
        // let xToSet: number;
        // if(desc.orientation ==ScreenOrientation.VERTICAL) {
        //     xToSet = -(desc.currentWidth - desc.baseWidth) / 2;
        // } else {
        //     xToSet = -(desc.currentWidth - desc.baseHeight) / 2;
        // }
        //
        //
        // this.updateLayoutElements(widthToSet, xToSet);
    }
    public textAlign(tf:Text,style:string):void{
        tf.style.align = 'center'
    }
    public getDefaultYPivot(): number{
        return this.defaultYpivot;
    }

    public get animationConfiguration(): PopupAnimationConfig {
        return  Panel.defaultAdjustBetPanelAnimationConfiguration;
    }

    public get animationPaytableConfiguration(): PopupAnimationConfig {
        return  Panel.defaultPaytablePanelAnimationConfiguration;
    }

    // PRIVATE API
    protected updateLayoutElements(width: number, x: number): void {
        this.background.width = width;
        this.background.x = x;

    }

    protected updateItemsGrid(items: Container[], maxWidth: number, spacingX: number, spacingY: number, maxItems: number = 0 , reducedSpacingX:number =0,standardSize:number = null, maxInRow?:number): void {
        let itemX: number = 0;
        let itemY: number = 0;
        let itemsInRow: Container[] = [];
        items.forEach((item: Container, index: number) => {
            const itemWidth = standardSize ? standardSize : item.width
            item.position.set(itemX, itemY);
            itemX += (itemWidth + spacingX);
            itemsInRow.push(item);

            if ((item.position.x + itemWidth * 2) > maxWidth || index == items.length - 1 || (maxItems > 0 && !((index+1) % maxItems))) {
                const rowWidth: number = itemsInRow.reduce((rowWidth: number, item: Container): number => {
                    return rowWidth + itemWidth + spacingX;
                }, 0) - spacingX;
                itemsInRow.forEach(item => {
                    item.x += (maxWidth - rowWidth) / 2;
                })
                itemsInRow = [];
                itemX = 0;
                itemY += (item.height + spacingY);
            }
            if(maxInRow) {
                if (itemsInRow.length == maxInRow - 1) {
                    spacingX -= reducedSpacingX
                }
            }
        });
    }

    protected updateItemsVertically(items: Container[], spacingY: number): void {
        let y: number = 0;
        items.forEach((item) => {
            item.y = y;
            y += (item.height +spacingY);
        });
    }

    // USER INTERACTION
    protected onBtnClose(): void {
        SoundManager.play(SoundList.UI_BUTTON_CLICK);
        new ControlEvent(UIPanelEvent.CLOSE_PANEL).dispatch();
    }
    protected findStandardTexture(arr:SymbolData[]){
        return arr.reduce((smallest, current) =>{
            return current.staticIcon.texture.width < smallest.staticIcon.texture.width ? current : smallest;
        }).staticIcon.texture.width;
    }

    public customClassElementCreate(le: LayoutElement): unknown {
        let instance: unknown = null;

        switch (le.customClass) {
            case 'Button':
                instance = new Button(le);
                break;
            case 'MetricsView':
                instance = new MetricsView(le);
                break;
            case 'SwitchView':
                instance= new SwitchView(le);
                break
        }
        return instance;
    }

}
