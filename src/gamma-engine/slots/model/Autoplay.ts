import EventEmitter from 'eventemitter3';
import { AutoplayEvent } from './event/AutoplayEvent';
import { RoundResult } from './RoundResult';
import Logger from '../../core/utils/Logger';

export type AutoplaySettings = {
    spinsLeft: number,
    onAnyWin?: boolean,
    onBonusGameWon?: boolean,
    onSingleWinExceed?: number,
    onCashBalanceIncreaseBy?: number,
    onCashBalanceDecreaseBy?: number
}

export default class Autoplay extends EventEmitter {

    private _spinsLeft: number = -1;
    private _enabled: boolean = false;

    private _settings: AutoplaySettings = null;

    private _startBalance: number = 0;

    constructor() {
        super();
    }

    // PUBLIC API
    get spinsLeft(): number {
        return this._spinsLeft;
    }

    set spinsLeft(value: number) {
        if (this._spinsLeft == value) {
            return;
        }

        this._spinsLeft = value;
        this.emit(AutoplayEvent.SPINS_LEFT_CHANGED);
    }

    get enabled(): boolean {
        return this._enabled;
    }

    set enabled(value: boolean) {
        if (this._enabled == value) {
            return;
        }

        this._enabled = value;
        if (this._enabled) {
            this.emit(AutoplayEvent.ENABLED);
        } else {
            this.emit(AutoplayEvent.DISABLED);
        }
    }

    get settings(): AutoplaySettings {
        return this._settings;
    }

    set settings(value: AutoplaySettings) {
        this.spinsLeft = value.spinsLeft;
        this._settings = value;
    }

    canAutoSpin(latestRound: RoundResult, balance: number): boolean {
        // Check if there are spins left
        if (this.spinsLeft === 0) {
            return false;
        }

        // Check if there are settings
        if (!this._settings)
            return true;

        if (this._settings?.onAnyWin) {
            if (latestRound?.totalWinValue > 0) {
                Logger.debug('OnAnyWin STOP ' + latestRound?.totalWinValue);
                return false;
            }
        }

        if (this.settings?.onBonusGameWon) {
            if (latestRound.spins[latestRound.spins.length-1].freespins) {
                Logger.debug('OnBonusGameWon ' + latestRound);
                return false;
            }
        }

        if (this._settings?.onSingleWinExceed) {
            if (this._settings.onSingleWinExceed < latestRound?.totalWinValue) {
                Logger.debug('OnSingleWinExceed STOP ' + this._settings.onSingleWinExceed + ' ' + latestRound?.totalWinValue);
                return false;
            }
        }

        if (this._settings?.onCashBalanceIncreaseBy) {
            if (balance > this._startBalance + this._settings?.onCashBalanceIncreaseBy) {
                Logger.debug('OnCashBalanceIncreaseBy STOP ' + balance + ' ' + (this._startBalance + this._settings?.onCashBalanceIncreaseBy));
                return false;
            }
        }

        if (this._settings?.onCashBalanceDecreaseBy) {
            if (balance < this._startBalance - this._settings?.onCashBalanceDecreaseBy) {
                Logger.debug('OnCashBalanceDecreaseBy STOP ' + balance + ' ' + (this._startBalance - this._settings?.onCashBalanceDecreaseBy));
                return false;
            }
        }

        return true;
    }

    set startBalance(value: number) {
        this._startBalance = value;
        Logger.debug('start balance ' + this._startBalance);
    }
}
