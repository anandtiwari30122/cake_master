import { container } from 'tsyringe';
import Wallet from '../../../gamma-engine/slots/model/Wallet';
import SlotMachine from '../../../gamma-engine/slots/model/SlotMachine';
import ControlCommand from '../../../gamma-engine/core/control/command/ControlCommand';
import {WalletEvent} from '../../../gamma-engine/slots/model/event/WalletEvent';
import {SlotMachineState} from '../../../gamma-engine/slots/model/SlotMachineState';
import {RoundResult} from '../../../gamma-engine/slots/model/RoundResult';
import IGameService from '../../../gamma-engine/slots/service/IGameService';
import {SlotGameEvent} from '../../../gamma-engine/slots/control/event/SlotGameEvent';
import Logger from '../../../gamma-engine/core/utils/Logger';
import ControlEvent from '../../../gamma-engine/core/control/event/ControlEvent';


export default class SpinStartCommandOverride extends ControlCommand {

    public execute(): void {
        const wallet: Wallet = container.resolve(Wallet);
        const sm: SlotMachine = container.resolve(SlotMachine);

        const totalBet: number = sm.totalBet  * wallet.coinValue;
        if (wallet.balance < totalBet) {
            if (sm.autoplay.enabled) {
                sm.autoplay.spinsLeft = 0;
                sm.autoplay.enabled = false;
            }

            sm.currentState = SlotMachineState.IDLE;
            wallet.emit(WalletEvent.NOT_ENOUGH_BALANCE);
            return;
        }

        wallet.balance -= totalBet;

        sm.spinTimeLapsed = false;
        sm.reelsStarted = false;
        sm.stopRequested = false;
        sm.bigWinShown = false;

        sm.previousRoundResult = sm.roundResult;

        //sm.roundResult.totalWinValue = 0;
        sm.roundResult = null;
        sm.currentState = SlotMachineState.SPINNING;

        const gs: IGameService = container.resolve<IGameService>('GameService');
        gs.spin(totalBet, sm.numLines==0?sm.combinations: sm.numLines)
            .then((roundResult: RoundResult) => {
                sm.roundResult = roundResult;
                new ControlEvent(SlotGameEvent.SPIN_STOP).dispatch();
            })
            .catch((e) => {
                Logger.error(e);
                sm.roundResult = sm.getDummyRoundResult(sm.previousRoundResult);
                wallet.balance += totalBet;
                sm.currentState = SlotMachineState.COMMUNICATION_ERROR;
            });
    }
}
