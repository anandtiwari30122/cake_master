import { container } from 'tsyringe';
import SlotMachine from '../../model/SlotMachine';
import { RoundResult } from '../../model/RoundResult';
import { SlotMachineState } from '../../model/SlotMachineState';
import IGameService from '../../service/IGameService';
import ControlEvent from '../../../core/control/event/ControlEvent';
import { SlotGameEvent } from '../event/SlotGameEvent';
import ControlCommand from '../../../core/control/command/ControlCommand';
import Logger from '../../../core/utils/Logger';

export default class FreeSpinStartCommand extends ControlCommand {

    public execute(): void {
        const sm: SlotMachine = container.resolve(SlotMachine);

        sm.spinTimeLapsed = false;
        sm.reelsStarted = false;
        sm.stopRequested = false;
        sm.bigWinShown = false;

        sm.previousRoundResult = sm.roundResult;
        sm.roundResult = null;
        sm.currentState = SlotMachineState.SPINNING;

        const gs: IGameService = container.resolve<IGameService>('GameService');
        gs.spin(sm.currentBetValue, sm.numLines==0?sm.combinations: sm.numLines).then((roundResult: RoundResult) => {
            sm.roundResult = roundResult;
            new ControlEvent(SlotGameEvent.SPIN_STOP).dispatch();
        }).catch((e) => {
            Logger.error(e);
            sm.roundResult = sm.getDummyRoundResult(sm.previousRoundResult);
            sm.currentState = SlotMachineState.COMMUNICATION_ERROR;
        });
    }
}
