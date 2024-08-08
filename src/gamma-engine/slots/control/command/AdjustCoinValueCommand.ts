import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import SlotMachine from '../../model/SlotMachine';
import {container} from 'tsyringe';
import Wallet from '../../model/Wallet';
import {UIEvent} from '../event/UIEvent';
export default class AdjustCoinValueCommand extends ControlCommand {

    public execute(event: ControlEvent): void {
        const wallet: Wallet = container.resolve(Wallet);
        const coinValueLimits: number[] = wallet.coinValueLimits;
        if(event.type == UIEvent.COIN_VALUE_UP){
            if (coinValueLimits.indexOf(wallet.coinValue) < coinValueLimits.length - 1) {
                wallet.coinValue = coinValueLimits[coinValueLimits.indexOf(wallet.coinValue)+1];
            }
        }else if(event.type ==UIEvent.COIN_VALUE_DOWN){
            if(coinValueLimits.indexOf(wallet.coinValue) !=0 ){
                wallet.coinValue = coinValueLimits[coinValueLimits.indexOf(wallet.coinValue)-1];
            }
        }
        else if(event.type == UIEvent.COIN_VALUE_MAX){
            wallet.coinValue = coinValueLimits[coinValueLimits.length-1];
        }
    }
}