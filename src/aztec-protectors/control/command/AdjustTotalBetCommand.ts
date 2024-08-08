import ControlCommand from '../../../gamma-engine/core/control/command/ControlCommand';
import ControlEvent from '../../../gamma-engine/core/control/event/ControlEvent';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import {container} from 'tsyringe';
import {UIEventExtension} from '../event/UIEventExtension';
import Wallet from '../../../gamma-engine/slots/model/Wallet';

export class AdjustTotalBetCommand extends ControlCommand {
    execute(event: ControlEvent): void {
        const sm: SlotMachine = container.resolve(SlotMachine);
        const wallet: Wallet = container.resolve(Wallet);

        const currentQuantity: number = sm.betQuantity;
        const currentCoinValue: number = wallet.coinValue;
        const currentTotalBet: number = parseFloat((currentQuantity * currentCoinValue * this.numBets()).toFixed(2));

        let coinValueIndex: number;

        let totalBetChangedCoinValue: number;
        let totalBetCurrentCoinValue: number;
        const coinValueLimits: number[] = wallet.coinValueLimits;
        switch (event.type) {
            case UIEventExtension.TOTAL_BET_UP:
                coinValueIndex = (coinValueLimits.indexOf(wallet.coinValue) + 1 < coinValueLimits.length) ?coinValueLimits.indexOf(wallet.coinValue) + 1: coinValueLimits.length-1;
                if(sm.betQuantity == sm.description.betMaxQuantity){
                    wallet.coinValue = coinValueLimits[coinValueIndex];
                    sm.betQuantity = this.findBiggestQuantity(currentTotalBet, coinValueLimits[coinValueIndex]);
                }
                else{
                    sm.betQuantity++;
                }

                break;
            case UIEventExtension.TOTAL_BET_DOWN:
                coinValueIndex = coinValueLimits.indexOf(wallet.coinValue);
                const lowerCoinValue: number = coinValueLimits[coinValueIndex - 1 > 0?coinValueIndex-1: 0];
                const lowestQuantity: number = this.findLowestQuantity(currentTotalBet, lowerCoinValue);

                const lowerBetQuantity: number = sm.betQuantity - 1 > 0 ? (sm.betQuantity - 1): 0;

                totalBetChangedCoinValue = lowerCoinValue * lowestQuantity * this.numBets();
                totalBetCurrentCoinValue = lowerBetQuantity * wallet.coinValue * this.numBets();
                if(totalBetCurrentCoinValue.toFixed(2) > totalBetChangedCoinValue.toFixed(2) || coinValueIndex == 0){
                    sm.betQuantity--;
                }
                else{
                    sm.betQuantity = lowestQuantity;
                    wallet.coinValue = lowerCoinValue;
                }
                break;
        }
    }

    private findBiggestQuantity(currentTotalBet: number, coinValue: number): number{
        let quantity: number = 1;
        let newTotalBet: number = parseFloat((quantity * coinValue * this.numBets()).toFixed(2));
        while(newTotalBet <= currentTotalBet){
            quantity++;
            newTotalBet = parseFloat((quantity * coinValue * this.numBets()).toFixed(2));
        }

        return quantity;
    }

    private findLowestQuantity(currentTotalBet: number, coinValue: number): number{
        const sm: SlotMachine = container.resolve(SlotMachine);
        let quantity: number = sm.description.betMaxQuantity;
        let newTotalBet: number = quantity * coinValue * this.numBets();
        while(newTotalBet >= currentTotalBet){
            quantity--;
            newTotalBet = quantity * coinValue * this.numBets();
        }

        return  quantity;
    }

    private numBets(): number{
        const sm: SlotMachine = container.resolve(SlotMachine);
        return sm.numLines==0?sm.combinations:sm.numLines;
    }
}