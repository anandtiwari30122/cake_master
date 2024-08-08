import ControlCommand from '../../../core/control/command/ControlCommand';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { SlotMachineState } from '../../model/SlotMachineState';
import Wallet from '../../model/Wallet';
import SlotMachine from '../../model/SlotMachine';
import { WalletEvent } from '../../model/event/WalletEvent';
import { SlotGameEvent } from '../event/SlotGameEvent';
import { RoundResult } from '../../model/RoundResult';
import { container } from 'tsyringe';
import IGameService from '../../service/IGameService';
import Logger from '../../../core/utils/Logger';

export default class SpinStartCommand extends ControlCommand {

    public execute(): void {
        const wallet: Wallet = container.resolve(Wallet);
        const sm: SlotMachine = container.resolve(SlotMachine);

        if (wallet.balance < sm.totalBet) {
            if (sm.autoplay.enabled) {
                sm.autoplay.spinsLeft = 0;
                sm.autoplay.enabled = false;
            }

            sm.currentState = SlotMachineState.IDLE;
            wallet.emit(WalletEvent.NOT_ENOUGH_BALANCE);
            return;
        }

        wallet.balance -= sm.totalBet;

        sm.spinTimeLapsed = false;
        sm.reelsStarted = false;
        sm.stopRequested = false;
        sm.bigWinShown = false;

        sm.previousRoundResult = sm.roundResult;

        sm.roundResult.totalWinValue = 0;
        sm.roundResult = null;
        sm.currentState = SlotMachineState.SPINNING;

        const gs: IGameService = container.resolve<IGameService>('GameService');
        gs.spin(sm.currentBetValue, sm.numLines)
          .then((roundResult: RoundResult) => {
              sm.roundResult = roundResult;
              new ControlEvent(SlotGameEvent.SPIN_STOP).dispatch();
          })
          .catch((e) => {
              Logger.error(e);
              sm.roundResult = sm.getDummyRoundResult(sm.previousRoundResult);
              wallet.balance += sm.totalBet;
              sm.currentState = SlotMachineState.COMMUNICATION_ERROR;
          });
    }
}
