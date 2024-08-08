import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import {SlotMachineState} from '../../model/SlotMachineState';
import Wallet from '../../model/Wallet';
import SlotMachine from '../../model/SlotMachine';
import {WalletEvent} from '../../model/event/WalletEvent';
import {SlotGameEvent} from '../event/SlotGameEvent';
import {RoundResult} from '../../model/RoundResult';
import {container} from 'tsyringe';
import IGameService from '../../service/IGameService';

export default class BuyFeatureCommand extends ControlCommand {


    // TODO: wait for the real BE data, maybe it can be made in start spin button with data event.
    //  currently its the same as start spin
    public execute(event: ControlEvent): void {
        const wallet: Wallet = container.resolve(Wallet);
        const sm: SlotMachine = container.resolve(SlotMachine);

        if (wallet.balance < sm.totalBet) {
            if(sm.autoplay.enabled)
                sm.autoplay.enabled = false;

            sm.currentState = SlotMachineState.IDLE;
            wallet.emit(WalletEvent.NOT_ENOUGH_BALANCE);
            return;
        }

        wallet.balance -= sm.totalBet;

        sm.spinTimeLapsed = false;
        sm.reelsStarted = false;
        sm.stopRequested = false;
        sm.bigWinShown = false;

        const previousResult:RoundResult = sm.roundResult;
        sm.roundResult=null;

        sm.currentState = SlotMachineState.SPINNING;

        const gs: IGameService = container.resolve<IGameService>('GameService');
        gs.buyFeature().then((roundResult: RoundResult) => {
            sm.roundResult = roundResult;

            new ControlEvent(SlotGameEvent.SPIN_STOP).dispatch();
        }).catch((e)=>{
            sm.roundResult = sm.getDummyRoundResult(previousResult);
            wallet.balance += sm.totalBet;
            new ControlEvent(SlotGameEvent.SPIN_STOP).dispatch();
        });
    }
}
