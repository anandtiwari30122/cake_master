import EventEmitter from 'eventemitter3';
import { WalletEvent } from './event/WalletEvent';
import { Currency } from './Currency';
export default class Wallet extends EventEmitter {

    private static _denomination: number = 100;
    public static currency: Currency;

    private _balance: number = 0;

    private _coinValue: number;
    readonly coinValueLimits: number[];
    constructor(denomination: number, currency: Currency, coinValuesLimits?: number[]) {
        super();
        if (coinValuesLimits) {
            this.coinValueLimits = coinValuesLimits
            this._coinValue = this.coinValueLimits[0]
        }
        Wallet._denomination = denomination;
        Wallet.currency = currency;
    }

    // PUBLIC API
    public static get denomination(): number {
        return this._denomination;
    }

    public get credits(): number {
        return Math.floor(this._balance / Wallet._denomination);
    }

    public get balance(): number {
        return this._balance;
    }

    public set balance(value: number) {
        if (this._balance == value) {
            return;
        }
        this._balance = value;

        this.emit(WalletEvent.BALANCE_CHANGED);
    }

    public set coinValue(value: number) {
        if (this._coinValue == value) {
            return;
        }
        this._coinValue = value;
        this.emit(WalletEvent.COIN_VALUE_CHANGED, this._coinValue);
    }
    public get coinValue(): number {
        return this._coinValue;
    }
    public getCurrencyValue(value: number, showIsoCode: boolean = true): string {
        const amount = Number((value /Wallet._denomination).toFixed(Wallet.currency.precision));
        const isoCode = Wallet.currency.isoCode && showIsoCode ? ' ' + Wallet.currency.isoCode : '';
        return `${amount.toLocaleString('de-DE')}${isoCode}`;
    }
}
