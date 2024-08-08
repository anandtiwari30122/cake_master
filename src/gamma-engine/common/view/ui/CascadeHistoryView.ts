import { Container, DisplayObject, Graphics } from 'pixi.js';
import LayoutElement from '../../../core/view/model/LayoutElement';
import LayoutBuilder from '../../../core/utils/LayoutBuilder';
import { CascadeHistoryCell } from './CascadeHistoryCell';
import { Tweener } from '../../../core/tweener/engineTween';
import SymbolView from '../../../slots/view/SymbolView';
import { SymbolData } from '../../../slots/view/SymbolData';
import { container } from 'tsyringe';
import { CommonTokenConstants } from '../../tsyringe/tokens/CommonTokenConstants';

export class CascadeHistoryView extends Container {
  private background: Graphics;
  private content: Container;
  private contentMask: Graphics;

  private offset: number = 50;
  private maxElements: number;
  private fallingTIme: number;

  private layout: LayoutElement;
  private offsetBetweenCascades: number;
  constructor(le: LayoutElement) {
    super();
    this.layout = le;
    LayoutBuilder.create(le, this);
    this.content.mask = this.contentMask;
    this.fallingTIme = container.resolve(
      CommonTokenConstants.CASCADE_HISTORY_VIEW_FALLING_TIME,
    );
    this.maxElements = container.resolve(
      CommonTokenConstants.CASCADE_HISTORY_VIEW_MAX_ELEMENTS,
    );
    this.offsetBetweenCascades = container.resolve(
      CommonTokenConstants.CASCADE_HISTORY_VIEW_CELL_OFFSET,
    );
  }

  public addCell(symbol: SymbolData, count: number, win: string) {
    const cell: CascadeHistoryCell = new CascadeHistoryCell(
      this.layout.customClass === 'CascadeHistoryPanel'
        ? 'CascadeHistoryCell'
        : 'CascadeHistoryCellMobile',
      { symbol: symbol, symbolCount: count, payout: win },
    );

    const previousCells: number = this.content.children.length;

    this.content.addChild(cell);
    cell.position.y = -this.background.height - cell.height;

    Tweener.addTween(cell, {
      alpha: 1,
      time: this.fallingTIme,
      transition: 'easeOutSine',
      onStart: () => {
        cell.alpha = 0;
      },
      onComplete: () => {
        if (this.content.children.length > this.maxElements) {
          this.removeLastCell(() => {
            this.moveLower();
          });
          return;
        }

        this.moveLower();
      },
    });
  }

  public reset(): void {
    for (let i = 0; i < this.content.children.length; i++) {
      const cell = this.content.children[i];
      Tweener.removeTweens(cell);
      Tweener.addTween(cell, {
        y: cell.y + 10,
        alpha: 0,
        time: this.fallingTIme,
        transition: 'easeOutQuint',
        onComplete: () => {
          this.removeChild(cell);
          cell.destroy({ children: true });
        },
      });
    }
  }

  private removeLastCell(onComplete: () => void): void {
    const child: CascadeHistoryCell = this.content
      .children[0] as CascadeHistoryCell;
    Tweener.removeTweens(child);
    Tweener.addTween(child, {
      y: child.y + 10,
      alpha: 0,
      time: this.fallingTIme,
      transition: 'easeOutQuint',
      onComplete: () => {
        this.content.removeChild(child);
        child.destroy({ children: true });
        if (onComplete) onComplete();
      },
    });
  }

  private moveLower(): void {
    this.content.children.forEach((child, index) => {
      Tweener.removeTweens(child);
      Tweener.addTween(child, {
        y: -index * (child['background'].height + this.offsetBetweenCascades),
        alpha: 1,
        time: this.fallingTIme,
        transition: 'easeOutSine',
      });
    });
  }
}
